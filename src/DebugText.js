export default class DebugText {
  constructor(scene, camera, player) {
    this.camera = camera;
    this.player = player;

    this.cameraPosition = scene.add.text(10, 10, '');
    this.playerPosition = scene.add.text(10, 20, '');
  }

  update() {
    let x = Phaser.Math.RoundTo(this.camera.camera.position.x, -2);
    let y = Phaser.Math.RoundTo(this.camera.camera.position.z, -2);
    let phi = Phaser.Math.RoundTo(this.camera.camera.rotation.theta, -2);
    this.cameraPosition.setText(`camera: ${x}, ${y}, ${phi}`);

    x = Phaser.Math.RoundTo(this.player.position.x, -2);
    y = Phaser.Math.RoundTo(this.player.position.y, -2);
    phi = Phaser.Math.RoundTo(this.player.orientation, -2);
    this.playerPosition.setText(`player: ${x}, ${y}, ${phi}`);
  }

}
