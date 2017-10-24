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
    entity.lpos.x = Math.random() * 400;
    entity.lpos.y = Math.random() * 300;
    let spriteCmp = entity.addComp('Sprite');
    spriteCmp.width = 128;
    spriteCmp.height = 64;
    // spriteCmp.type = cc.SPRITE_SLICED;
    // spriteCmp.color = color4.new(1, 0, 0, 1);
    spriteCmps.push(spriteCmp);
  }

  let labelCmps = [];
  for (let i = 0; i < 1; ++i) {
    let entity = app.createEntity(`label${i}`);
    entity.setParent(screen);
    entity.lpos.x = Math.random() * 400;
    entity.lpos.y = Math.random() * 300;
    let labelCmp = entity.addComp('Label');
    labelCmp.width = 256;
    labelCmp.height = 128;
    labelCmp.label = 'Hello,Engine3D!';
    labelCmp.color = color4.new(1, 1, 1, 1);
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
    })
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