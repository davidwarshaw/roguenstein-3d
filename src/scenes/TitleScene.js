import properties from '../properties';

import Font from '../Font';

import ItemFactory from '../ecs/entities/ItemFactory';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'TitleScene'
    });
  }

  create() {
    this.font = new Font(this);
    this.font.render(50, 70, '+--===<[ DRAGON SMASH ]>===--+');
    this.font.render(50, 82, '|                            |');
    this.font.render(50, 98, '|  Smash dragons, get gold!  |');
    this.font.render(50, 112, '|                            |');
    this.font.render(50, 126, '+----------------------------+');
    this.font.render(76, 184, '(all assets by _never_k)');


    this.playState = {
      player: {
        maxHealth: 100,
        health: 100,
        armor: 0,
        gold: 0
      },
      inventory: {
        bag: ItemFactory.GetStartingItemDefinitions(),
        indexes: {
          left: 2,
          right: 1
        }
      }
    };

    this.input.keyboard.on('keydown', () => this.scene.start('GameScene', this.playState));
  }

}
