import properties from '../../properties';

export default class Inventory {
  constructor() {
    this.bag = ['[', '(', '!', '@', '$', '%'];
    this.indexes = {
      left: 0,
      right: 1
    };
  }

  render() {}

  getSide(side) {
    return this.indexes[side] !== null ? this.bag[this.indexes[side]] : null;
  }
  getLeft() {
    return this.getSide('left');
  }
  getRight() {
    return this.getSide('right');
  }

  scrollIndex(side, direction) {
    const otherIndex = this.indexes[otherSide(side)];

    // Only scroll if there's at least one thing in the bag
    if (this.bag.length > 0) {
      this.indexes[side] = Phaser.Math.Wrap(this.indexes[side] + direction, 0, this.bag.length - 1);
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
    this.scrollIndex('right', -1);
  }

  otherSide(side) {
    return side === 'left' ? 'right' : 'left';
  }
}
