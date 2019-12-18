import itemDefinitions from './itemDefinitions';

class Item {
  constructor(definition) {
    this.definition = JSON.parse(JSON.stringify(definition));
  }
  use() {}
}

export default class ItemFactory {
  static CreateItem(type) {
    const definition = itemDefinitions[type];
    return new Item(definition);
  }
}
