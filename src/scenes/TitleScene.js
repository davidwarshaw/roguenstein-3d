import properties from '../properties';

import Font from '../Font';

export default class TitleScene extends Phaser.Scene {

  constructor(test) {
    super({
      key: 'TitleScene'
    });
  }

  create() {
    this.font = new Font(this);
    this.font.render(100, 100, 'Roguenstein 3D');

    this.input.keyboard.addCapture(properties.playerKeys);
    this.keys = this.input.keyboard.addKeys(properties.playerKeys);
  }

  update(time, delta) {
    if (this.keys.up.isDown || this.keys.down.isDown || this.keys.left.isDown || this.keys.right.isDown) {
      this.scene.start('GameScene');
    }
  }
}