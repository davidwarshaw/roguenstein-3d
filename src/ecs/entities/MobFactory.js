import * as THREE from 'three';

import properties from '../../properties';

import worldMobDefinitions from './worldMobDefinitions';
import mobDefinitions from './mobDefinitions';

class Mob {
  constructor(scene, threeRenderer, definition, tile) {
    this.scene = scene;

    // Mob stats
    this.definition = JSON.parse(JSON.stringify(definition));

    this.targettingPlayer = false;
    this.attackStatus = 'not_attacking';
    this.health = this.definition.health;
    this.alive = true;

    // Animation timers
    this.attackAnimationTimer = null;
    this.attackCooldownTimer = null;

    // Transform
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

    this.attackCollider = new Phaser.Geom.Circle(
      this.position.x,
      this.position.y,
      this.definition.radius + this.definition.attackReach
    );

    // Model
    const texturePath = `assets/images/mob_${this.definition.glyph}.png`;
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

  enterHit() {
    // Hit flash color
    const color = 0xffffff;
    this.sprite.material.setValues({ color });

    this.attackAnimationTimer = this.scene.time.delayedCall(
      properties.hitAnimationTime,
      () => {
        // Revert to normal color
        const color = Number(this.definition.color);
        this.sprite.material.setValues({ color });
      },
      [],
      this
    );
  }

  enterAttack() {
    // Attack flash color
    const color = 0xff0000;
    this.sprite.material.setValues({ color });

    this.attackAnimationTimer = this.scene.time.delayedCall(
      this.definition.attackAnimationTime,
      this.enterCooldown,
      [],
      this
    );

    this.attackStatus = 'has_attacked';
  }

  enterCooldown() {
    // Revert to normal color
    const color = Number(this.definition.color);
    this.sprite.material.setValues({ color });

    this.attackCooldownTimer = this.scene.time.delayedCall(
      this.definition.attackCooldownTime,
      this.enterIdle,
      [],
      this
    );
  }

  enterIdle() {
    this.attackStatus = 'not_attacking';
  }

  rerender() {
    this.sprite.position.x = this.position.x;
    this.sprite.position.y = this.definition.height;
    this.sprite.position.z = -this.position.y;
  }
}

export default class MobFactory {
  static CreateMob(scene, threeRenderer, name, tile) {
    const definition = mobDefinitions[name];
    return new Mob(scene, threeRenderer, definition, tile);
  }

  static CreateMobs(scene, threeRenderer, map) {
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
      MobFactory.CreateMob(scene, threeRenderer, mobName, candidateTiles[i])
    );

    return mobs;
  }
}
