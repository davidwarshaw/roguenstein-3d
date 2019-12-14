export default class Font {
  constructor(scene) {
    this.scene = scene;

    const chars = [
      [
        ' ', '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?'
      ],
      [
        '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
        'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_'
      ],
      [
        '\'', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
        'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~', '|'
      ],
    ];

    const config = {
      image: 'basicAscii',
      width: 8,
      height: 16,
      chars: chars.flat().join(''),
      charsPerRow: chars[0].length,
      spacing: {
        x: 1,
        y: 1
      }
    };

    this.scene.cache.bitmapFont.add('basicAscii', Phaser.GameObjects.RetroFont.Parse(scene, config));
  }

  rectangleForCharacter(character) {
    const coords = map.forEach((tileRow, j) => {
        const i = tileRow.indexOf(character);
        if (i > 0) {
          return {
            i,
            j,
          };
        } else {
          return null;
        }
      })
      .filter(coords => coords);
  }

  render(x, y, text) {
    return this.scene.add.bitmapText(x, y, 'basicAscii', text);
  }

}