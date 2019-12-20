import properties from '../../properties';

import ProjectileFactory from './ProjectileFactory';

import Inventory from './Inventory';

export default class Player {
  constructor(scene) {
    // Transform
    this.height = properties.tile.heightY / 3;
    this.radius = 2;

    this.walkSpeed = 0.03;
    this.strafeSpeed = 0.02;
    this.turnSpeed = 0.003;

    this.position = new Phaser.Math.Vector2(
      19 * properties.tile.widthX,
      19 * properties.tile.widthZ
    );
    this.orientation = 0;

    this.collider = new Phaser.Geom.Circle(this.position.x, this.position.y, this.radius);

    // Timers
    this.attackCooldownTimer = null;

    // Stats
    this.maxHealth = scene.playState.player.maxHealth;
    this.health = scene.playState.player.health;
    this.armor = scene.playState.player.armor;
    this.gold = scene.playState.player.gold;
    this.inventory = new Inventory(scene.playState.inventory);
    this.leftPower = null;
    this.rightPower = null;
    this.dragonsSmashed = 0;

    // Items
    this.item = {
      left: {
        active: false,
        coolingdown: false,
        meleeCollider: null,
        defending: false
      },
      right: {
        active: false,
        coolingdown: false,
        meleeCollider: null,
        defending: false
      }
    };

    // Input
    scene.input.keyboard.addCapture(properties.playerKeys);
    this.keys = scene.input.keyboard.addKeys(properties.playerKeys);

    this.keys.leftScrollLeft.on('down', (key, event) => {
      this.inventory.leftScrollLeft();
      this.hud.showItemName(scene, 'left');
      this.hud.rerender();
    });
    this.keys.leftScrollRight.on('down', (key, event) => {
      this.inventory.leftScrollRight();
      this.hud.showItemName(scene, 'left');
      this.hud.rerender();
    });
    this.keys.rightScrollLeft.on('down', (key, event) => {
      this.inventory.rightScrollLeft();
      this.hud.showItemName(scene, 'right');
      this.hud.rerender();
    });
    this.keys.rightScrollRight.on('down', (key, event) => {
      this.inventory.rightScrollRight();
      this.hud.showItemName(scene, 'right');
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

  update(delta, scene, threeStuff) {
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
      this.useItem(scene, threeStuff, 'left');

      this.item['left'].active = true;
      this.hud.rerender();
    }
    else {
      // We don't know if we're actually defending or not, but this should
      // always be turned off on key up
      this.item['left'].defending = false;
      this.item['left'].meleeCollider = null;

      this.item['left'].active = false;
      this.hud.rerender();
    }
    if (this.keys.rightAction.isDown) {
      this.useItem(scene, threeStuff, 'right');

      this.item['right'].active = true;
      this.hud.rerender();
    }
    else {
      // We don't know if we're actually defending or not, but this should
      // always be turned off on key up
      this.item['right'].defending = false;
      this.item['right'].meleeCollider = null;

      this.item['right'].active = false;
      this.hud.rerender();
    }
  }

  useItem(scene, threeStuff, side) {
    const item = this.inventory.getSide(side);
    switch (item.definition.use) {
      case 'melee': {
        if (!this.item[side].coolingdown) {
          // Line is from player position to attack reach of weapon
          this.item[side].meleeCollider = new Phaser.Geom.Line(
            this.position.x,
            this.position.y,
            this.position.x,
            this.position.y
          );
          Phaser.Geom.Line.Extend(this.item[side].meleeCollider, 0, item.attackReach);

          // Set the cooldown
          this.attackCooldownTimer = scene.time.delayedCall(
            item.definition.cooldown,
            () => {
              this.item[side].coolingdown = false;
            },
            [],
            this
          );
          this.item[side].coolingdown = true;
        }
        break;
      }
      case 'health': {
        if (!this.item[side].coolingdown) {
          const newHealth = Phaser.Math.Clamp(
            this.health + item.definition.health,
            0,
            this.maxHealth
          );
          this.setValue('health', newHealth);

          // Set the cooldown
          this.attackCooldownTimer = scene.time.delayedCall(
            item.definition.cooldown,
            () => {
              this.item[side].coolingdown = false;
            },
            [],
            this
          );
          this.item[side].coolingdown = true;
        }
        break;
      }
      case 'defense': {
        this.item[side].defending = true;
        break;
      }
      case 'projectile': {
        if (!this.item[side].coolingdown) {
          if (item.charges >= item.definition.chargesPerUse) {
            item.charges -= item.definition.chargesPerUse;

            const projectile = ProjectileFactory.CreateProjectile(
              scene,
              threeStuff,
              item.definition.projectile,
              this.position,
              this.orientation
            );
            scene.projectiles.push(projectile);

            // See the cooldown
            this.attackCooldownTimer = scene.time.delayedCall(
              item.definition.cooldown,
              () => {
                this.item[side].coolingdown = false;
              },
              [],
              this
            );
            this.item[side].coolingdown = true;
          }
        }
        break;
      }
      default:
    }
  }
}
