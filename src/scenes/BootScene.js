export default class BootScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'BootScene'
    });
  }

  preload() {
    this.load.image('asciiFont', 'assets/fonts/basic_ascii.png');
    this.load.spritesheet('asciiSpriteSheet', 'assets/fonts/basic_ascii.png', {
      frameWidth: 8,
      frameHeight: 16,
      margin: 0,
      spacing: 1
    });
  }

  create() {
    this.scene.start('GameScene');
  }
}
