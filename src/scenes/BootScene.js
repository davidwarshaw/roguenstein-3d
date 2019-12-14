export default class BootScene extends Phaser.Scene {

  constructor(test) {
    super({
      key: 'BootScene',
    });
  }

  preload() {
    this.load.image('basicAscii', 'assets/fonts/basic_ascii.png');
  }

  create() {
    this.scene.start('GameScene');
  }
}