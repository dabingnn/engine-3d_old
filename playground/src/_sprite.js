(() => {
  const app = window.app;
  const cc = window.cc;
  const { color4 } = cc.math;
  let screen = app.createEntity('screen');
  screen.addComp('Screen');
  let spriteCmps = [];

  for (let i = 0; i < 10000; ++i) {
    let entity = app.createEntity(`sprite${i}`);
    entity.setParent(screen);
    let widget = entity.addComp('Widget');
    widget.width = 64;
    widget.height = 32;
    widget.setAnchors(0, 0, 0, 0);
    widget._offsetX = Math.random() * 800;
    widget._offsetY = Math.random() * 600;
    let spriteCmp = entity.addComp('Sprite');
    spriteCmp.color = color4.new(Math.random(), Math.random(), Math.random(), 1.0);
    spriteCmps.push(spriteCmp);
  }

  for (let i = 0; i < 2; ++i) {
    let entity = app.createEntity(`sprite${i}`);
    entity.setParent(screen);
    let widget = entity.addComp('Widget');
    widget.width = 512;
    widget.height = 256;
    widget.setAnchors(0, 0, 0, 0);
    widget._offsetX = Math.random() * 800;
    widget._offsetY = Math.random() * 600;
    let spriteCmp = entity.addComp('Sprite');
    spriteCmp.type = cc.SPRITE_SLICED;
    spriteCmps.push(spriteCmp);
  }

  let spriteDir = './assets/sprites';
  app.assets.registerAsset("test_sprite_texture", {
    type: 'texture-2d',
    urls: {
      json: `${spriteDir}/menu.json`,
      image: `${spriteDir}/menu.png`
    }
  });

  let urls = {
    json: `${spriteDir}/test-sprite.json`,
  };
  app.assets.loadUrls('sprite', urls, (err, sprite) => {
    sprite._left = sprite._right = 100;
    sprite._top = sprite._bottom = 50;
    // spriteCmp.texture = texture;
    sprite.commit();
    spriteCmps.forEach(spriteCmp => {
      spriteCmp.sprite = sprite;
    });
  });
})();