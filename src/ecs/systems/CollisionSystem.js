export default class CollisionSystem {
  constructor() {}

  handlePlayer(inflatedColliders, player) {
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

  update(map, player, mobs) {
    const { inflatedColliders } = map;

    this.handlePlayer(inflatedColliders, player);

    mobs.forEach(mob => {
      const { position, velocity, collider } = mob;

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
        console.log('Collision!');
        nextPosition.setFromObject(position);
      }

      position.setFromObject(nextPosition);
      collider.setPosition(position.x, position.y);

      mob.rerender();
    });
  }
}
