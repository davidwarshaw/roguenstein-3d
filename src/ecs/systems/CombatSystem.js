export default class CombatSystem {
  static DamagePlayer(player, damage) {
    let damageDealt = damage;
    if (player.item.left.defending) {
      const reductionPercent = player.inventory.getLeft().damageReductionPercent;
      damageDealt = damageDealt - reductionPercent * damageDealt;
    }
    if (player.item.right.defending) {
      const reductionPercent = player.inventory.getRight().damageReductionPercent;
      damageDealt = damageDealt - reductionPercent * damageDealt;
    }

    const health = Math.round(player.health - damageDealt);
    player.setValue('health', health);
  }

  static DamageMob(scene, mob, player, damage) {
    mob.health = mob.health - damage;
    if (mob.health <= 0) {
      player.setValue('gold', player.gold + mob.definition.damage);
      mob.alive = false;
      scene.threeStuff.threeScene.remove(mob.sprite);

      if (mob.definition.name.endsWith('Dragon')) {
        const dragonsSmashed = player.dragonsSmashed + 1;
        const dragonsToGo = 4 - dragonsSmashed;
        player.setValue('dragonsSmashed', dragonsSmashed);
        scene.hud.showMessage(`${dragonsSmashed} dragons smashed, ${dragonsToGo} to go!`);
      }
    }
    if (player.dragonsSmashed === 4) {
      console.log(scene);
      scene.scene.start('WinScene', player);
    }
    mob.enterHit();
  }

  static Run(delta, scene, map, player, mobs, projectiles) {
    // Handle the player attacking mobs
    ['left', 'right'].forEach(side => {
      const meleeCollider = player.item[side].meleeCollider;
      if (meleeCollider) {
        const damage = player.inventory.getSide(side).definition.damage;
        mobs
          .filter(mob => Phaser.Geom.Intersects.LineToCircle(meleeCollider, mob.collider))
          .forEach(mob => CombatSystem.DamageMob(scene, mob, player, damage));
      }
    });

    // Handle mobs attacking the player
    mobs
      .filter(mob => mob.attackStatus === 'will_attack')
      .forEach(mob => {
        CombatSystem.DamagePlayer(player, mob.definition.damage);
        mob.enterAttack();
      });

    if (player.health <= 0) {
      scene.gameOver();
    }

    // Handle the projectiles
    projectiles.forEach(projectile => {
      const { position, orientation, collider } = projectile;
      const velocity = new Phaser.Math.Vector2(0, 0).setToPolar(
        orientation,
        projectile.definition.speed
      );
      const nextPosition = new Phaser.Math.Vector2(position.x, position.y).add(velocity);

      // Mob colliders
      const mobCollision = mobs
        .filter(mob => Phaser.Geom.Circle.Contains(mob.collider, nextPosition.x, nextPosition.y))
        .some(mob => {
          CombatSystem.DamageMob(scene, mob, player, projectile.definition.damage);
          return true;
        });

      // Player collider
      const playerCollision = Phaser.Geom.Circle.Contains(
        player.collider,
        nextPosition.x,
        nextPosition.y
      );

      if (mobCollision) {
        // Kill and clena up projectile
        projectile.alive = false;
        scene.threeStuff.threeScene.remove(projectile.sprite);
      }

      if (playerCollision) {
        CombatSystem.DamagePlayer(player, projectile.definition.damage);

        // Kill and clena up projectile
        projectile.alive = false;
        scene.threeStuff.threeScene.remove(projectile.sprite);
      }

      position.setFromObject(nextPosition);
      collider.setPosition(position.x, position.y);

      projectile.rerender();
    });
  }
}
