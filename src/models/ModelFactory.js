import * as THREE from 'three';

import properties from '../properties';

export default class ModelFactory {
  constructor() {
    this.textures = {};

    this.textures['wall'] = new THREE.TextureLoader().load('../assets/images/wall_grey.png');
    this.textures['wall'].minFilter = THREE.NearestFilter;
    this.textures['wall'].magFilter = THREE.NearestFilter;

    this.textures['floor'] = new THREE.TextureLoader().load('../assets/images/floor_grey.png');
    this.textures['floor'].minFilter = THREE.NearestFilter;
    this.textures['floor'].magFilter = THREE.NearestFilter;
    this.textures['floor'].wrapS = THREE.RepeatWrapping;
    this.textures['floor'].wrapT = THREE.RepeatWrapping;
    this.textures['floor'].offset.set(1, 1);

    this.meshResources = {};

    this.meshResources['wall'] = {};
    this.meshResources['wall']['geometry'] = new THREE.BoxBufferGeometry(
      properties.tile.widthX, properties.tile.heightY, properties.tile.widthZ);
    this.meshResources['wall']['material'] = new THREE.MeshBasicMaterial({
      map: this.textures['wall']
    });
  }

  createBaseFloor(tileWidthX, tileWidthZ) {
    const widthX = tileWidthX * properties.tile.widthX;
    const widthZ = -tileWidthZ * properties.tile.widthZ;

    const texture = this.textures['floor'];
    texture.repeat.set(tileWidthX, tileWidthZ);
    const geometry = new THREE.PlaneBufferGeometry(widthX, widthZ);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = widthX / 2;
    mesh.position.y = 0;
    mesh.position.z = widthZ / 2;
    // Planes are vertical by default
    mesh.rotation.x = Math.PI / 2;

    return mesh;
  }

  createWall(tileX, tileY) {
    const tileZ = -tileY;
    const {
      geometry,
      material
    } = this.meshResources['wall'];
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = (tileX * properties.tile.widthX) + (properties.tile.widthX / 2);
    mesh.position.y = properties.tile.heightY / 2;
    mesh.position.z = (tileZ * properties.tile.widthZ) - (properties.tile.widthZ / 2);

    return mesh;
  }

  createDoor(tileX, tileY, northSouth) {
    const tileZ = -tileY;
    const {
      geometry,
      material
    } = this.meshResources['wall'];
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = (tileX * properties.tile.widthX) + (properties.tile.widthX / 2);
    mesh.position.y = properties.tile.heightY / 2;
    mesh.position.z = (tileZ * properties.tile.widthZ) - (properties.tile.widthZ / 2);

    return mesh;
  }
}