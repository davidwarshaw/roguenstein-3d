import properties from '../../properties';

import Inventory from './Inventory';

export default class Player {
  constructor(scene) {
    this.height = properties.tile.heightY / 3;
    this.radius = 2;

    this.walkSpeed = 0.03;
    this.strafeSpeed = 0.02;
    this.turnSpeed = 0.003;

    this.position = new Phaser.Math.Vector2(15, 15);
    this.orientation = 0;

    this.collider = new Phaser.Geom.Circle(this.position.x, this.position.y, this.radius);

    this.health = 100;
    this.armor = 0;
    this.gold = 0;
    this.inventory = new Inventory();

    scene.input.keyboard.addCapture(properties.playerKeys);
    this.keys = scene.input.keyboard.addKeys(properties.playerKeys);
  }

  update(delta) {
    this.velocity = new Phaser.Math.Vector2(0, 0);

    const walkMovement = this.walkSpeed * delta;
    const strafeMovement = this.strafeSpeed * delta;
    const turnMovement = this.turnSpeed * delta;

    if (this.keys.up.isDown) {
      const component = new Phaser.Math.Vector2(0, 0).setToPolar(this.orientation, walkMovement);
      this.velocity.add(component);
    }
    if (this.keys.down.isDown) {
      const component = new Phaser.Math.Vector2(0, 0).setToPolar(this.orientation, -walkMovement);
      this.velocity.add(component);
    }

    if (this.keys.left.isDown) {
      this.orientation = Phaser.Math.Wrap(this.orientation + turnMovement, -Math.PI, Math.PI);
    }
    if (this.keys.right.isDown) {
      this.orientation = Phaser.Math.Wrap(this.orientation - turnMovement, -Math.PI, Math.PI);
    }

    if (this.keys.strafeLeft.isDown) {
      const component = new Phaser.Math.Vector2(0, 0).setToPolar(
        this.orientation + Math.PI / 2,
        strafeMovement
      );
      this.velocity.add(component);
    }
    if (this.keys.strafeRight.isDown) {
      const component = new Phaser.Math.Vector2(0, 0).setToPolar(
        this.orientation + Math.PI / 2,
        -strafeMovement
      );
      this.velocity.add(component);
    }

    if (this.keys.leftScrollLeft.isDown) {
      this.inventory.leftScrollLeft();
    }
    else if (this.keys.leftScrollRight.isDown) {
      this.inventory.leftScrollRight();
    }

    if (this.keys.rightScrollLeft.isDown) {
      this.inventory.rightScrollLeft();
    }
    else if (this.keys.rightScrollRight.isDown) {
      this.inventory.rightScrollRight();
    }
  }
}
