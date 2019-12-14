import properties from './properties';

export default class Map {
  constructor(player) {
    this.prefab = [
      ['#', '#', '#', '#', '#'],
      ['#', '.', '.', '.', '.'],
      ['#', '.', '.', '.', '#'],
      ['#', '.', '.', '.', '#'],
      ['#', '#', '#', '#', '#']
    ];
    this.colliders = this.prefab
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
    return this.prefab[0].length;
  }

  getTileWidthZ() {
    return this.prefab.length;
  }

  getTileByXZ(x, z) {
    return this.prefab[z][x];
  }

  getTiles() {
    return this.prefab;
  }
}
