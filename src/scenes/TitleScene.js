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
    this.font.render(100, 100, 'Roguenstein 3D');

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
          left: 0,
          right: 1
        }
      }
    };

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
      this.scene.start('GameScene', this.playState);
    }
  }
}
