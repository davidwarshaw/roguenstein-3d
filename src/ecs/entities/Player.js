import properties from '../../properties';

import Inventory from './Inventory';

export default class Player {
  constructor(scene) {
    // Transform
    this.height = properties.tile.heightY / 3;
    this.radius = 2;

    this.walkSpeed = 0.03;
    this.strafeSpeed = 0.02;
    this.turnSpeed = 0.003;

    this.position = new Phaser.Math.Vector2(15, 15);
    this.orientation = 0;

    this.collider = new Phaser.Geom.Circle(this.position.x, this.position.y, this.radius);

    // Stats
    this.health = 100;
    this.armor = 0;
    this.gold = 0;
    this.inventory = new Inventory();

    // Input
    scene.input.keyboard.addCapture(properties.playerKeys);
    this.keys = scene.input.keyboard.addKeys(properties.playerKeys);

    this.keys.leftScrollLeft.on('down', (key, event) => {
      this.inventory.leftScrollLeft();
    });
    this.keys.leftScrollRight.on('down', (key, event) => {
      this.inventory.leftScrollRight();
    });
    this.keys.rightScrollLeft.on('down', (key, event) => {
      this.inventory.rightScrollLeft();
    });
    this.keys.rightScrollRight.on('down', (key, event) => {
      this.inventory.rightScrollRight();
    });

    this.keys.leftAction.on('down', (key, event) => {
      //
    });
    this.keys.rightAction.on('down', (key, event) => {
      //
    });
  }

  getValue(value) {
    return this[value];
  }

  setPosition(newPosition) {
    this.position.setFromObject(newPosition);
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
  }
}
