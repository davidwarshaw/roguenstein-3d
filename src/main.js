import 'phaser';

import properties from './properties';

import BootScene from './scenes/BootScene';
import TitleScene from './scenes/TitleScene';
import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOverScene';
import WinScene from './scenes/WinScene';

const config = {
  type: Phaser.WEBGL,
  pixelArt: true,
  roundPixels: true,
  parent: 'game-container',
  scale: {
    width: properties.screen.width,
    height: properties.screen.height,
    zoom: 3
  },
  fps: {
    forceSetTimeOut: true,
    target: 30
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0
      }
    }
  },
  scene: [BootScene, TitleScene, GameScene, GameOverScene, WinScene]
};

const game = new Phaser.Game(config); // eslint-disable-line no-unused-vars
