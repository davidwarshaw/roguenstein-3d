import properties from '../properties';

export default class Hud {
  constructor(scene, font, player) {
    this.font = font;
    this.player = player;

    const height = 32;
    const margin = 8;
    const rowBase = properties.screen.height - height;
    const iconOffset = 16;
    const colOffset = 62;
    const rowOffset = 16;

    this.itemViewY = 150;
    const itemViewXFromCenter = 90;
    const itemViewXLeft = properties.screen.width / 2 - itemViewXFromCenter;
    const itemViewXRight = properties.screen.width / 2 + itemViewXFromCenter;
    this.itemActivateYTravel = 50;

    this.itemViews = {
      left: scene.add.image(
        itemViewXLeft,
        this.itemViewY,
        'asciiSpriteSheet',
        font.getFrameForCharacter('1')
      ),
      right: scene.add.image(
        itemViewXRight,
        this.itemViewY,
        'asciiSpriteSheet',
        font.getFrameForCharacter('2')
      )
    };
    ['left', 'right'].forEach(side => {
      this.itemViews[side].scale = 10;
    });

    this.graphics = scene.add.graphics();
    this.graphics.fillStyle(0x000000);
    this.graphics.fillRect(0, properties.screen.height - height, properties.screen.width, height);

    const displayConfigs = [
      [
        { character: '@', field: 'health', color: 0xff0000 },
        { character: '$', field: 'gold', color: 0xffff00 },
        {},
        { character: '!', field: 'leftPower', color: 0x0000ff },
        { character: '!', field: 'rightPower', color: 0x0000ff }
      ],
      [
        { character: '/', field: 'armor', color: 0x888888 },
        { character: '%', field: 'food', color: 0xff00ff },
        {},
        {},
        {}
      ]
    ];
    this.displays = displayConfigs.map((configRows, row) =>
      configRows.map((config, col) => {
        if (!config.character) {
          return {};
        }
        const icon = font.render(
          margin + colOffset * col,
          rowBase + rowOffset * row,
          config.character
        );
        icon.tint = config.color;
        const text = font.render(
          margin + colOffset * col + iconOffset,
          rowBase + rowOffset * row,
          0
        );
        return { config, icon, text };
      })
    );

    // Item select
    const colPosition = 3;
    const displayColOffset = 8;
    this.itemSelects = ['left', 'right'].map((side, hudCol) =>
      [-2, -1, '[', 0, ']', 1, 2].map((offset, displayCol) => {
        const isItem = typeof offset === 'number';
        const glyph = isItem ? 'x' : offset;
        const tint = isItem ? 0xff0000 : 0xffffff;
        const text = font.render(
          margin + colOffset * colPosition + colOffset * hudCol + displayColOffset * displayCol,
          rowBase + 1 * rowOffset,
          glyph
        );
        text.tint = tint;
        return { side, offset, text };
      })
    );

    // Item names
    this.itemNameTimer = null;
    this.itemNames = ['left', 'right'].map((side, i) => {
      const text = font.render(
        margin + (i * properties.screen.width) / 2,
        rowBase - displayColOffset - 2 * margin,
        ''
      );
      return { side, text };
    });
  }

  showItemName(scene, side) {
    const sideNumber = side === 'left' ? 0 : 1;
    this.itemNames[sideNumber].text.setText(this.player.inventory.getSide(side).definition.name);
    this.itemNameTimer = scene.time.delayedCall(
      properties.itemNameTime,
      () => this.itemNames[sideNumber].text.setText(''),
      [],
      this
    );
  }

  formatValue(numeric) {
    const value = numeric > 0 ? Math.round(numeric) : '-';
    return value.toString().padStart(4, '-');
  }

  rerender() {
    // Item views
    ['left', 'right'].forEach(side => {
      const item = this.player.inventory.getSide(side);
      const glyph = item ? item.definition.glyph : ' ';
      const color = item ? item.definition.color : 0x000000;

      const frame = this.font.getFrameForCharacter(glyph);
      this.itemViews[side].setTexture('asciiSpriteSheet', frame);
      this.itemViews[side].tint = color;

      if (this.player.item[side].active) {
        this.itemViews[side].y = this.itemViewY - this.itemActivateYTravel;
      }
      else {
        this.itemViews[side].y = this.itemViewY;
      }
    });

    // Numeric displays
    this.displays.forEach((displayRows, row) =>
      displayRows.forEach((display, col) => {
        const { config, text } = display;
        if (!text) {
          return;
        }
        text.setText(this.formatValue(this.player.getValue(config.field)));
      })
    );

    // Item selects
    this.itemSelects.forEach((hudSelect, hudCol) =>
      hudSelect.forEach((displaySelect, displayCol) => {
        const { side, offset, text } = displaySelect;
        let glyph = offset;
        let color = 0xffffff;

        if (typeof offset === 'number') {
          const item = this.player.inventory.getBySideOffset(side, offset);
          glyph = item !== null ? item.definition.glyph : ' ';
          color = item !== null ? item.definition.color : 0x000000;
        }

        text.setText(glyph);
        text.tint = color;
      })
    );

    // Item names
    // this.itemNames.forEach(itemName =>
    //   itemName.text.setText(this.player.inventory.getSide(itemName.side).definition.name)
    // );
  }
}
