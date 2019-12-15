import weaponDefinitions from './weaponDefinitions';

class Weapon {
  constructor(definition) {}
  use() {}
}

export default class WeaponFactory {
  static createWeapon(type) {
    const definition = weaponDefinitions[type];
    return new Weapon(definition);
  }
}
