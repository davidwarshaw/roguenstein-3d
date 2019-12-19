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

  static DamageMob(scene, mob, damage) {
    mob.health = mob.health - damage;
    if (mob.health <= 0) {
      mob.alive = false;
      scene.threeStuff.threeScene.remove(mob.sprite);
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
          .forEach(mob => CombatSystem.DamageMob(scene, mob, damage));
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
          CombatSystem.DamageMob(scene, mob, projectile.definition.damage);
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
