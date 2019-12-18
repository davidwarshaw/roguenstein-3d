export default class AiSystem {
  constructor() {}

  update(delta, player, mobs) {
    mobs.forEach(mob => mob.ai(delta, player));
  }
}
