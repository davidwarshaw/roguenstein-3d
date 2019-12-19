export default class ChargeSystem {
  static Run(delta, scene, map, player, mobs, projectiles) {
    // Refill charges
    player.inventory.bag.forEach(item => {
      const newCharges = item.charges + delta * item.definition.chargeRefill;
      item.charges = Phaser.Math.Clamp(newCharges, 0, 100);
    });

    // Update the charge numbers
    player.setValue('leftPower', player.inventory.getLeft().charges);
    player.setValue('rightPower', player.inventory.getRight().charges);
  }
}
