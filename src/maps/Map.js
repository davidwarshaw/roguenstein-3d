import properties from '../properties';

import prefabs from './prefabs';

export default class Map {
  constructor(player, worldName) {
    this.worldName = worldName;
    this.world = prefabs[worldName];
    this.colliders = this.world
      .map((tileRow, j) =>
        tileRow.map((tile, i) => {
          if (tile === '#') {
            const x = i * properties.tile.widthX;
            const y = j * properties.tile.widthZ;
            return new Phaser.Geom.Rectangle(x, y, properties.tile.widthX, properties.tile.widthZ);
          }
          return null;
        })
      )
      .flat()
      .filter(shape => shape);
    this.inflatedColliders = this.colliders.map(rectangle =>
      Phaser.Geom.Rectangle.Inflate(rectangle, player.radius, player.radius)
    );
  }

  getTileWidthX() {
    return this.world[0].length;
  }

  getTileWidthZ() {
    return this.world.length;
  }

  getTileByXZ(x, z) {
    return this.world[z][x];
  }

  getTiles() {
    return this.world;
  }
}
