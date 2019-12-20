import properties from '../properties';

import Font from '../Font';

export default class GameOverScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'GameOverScene'
    });
  }

  create() {
    this.font = new Font(this);
    this.font.render(42, 100, 'You were the one who was smashed!');
    this.font.render(158, 120, ':(');

    this.input.keyboard.addCapture(properties.playerKeys);
    this.keys = this.input.keyboard.addKeys(properties.playerKeys);
  }

  update(time, delta) {
    if (
      this.keys.up.isDown ||
      this.keys.down.isDown ||
      this.keys.left.isDown ||
      this.keys.right.isDown
    ) {
      this.scene.start('GameScene');
    }
  }
}
