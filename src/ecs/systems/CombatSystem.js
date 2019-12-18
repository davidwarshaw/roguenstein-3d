export default class AiSystem {
  static Run(delta, scene, player, mobs) {
    mobs
      .filter(mob => mob.attackStatus === 'will_attack')
      .forEach(mob => {
        const health = player.health - mob.definition.damage;
        player.setValue('health', health);
        mob.enterAttack();
      });

    if (player.health <= 0) {
      scene.gameOver();
    }
  }
}
