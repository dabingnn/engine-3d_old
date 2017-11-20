(() => {
  const app = window.app;
  const cc = window.cc;
  const { color4 } = cc.math;
  let screen = app.createEntity('screen');
  screen.addComp('Screen');
  screen._width = app._canvas.width;
  screen._height = app._canvas.height;
  let spriteCmps = [];
  let mask1 = app.createEntity('mask');
  mask1.setParent(screen);
  let widget = mask1.addComp('Widget');
  widget.width = 300;
  widget.height = 100;
  widget._pivotX = widget._pivotY = 0.5;
  widget._offsetX = screen._width * 0.5;
  widget._offsetY = screen._height * 0.5;
  mask1.addComp('Mask');

  let mask2 = app.createEntity('mask');
  {
    mask2.setParent(mask1);
    let widget = mask2.addComp('Widget');
    widget.width = 30;
    widget.height = 150;
    widget._pivotX = widget._pivotY = 0.5;
    mask2.addComp('Mask');
  }

  for (let i = 0; i < 1; ++i) {
    let entity = app.createEntity(`sprite${i}`);
    entity.setParent(mask2);
    let widget = entity.addComp('Widget');
    widget.width = 512;
    widget.height = 256;
    widget._pivotX = widget._pivotY = 0.5;

    let spriteCmp = entity.addComp('Sprite');
    spriteCmp.type = cc.SPRITE_SLICED;
    spriteCmps.push(spriteCmp);
  }

  let spriteDir = '../node_modules/assets-3d/sprites';
  app.assets.registerAsset("test_sprite_texture", {
    type: 'texture-2d',
    urls: {
      json: `${spriteDir}/menu.json`,
      image: `${spriteDir}/menu.png`
    }
  });

  let urls = {
    json: `${spriteDir}/testSprite.json`,
  };
  app.assets.loadUrls('sprite', urls, (err, sprite) => {
    sprite._left = sprite._right = 100;
    sprite._top = sprite._bottom = 50;
    // spriteCmp.texture = texture;
    sprite.commit();
    spriteCmps.forEach(spriteCmp => {
      spriteCmp.sprite = sprite;
    })
  });
})();