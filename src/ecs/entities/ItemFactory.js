import itemDefinitions from './itemDefinitions';

class Item {
  constructor(definition) {
    this.definition = JSON.parse(JSON.stringify(definition));

    // Every item starts with 100 charges, even if not a wand
    this.charges = 100;
  }
  use() {}
}

export default class ItemFactory {
  static CreateItem(type) {
    const definition = itemDefinitions[type];
    return new Item(definition);
  }
  static CreateItems(definitions) {
    const items = definitions.map(definition => new Item(definition));
    return items;
  }
  static GetStartingItemDefinitions() {
    const definitions = Object.keys(itemDefinitions).map(name => itemDefinitions[name]);
    return definitions;
  }
}
