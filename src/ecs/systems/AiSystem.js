export default class AiSystem {
  static Run(delta, scene, player, mobs) {
    // Move
    mobs.forEach(mob => {
      const { position } = mob;
      mob.velocity = new Phaser.Math.Vector2(0, 0);
      const targetLine = new Phaser.Geom.Line(
        position.x,
        position.y,
        player.position.x,
        player.position.y
      );

      const distanceToPlayer = Phaser.Geom.Line.Length(targetLine);
      mob.targettingPlayer = distanceToPlayer <= mob.definition.vision;

      if (mob.targettingPlayer) {
        mob.orientation = Phaser.Geom.Line.Angle(targetLine);

        const movement = mob.definition.speed * delta;
        mob.velocity.setToPolar(mob.orientation, movement);
      }
      else {
        // Nothing for now
      }
    });

    // Attack
    mobs
      .filter(mob => mob.attackStatus === 'not_attacking')
      .filter(mob => Phaser.Geom.Intersects.CircleToCircle(player.collider, mob.attackCollider))
      .forEach(mob => (mob.attackStatus = 'will_attack'));
  }
}
