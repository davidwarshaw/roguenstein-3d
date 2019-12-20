import * as THREE from 'three';

import properties from './properties';

import ModelFactory from './models/ModelFactory';

export default class ThreeRenderer {
  constructor(phaserScene, threeCamera, map) {
    this.threeCamera = threeCamera;
    this.extern = phaserScene.add.extern();

    this.modelFactory = new ModelFactory();

    this.threeScene = new THREE.Scene();

    // Add the base floor to scene
    const floorMesh = this.modelFactory.createBaseFloor(map.getTileWidthX(), map.getTileWidthZ());
    this.threeScene.add(floorMesh);

    // Add interesting tiles to scene
    map.getTiles().forEach((tileRow, j) =>
      tileRow.forEach((tile, i) => {
        switch (tile) {
          case '#':
          case 'R':
          case 'B':
          case 'Y':
          case 'T':
          case '"':
          case 't': {
            const mesh = this.modelFactory.createWall(i, j, tile);
            this.threeScene.add(mesh);
            break;
          }
          case '0': {
            const mesh = this.modelFactory.createPortal(i, j);
            this.threeScene.add(mesh);
            break;
          }
          case '+': {
            // Door is northSouth if there is a wall to the north
            const northSouth = map.getTileByXZ(j - 1, i) === '#';
            const mesh = this.modelFactory.createDoor(i, j, northSouth);
            this.threeScene.add(mesh);
            break;
          }
          default:
        }
      })
    );

    // Add some light
    this.light = new THREE.AmbientLight(0xffffff);
    this.threeScene.add(this.light);

    // Set up the THREE renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: phaserScene.game.canvas,
      context: phaserScene.game.context,
      antialias: false
    });

    // This is necessary (why?)
    this.renderer.autoClear = false;

    // Plug the THREE renderer into Phaser
    this.extern.render = (prenderer, pcamera, pcalcMatrix) => {
      this.renderer.state.reset();
      this.renderer.render(this.threeScene, this.threeCamera);
    };
  }
}
