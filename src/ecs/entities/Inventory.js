import properties from '../../properties';

import ItemFactory from './ItemFactory';

export default class Inventory {
  constructor(playStateInventory) {
    this.bag = ItemFactory.CreateItems(playStateInventory.bag);
    this.indexes = {
      left: playStateInventory.indexes.left,
      right: playStateInventory.indexes.right
    };
    console.log(this.bag);
    console.log(this.indexes);
  }

  getSide(side) {
    return this.bag[this.indexes[side]];
  }
  getLeft() {
    return this.getSide('left');
  }
  getRight() {
    return this.getSide('right');
  }

  getBySideOffset(side, offset) {
    const index = this.indexes[side];
    const offsetIndex = index + offset;
    const actualIndex = offsetIndex >= 0 && offsetIndex < this.bag.length ? offsetIndex : null;

    //console.log(`index: ${index} offsetIndex: ${offsetIndex} actualIndex: ${actualIndex}`);
    return this.indexes[side] !== null && actualIndex !== null ? this.bag[actualIndex] : null;
  }

  scrollIndex(side, direction) {
    const otherIndex = this.indexes[this.otherSide(side)];
    this.indexes[side] = Phaser.Math.Wrap(this.indexes[side] + direction, 0, this.bag.length);
    if (this.indexes[side] == otherIndex) {
      this.indexes[side] = Phaser.Math.Wrap(this.indexes[side] + direction, 0, this.bag.length);
    }
  }
  leftScrollLeft() {
    this.scrollIndex('left', -1);
  }
  leftScrollRight() {
    this.scrollIndex('left', 1);
  }
  rightScrollLeft() {
    this.scrollIndex('right', -1);
  }
  rightScrollRight() {
    this.scrollIndex('right', 1);
  }

  otherSide(side) {
    return side === 'left' ? 'right' : 'left';
  }
}
