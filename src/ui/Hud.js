import properties from '../properties';

export default class Hud {
  constructor(scene, font) {
    const height = 34;
    const margin = 2;
    const topTop = properties.screen.height - height + 1;
    const bottomTop = topTop + 16;

    this.graphics = scene.add.graphics();
    this.graphics.fillStyle(0x000000d);
    this.graphics.fillRect(0, properties.screen.height - height, properties.screen.width, height);

    this.healthIcon = scene.add.image(
      margin,
      topTop,
      'asciiSpriteSheet',
      font.getFrameForCharacter('+')
    );
    this.goldIcon = scene.add.image(
      margin,
      bottomTop,
      'asciiSpriteSheet',
      font.getFrameForCharacter('$')
    );
  }

  update(player) {}
}
