(() => {
  const { app, cc } = window;
  const { vec3 } = cc.math;

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  let screen = app.createEntity('screen');
  screen.addComp('Screen');

  let entity = app.createEntity('sliced-sprite');
  entity.setParent(screen);
  let image = entity.addComp('Image');
  image.setSize(200, 50);
  image.setAnchors(0.2, 0.2, 0.8, 0.8);
  image.type = 'sliced';

  app.assets.loadUrls('texture', {
    json: '../assets/sprites/quad.json',
    image: '../assets/sprites/quad.png',
  }, (err, texture) => {
    let sprite = texture.sprites['orange-box-64x64'];
    sprite.left = 1;
    sprite.top = 1;
    sprite.right = 1;
    sprite.bottom = 1;
    sprite.commit();

    image.sprite = sprite;
  });
})();