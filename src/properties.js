import * as ROT from 'rot-js';

ROT.RNG.setSeed(100);
ROT.Display.Rect.cache = true;

export default {
  debug: false,
  screen: {
    width: 320,
    height: 200
  },
  tile: {
    widthX: 8,
    widthZ: 8,
    heightY: 16
  },
  frustum: {
    fov: 60,
    near: 0.5,
    far: 800
  },
  visualRange: 500,
  scaleRatio: 3,
  rng: ROT.RNG,
  playerKeys: {
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
    strafeLeft: Phaser.Input.Keyboard.KeyCodes.COMMA,
    strafeRight: Phaser.Input.Keyboard.KeyCodes.PERIOD,
    leftAction: Phaser.Input.Keyboard.KeyCodes.K,
    rightAction: Phaser.Input.Keyboard.KeyCodes.L,
    leftScrollLeft: Phaser.Input.Keyboard.KeyCodes.U,
    leftScrollRight: Phaser.Input.Keyboard.KeyCodes.I,
    rightScrollLeft: Phaser.Input.Keyboard.KeyCodes.O,
    rightScrollRight: Phaser.Input.Keyboard.KeyCodes.P
  }
};
