export default class CollisionSystem {
  static HandlePlayer(inflatedColliders, player) {
    const { position, velocity, collider } = player;

    const nextPosition = new Phaser.Math.Vector2(position.x, position.y).add(velocity);

    const collisionX = inflatedColliders.some(collider =>
      Phaser.Geom.Rectangle.Contains(collider, nextPosition.x, position.y)
    );
    if (collisionX) {
      nextPosition.setTo(position.x, nextPosition.y);
    }

    const collisionY = inflatedColliders.some(collider =>
      Phaser.Geom.Rectangle.Contains(collider, position.x, nextPosition.y)
    );
    if (collisionY) {
      nextPosition.setTo(nextPosition.x, position.y);
    }

    position.setFromObject(nextPosition);
    collider.setPosition(position.x, position.y);
  }

  static Run(map, player, mobs) {
    const { inflatedColliders } = map;

    // Handle the player
    CollisionSystem.HandlePlayer(inflatedColliders, player);

    // Handle all the mobs
    mobs.forEach(mob => {
      const { position, velocity, collider, attackCollider } = mob;

      const nextPosition = new Phaser.Math.Vector2(position.x, position.y).add(velocity);

      // Wall colliders
      const wallCollision = inflatedColliders.some(collider =>
        Phaser.Geom.Rectangle.Contains(collider, nextPosition.x, nextPosition.y)
      );

      // Mob colliders
      const mobCollision = mobs
        .filter(mob => mob.position.x !== position.x && mob.position.y !== position.y)
        .map(mob => mob.collider)
        .some(collider => Phaser.Geom.Circle.Contains(collider, nextPosition.x, nextPosition.y));

      // PLayer collider
      const playerCollision = Phaser.Geom.Circle.Contains(
        player.collider,
        nextPosition.x,
        nextPosition.y
      );

      if (wallCollision || mobCollision || playerCollision) {
        nextPosition.setFromObject(position);
      }

      position.setFromObject(nextPosition);
      collider.setPosition(position.x, position.y);
      attackCollider.setPosition(position.x, position.y);

      mob.rerender();
    });
  }
}
