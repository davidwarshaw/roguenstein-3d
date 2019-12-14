import * as THREE from 'three';

import properties from './properties';

export default class Camera {
  constructor(player) {
    const screenRatio = properties.screen.width / properties.screen.height;
    this.camera = new THREE.PerspectiveCamera(
      properties.frustum.fov,
      screenRatio,
      properties.frustum.near,
      properties.frustum.far
    );
    this.camera.position.y = player.height;
    this.cameraUpAxis = new THREE.Vector3(0, 1, 0);
  }

  update(player) {
    // Three Z axis is Phaser negative Y axis
    this.camera.position.x = player.position.x;
    this.camera.position.z = -player.position.y;

    // Three Phi is 90 degrees lower than Phaser orientation angle
    const phi = Phaser.Math.Wrap(player.orientation - Math.PI / 2, -Math.PI, Math.PI);
    this.camera.setRotationFromAxisAngle(this.cameraUpAxis, phi);

    // Update the world after the camera rotation
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld();
  }
}
