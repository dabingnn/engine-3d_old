(() => {
  const app = window.app;
  const cc = window.cc;
  const { color4 } = cc.math;
  let screen = app.createEntity('screen');
  screen.addComp('Screen');
  let spriteCmps = [];

  for (let i = 0; i < 1; ++i) {
    let entity = app.createEntity(`sprite${i}`);
    entity.setParent(screen);
    let widget = entity.addComp('Widget');
    widget.width = 128;
    widget.height = 64;
    widget.setAnchors(0, 0, 0, 0);
    widget._offsetX = Math.random() * 400;
    widget._offsetY = Math.random() * 300;
    let spriteCmp = entity.addComp('Sprite');
    // spriteCmp.type = cc.SPRITE_SLICED;
    // spriteCmp.color = color4.new(1, 0, 0, 1);
    spriteCmps.push(spriteCmp);
  }

  let labelCmps = [];
  for (let i = 0; i < 100; ++i) {
    let entity = app.createEntity(`label_big${i}`);
    entity.setParent(screen);
    let widget = entity.addComp('Widget');
    widget.width = 512;
    widget.height = 512;
    widget.setAnchors(0, 0, 0, 0);
    widget._offsetX = 0;
    widget._offsetY = 0;
    widget.pivotX = 0;
    widget.pivotY = 0;
    let spriteCmp = entity.addComp('Sprite');
    spriteCmp.color = color4.new(Math.random(), Math.random(), Math.random(), 1.0);
    let labelCmp = entity.addComp('Label');
    labelCmp.label = 'Hello,Engine3D!\n  this is the second line. \ this is the third line. \n this is the four line.\n' +
      'a long paragraph is presented here. it is used to demonstrate long labels which need more than one pool.\n' +
      'a long paragraph is presented here. it is used to demonstrate long labels which need more than one pool.';
    labelCmp.color = color4.new(Math.random(), Math.random(), Math.random(), 1.0);
    labelCmp.horizontalAlign = cc.TEXT_ALIGN_CENTER;
    labelCmp.verticalAlign = cc.TEXT_ALIGN_CENTER;
    labelCmps.push(labelCmp);
    window._testlabel = labelCmp;
  }

  for (let i = 0; i < 100; ++i) {
    let entity = app.createEntity(`label_small${i}`);
    entity.setParent(screen);
    let widget = entity.addComp('Widget');
    widget.width = 512;
    widget.height = 128;
    widget.setAnchors(0, 0, 0, 0);
    widget._offsetX = Math.random() * 600 + 500;
    widget._offsetY = Math.random() * 300;
    let labelCmp = entity.addComp('Label');
    labelCmp.label = 'Hello,Engine3D!';
    labelCmp.color = color4.new(Math.random(), Math.random(), Math.random(), 1.0);
    labelCmps.push(labelCmp);
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
    });
  });

  let fontDir = '../node_modules/assets-3d/fonts';
  app.assets.registerAsset('test_font_mark_felt_texture', {
    type: 'texture-2d',
    urls: {
      json: `${fontDir}/MarkerTexture.json`,
      image: `${fontDir}/MarkerTexture.png`
    }
  });

  let fontUrls = {
    json: `${fontDir}/MarkerFelt.json`
  }
  app.assets.loadUrls('bmfont', fontUrls, (err, font) => {
    labelCmps.forEach(cmp => {
      cmp.font = font;
    })

  });
})();