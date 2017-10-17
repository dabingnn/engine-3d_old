(() => {
  const app = window.app;
  const cc = window.cc;
  let screen = app.createEntity('screen');
  screen.addComp('Screen');
  let spriteCmps = [];

  for (let i = 0; i < 3000; ++i) {
    let entity = app.createEntity(`sprite${i}`);
    entity.setParent(screen);
    entity.lpos.x = Math.random() * 800;
    entity.lpos.y = Math.random() * 600;
    let spriteCmp = entity.addComp('Sprite');
    spriteCmp.width = 64;
    spriteCmp.height = 32;
    spriteCmps.push(spriteCmp);
  }

  for (let i = 0; i < 1; ++i) {
    let entity = app.createEntity(`sprite${i}`);
    entity.setParent(screen);
    entity.lpos.x = Math.random() * 800;
    entity.lpos.y = Math.random() * 600;
    let spriteCmp = entity.addComp('Sprite');
    spriteCmp.width = 512;
    spriteCmp.height = 256;
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