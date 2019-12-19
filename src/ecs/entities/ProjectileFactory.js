import * as THREE from 'three';

import properties from '../../properties';

class Projectile {
  constructor(scene, threeRenderer, definition, position, orientation) {
    // Projectile stats
    this.definition = JSON.parse(JSON.stringify(definition));
    this.alive = true;

    // Transform
    this.position = position.clone();
    this.orientation = orientation;

    this.collider = new Phaser.Geom.Circle(
      this.position.x,
      this.position.y,
      this.definition.radius
    );

    // Model
    const texturePath = `../assets/images/projectile_${this.definition.glyph}.png`;
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

  rerender() {
    this.sprite.position.x = this.position.x;
    this.sprite.position.y = 6;
    this.sprite.position.z = -this.position.y;
  }
}

export default class ProjectileFactory {
  static CreateProjectile(scene, threeRenderer, definition, position, orientation) {
    return new Projectile(scene, threeRenderer, definition, position, orientation);
  }
}
