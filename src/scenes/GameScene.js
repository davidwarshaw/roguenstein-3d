import properties from '../properties';

import Font from '../Font';
import ThreeRenderer from '../ThreeRenderer';
import Camera from '../Camera';

import Map from '../Map';

import Player from '../ecs/entities/Player';

import CollisionSystem from '../ecs/systems/CollisionSystem';

import DebugText from '../DebugText';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene'
    });
  }

  preload() {}

  create() {
    this.font = new Font(this);
    this.player = new Player(this);
    this.map = new Map(this.player);
    this.camera = new Camera(this.player);
    this.threeStuff = new ThreeRenderer(this, this.camera.camera, this.map);

    this.collisionSystem = new CollisionSystem();

    this.debugText = new DebugText(this, this.camera, this.player);
  }

  update(time, delta) {
    this.player.update(delta);

    this.collisionSystem.update(this.map, this.player);

    this.camera.update(this.player);

    if (properties.debug) {
      this.debugText.update();
    }
  }
}
