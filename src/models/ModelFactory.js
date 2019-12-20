import * as THREE from 'three';

import properties from '../properties';

export default class ModelFactory {
  constructor() {
    this.textures = {};
    this.meshResources = {};

    [
      'wall_grey',
      'wall_red',
      'wall_blue',
      'wall_yellow',
      'wall_green_1',
      'wall_green_2',
      'torch'
    ].forEach(wallType => {
      this.textures[wallType] = new THREE.TextureLoader().load(`../assets/images/${wallType}.png`);
      this.textures[wallType].minFilter = THREE.NearestFilter;
      this.textures[wallType].magFilter = THREE.NearestFilter;

      this.meshResources[wallType] = {};
      this.meshResources[wallType]['geometry'] = new THREE.BoxBufferGeometry(
        properties.tile.widthX,
        properties.tile.heightY,
        properties.tile.widthZ
      );
      this.meshResources[wallType]['material'] = new THREE.MeshBasicMaterial({
        map: this.textures[wallType]
      });
    });

    this.textures['sealedPortal'] = new THREE.TextureLoader().load(
      '../assets/images/sealed_portal.png'
    );
    this.textures['sealedPortal'].minFilter = THREE.NearestFilter;
    this.textures['sealedPortal'].magFilter = THREE.NearestFilter;

    this.textures['openPortal'] = new THREE.TextureLoader().load(
      '../assets/images/open_portal.png'
    );
    this.textures['openPortal'].minFilter = THREE.NearestFilter;
    this.textures['openPortal'].magFilter = THREE.NearestFilter;

    this.textures['floor'] = new THREE.TextureLoader().load('../assets/images/floor_grey.png');
    this.textures['floor'].minFilter = THREE.NearestFilter;
    this.textures['floor'].magFilter = THREE.NearestFilter;
    this.textures['floor'].wrapS = THREE.RepeatWrapping;
    this.textures['floor'].wrapT = THREE.RepeatWrapping;
    this.textures['floor'].offset.set(1, 1);

    this.meshResources['portal'] = {};
    this.meshResources['portal']['geometry'] = new THREE.BoxBufferGeometry(
      properties.tile.widthX,
      properties.tile.heightY,
      properties.tile.widthZ
    );
    this.meshResources['portal']['material'] = new THREE.MeshBasicMaterial({
      map: this.textures['openPortal']
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
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = widthX / 2;
    mesh.position.y = 0;
    mesh.position.z = widthZ / 2;

    // Planes are vertical by default
    mesh.rotation.x = Math.PI / 2;

    return mesh;
  }

  createWall(tileX, tileY, tile) {
    const tileZ = -tileY;
    const tileLookup = {
      '#': 'wall_grey',
      R: 'wall_red',
      B: 'wall_blue',
      Y: 'wall_yellow',
      T: 'wall_green_1',
      '"': 'wall_green_2',
      t: 'torch'
    };
    const { geometry, material } = this.meshResources[tileLookup[tile]];
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = tileX * properties.tile.widthX + properties.tile.widthX / 2;
    mesh.position.y = properties.tile.heightY / 2;
    mesh.position.z = tileZ * properties.tile.widthZ - properties.tile.widthZ / 2;

    return mesh;
  }

  createPortal(tileX, tileY) {
    const tileZ = -tileY;
    const { geometry, material } = this.meshResources['portal'];
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = tileX * properties.tile.widthX + properties.tile.widthX / 2;
    mesh.position.y = properties.tile.heightY / 2;
    mesh.position.z = tileZ * properties.tile.widthZ - properties.tile.widthZ / 2;

    return mesh;
  }

  createDoor(tileX, tileY, northSouth) {
    const tileZ = -tileY;
    const { geometry, material } = this.meshResources['wall_grey'];
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = tileX * properties.tile.widthX + properties.tile.widthX / 2;
    mesh.position.y = properties.tile.heightY / 2;
    mesh.position.z = tileZ * properties.tile.widthZ - properties.tile.widthZ / 2;

    return mesh;
  }
}
