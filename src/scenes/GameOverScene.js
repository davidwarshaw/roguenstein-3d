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

    this.input.keyboard.on('keydown', () => this.scene.start('TitleScene', this.playState));
  }
}
