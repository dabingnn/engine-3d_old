(() => {
  const app = window.app;
  let entity = app.createEntity('sprite');
  let spriteCmp = entity.addComp('SpriteModel');
  spriteCmp.width = 256;
  spriteCmp.height = 256;
  // spriteCmp.color = color4.new(0.6, 0.8, 0.6, 1.0);
  let textureDir = '../node_modules/assets-3d/textures';
  let urls = {
    image: `${textureDir}/skybox/skybox_px.jpg`,
  };
  app.assets.loadUrls('texture-2d', urls, (err, texture) => {
    spriteCmp.texture = texture;
  });
})();