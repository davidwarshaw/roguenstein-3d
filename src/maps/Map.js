import * as ROT from 'rot-js';

import properties from '../properties';

import prefabs from './prefabs';

export default class Map {
  constructor(player, worldName) {
    this.worldName = worldName;

    // Empty world
    this.world = [...Array(39).keys()].map((tileRow, i) =>
      [...Array(39).keys()].map((tile, j) => '.')
    );

    // The central room
    prefabs[worldName].forEach((tileRow, j) =>
      tileRow.forEach((tile, i) => (this.world[j + 13][i + 13] = tile))
    );

    const yellow = new ROT.Map.DividedMaze(13, 26);
    yellow.create((j, i, isWall) => {
      this.world[i + 0][j + 0] = isWall > 0 ? 'Y' : '.';
    });
    [...Array(6).keys()].forEach(i => (this.world[13 + 6][12 - i] = '.'));

    const blue = new ROT.Map.Digger(26, 13, { dugPercentage: 60 });
    blue.create((j, i, isWall) => {
      this.world[i + 26][j + 0] = isWall > 0 ? 'B' : '.';
    });
    [...Array(6).keys()].forEach(i => (this.world[26 + i][25 - 6] = '.'));

    const red = new ROT.Map.Uniform(13, 26, { roomDugPercentage: 50 });
    red.create((j, i, isWall) => {
      this.world[i + 13][j + 26] = isWall > 0 ? 'R' : '.';
    });
    [...Array(6).keys()].forEach(i => (this.world[13 + 6][26 + i] = '.'));

    const green = new ROT.Map.Uniform(26, 13, { roomDugPercentage: 50 });
    green.create((j, i, isWall) => {
      const greenTile = properties.rng.getUniform() >= 0.6 ? 'T' : '"';
      this.world[i + 0][j + 13] = isWall > 0 ? greenTile : '.';
    });
    [...Array(6).keys()].forEach(i => (this.world[12 - i][13 + 6] = '.'));

    this.colliders = this.world
      .map((tileRow, j) =>
        tileRow.map((tile, i) => {
          if (['#', 'R', 'B', 'Y', 'T', '"', 't'].indexOf(tile) >= 0) {
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
