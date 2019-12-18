import * as THREE from 'three';

import properties from '../../properties';

import worldMobDefinitions from './worldMobDefinitions';
import mobDefinitions from './mobDefinitions';

class Mob {
  constructor(threeRenderer, definition, tile) {
    // Mob stats
    this.definition = JSON.parse(JSON.stringify(definition));

    this.targettingPlayer = false;
    this.health = this.definition.health;
    this.alive = true;
    this.position = new Phaser.Math.Vector2(
      tile.i * properties.tile.widthX + properties.tile.widthX / 2,
      tile.j * properties.tile.widthZ - properties.tile.widthZ / 2
    );
    this.orientation = 0;
    this.collider = new Phaser.Geom.Circle(
      this.position.x,
      this.position.y,
      this.definition.radius
    );

    // Model
    const texturePath = `../assets/images/mob_${this.definition.glyph}.png`;
    const map = new THREE.TextureLoader().load(texturePath);
    map.minFilter = THREE.NearestFilter;
    map.magFilter = THREE.NearestFilter;

    const color = Number(this.definition.color);
    const material = new THREE.SpriteMaterial({ map, color });
    this.sprite = new THREE.Sprite(material);

    this.sprite.scale.x = this.definition.scale * properties.tile.widthX;
    this.sprite.scale.y = this.definition.scale * properties.tile.heightY;

    threeRenderer.threeScene.add(this.sprite);
  }

  hit(amount) {
    this.health = Phaser.Math.Clamp(this.health - amount, 0, this.definition.health);
    if (this.health === 0) {
      this.alive = false;
    }
  }

  rerender() {
    this.sprite.position.x = this.position.x;
    this.sprite.position.y = this.definition.height;
    this.sprite.position.z = -this.position.y;
  }

  ai(delta, player) {
    const { position } = this;
    this.velocity = new Phaser.Math.Vector2(0, 0);
    const targetLine = new Phaser.Geom.Line(
      position.x,
      position.y,
      player.position.x,
      player.position.y
    );

    const distanceToPlayer = Phaser.Geom.Line.Length(targetLine);
    this.targettingPlayer = distanceToPlayer <= this.definition.vision;

    if (this.targettingPlayer) {
      this.orientation = Phaser.Geom.Line.Angle(targetLine);

      const movement = this.definition.speed * delta;
      this.velocity.setToPolar(this.orientation, movement);
    } else {
    }
  }
}

export default class MobFactory {
  static CreateMob(threeRenderer, name, tile) {
    const definition = mobDefinitions[name];
    return new Mob(threeRenderer, definition, tile);
  }

  static CreateMobs(threeRenderer, map) {
    const mobDef = worldMobDefinitions[map.worldName];

    const mobInstances = [];
    Object.entries(mobDef).forEach(mob => mobInstances.push([...Array(mob[1])].map(_ => mob[0])));
    const flatMobInstances = mobInstances.flat();

    const flatTiles = [];
    map.world.forEach((tileRow, j) => tileRow.forEach((tile, i) => flatTiles.push({ i, j, tile })));
    const candidateTiles = flatTiles
      .filter(tile => tile.tile === '.')
      .map(tile => ({ ...tile, randomOrder: properties.rng.getUniform() }))
      .sort((l, r) => l.randomOrder - r.randomOrder);

    const mobs = flatMobInstances.map((mobName, i) =>
      MobFactory.CreateMob(threeRenderer, mobName, candidateTiles[i])
    );

    return mobs;
  }
}
