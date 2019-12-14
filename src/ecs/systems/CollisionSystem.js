export default class CollisionSystem {
  constructor() {}

  update(map, player) {
    const { position, velocity, collider } = player;
    const { inflatedColliders } = map;

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
}
