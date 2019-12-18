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

    // Items
    this.item = {
      left: {
        active: false
      },
      right: {
        active: false
      }
    };

    // Input
    scene.input.keyboard.addCapture(properties.playerKeys);
    this.keys = scene.input.keyboard.addKeys(properties.playerKeys);

    this.keys.leftScrollLeft.on('down', (key, event) => {
      this.inventory.leftScrollLeft();
      this.hud.rerender();
    });
    this.keys.leftScrollRight.on('down', (key, event) => {
      this.inventory.leftScrollRight();
      this.hud.rerender();
    });
    this.keys.rightScrollLeft.on('down', (key, event) => {
      this.inventory.rightScrollLeft();
      this.hud.rerender();
    });
    this.keys.rightScrollRight.on('down', (key, event) => {
      this.inventory.rightScrollRight();
      this.hud.rerender();
    });
  }

  registerHud(hud) {
    this.hud = hud;
    this.hud.rerender();
  }

  getValue(value) {
    return this[value];
  }

  setValue(value, quantity) {
    this[value] = quantity;
    this.hud.rerender();
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

    if (this.keys.leftAction.isDown) {
      this.inventory.getLeft();
      this.item['left'].active = true;
      this.hud.rerender();
    }
    else {
      this.item['left'].active = false;
      this.hud.rerender();
    }
    if (this.keys.rightAction.isDown) {
      this.inventory.getRight();
      this.item['right'].active = true;
      this.hud.rerender();
    }
    else {
      this.item['right'].active = false;
      this.hud.rerender();
    }
  }
}
