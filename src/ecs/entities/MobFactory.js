import * as THREE from 'three';

import properties from '../../properties';

import worldMobDefinitions from './worldMobDefinitions';
import mobDefinitions from './mobDefinitions';

class Mob {
  constructor(threeRenderer, definition, tile) {
    this.definition = JSON.parse(JSON.stringify(definition));
    const texturePath = `../assets/images/mob_${this.definition.glyph}.png`;

    const map = new THREE.TextureLoader().load(texturePath);
    map.minFilter = THREE.NearestFilter;
    map.magFilter = THREE.NearestFilter;

    const color = Number(this.definition.color);
    const material = new THREE.SpriteMaterial({ map, color });
    this.sprite = new THREE.Sprite(material);
    console.log(tile);

    this.sprite.position.x = tile.i * properties.tile.widthX + properties.tile.widthX / 2;
    this.sprite.position.y = this.definition.height;
    this.sprite.position.z = -tile.j * properties.tile.widthZ - properties.tile.widthZ / 2;

    this.sprite.scale.x = this.definition.scale * properties.tile.widthX;
    this.sprite.scale.y = this.definition.scale * properties.tile.heightY;

    threeRenderer.threeScene.add(this.sprite);
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

    const mobs = flatMobInstances.map((mobName, i) => {
      const tile = candidateTiles[i];
      MobFactory.CreateMob(threeRenderer, mobName, tile);
    });
  }
}
