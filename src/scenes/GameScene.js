import properties from '../properties';

import Font from '../Font';
import ThreeRenderer from '../ThreeRenderer';
import Camera from '../Camera';
import Hud from '../ui/Hud';

import Map from '../maps/Map';

import Player from '../ecs/entities/Player';
import MobFactory from '../ecs/entities/MobFactory';

import CollisionSystem from '../ecs/systems/CollisionSystem';
import AiSystem from '../ecs/systems/AiSystem';
import CombatSystem from '../ecs/systems/CombatSystem';
import ChargeSystem from '../ecs/systems/ChargeSystem';

import DebugText from '../DebugText';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(playState) {
    this.playState = playState;
  }

  preload() {}

  create() {
    const worldName = 'hub';

    this.font = new Font(this);

    this.player = new Player(this);

    //this.player.setPosition({ x: 50, y: 50 });

    this.map = new Map(this.player, worldName);
    this.camera = new Camera(this.player);
    this.threeStuff = new ThreeRenderer(this, this.camera.camera, this.map);

    this.mobs = MobFactory.CreateMobs(this, this.threeStuff, this.map);
    this.projectiles = [];

    // Top UI
    this.hud = new Hud(this, this.font, this.player);
    this.debugText = new DebugText(this, this.camera, this.player);

    // Register Hud with player to receive events
    this.player.registerHud(this.hud);
  }

  update(time, delta) {
    this.player.update(delta, this, this.threeStuff);

    AiSystem.Run(delta, this, this.map, this.player, this.mobs, this.projectiles);
    CollisionSystem.Run(delta, this, this.map, this.player, this.mobs, this.projectiles);
    CombatSystem.Run(delta, this, this.map, this.player, this.mobs, this.projectiles);
    ChargeSystem.Run(delta, this, this.map, this.player, this.mobs, this.projectiles);

    // Clean up dead mobs and projectiles
    this.mobs = this.mobs.filter(mob => mob.alive);
    this.projectiles = this.projectiles.filter(projectile => projectile.alive);

    this.camera.update(this.player);

    if (properties.debug) {
      this.debugText.update();
    }
  }

  gameOver() {
    this.scene.start('GameOverScene');
  }
}
