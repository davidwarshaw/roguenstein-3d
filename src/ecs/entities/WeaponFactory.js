import weaponDefinitions from './weaponDefinitions';

class Weapon {
  constructor(definition) {
    this.definition = JSON.parse(JSON.stringify(definition));
  }
  use() {}
}

export default class WeaponFactory {
  static CreateWeapon(type) {
    const definition = weaponDefinitions[type];
    return new Weapon(definition);
  }
}
