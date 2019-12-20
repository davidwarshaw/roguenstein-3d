import properties from '../properties';

import Font from '../Font';

export default class WinScene extends Phaser.Scene {

  constructor() {
    super({
      key: 'WinScene'
    });
  }

  init(player) {
    this.player = player;
  }

  create() {
    const goldTotal = Math.round(this.player.gold).toString().padStart(3, ' ');
    this.font = new Font(this);
    this.font.render(50, 80, '+--------------------------+');
    this.font.render(50, 92, '|                          |');
    this.font.render(50, 108, '| Smashed all 4 dragons!   |');
    this.font.render(50, 122, `|       Got ${goldTotal} gold!      |`);
    this.font.render(50, 136, '|                          |');
    this.font.render(50, 150, '+--------------------------+');

    this.input.keyboard.addCapture(properties.playerKeys);
    this.keys = this.input.keyboard.addKeys(properties.playerKeys);
  }

  update(time, delta) {
    if (this.keys.up.isDown || this.keys.down.isDown || this.keys.left.isDown || this.keys.right.isDown) {
      this.scene.start('TitleScene');
    }
  }
}
