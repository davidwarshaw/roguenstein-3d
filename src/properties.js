export default {
  debug: true,
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
    near: 0.50,
    far: 800
  },
  visualRange: 500,
  scaleRatio: 3,
  playerKeys: {
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
    strafeLeft: Phaser.Input.Keyboard.KeyCodes.COMMA,
    strafeRight: Phaser.Input.Keyboard.KeyCodes.PERIOD,
    fire1: Phaser.Input.Keyboard.KeyCodes.K,
    fire2: Phaser.Input.Keyboard.KeyCodes.L
  }
};
