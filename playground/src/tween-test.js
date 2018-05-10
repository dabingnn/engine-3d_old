(() => {
  const { cc, app } = window;
  const { vec3, color4 } = cc.math;

  //load asset
  let bunnyTexture = null;
  let tl = null;
  let ent1 = null;
  let ent2 = null;
  let ent3 = null;
  let ent4 = null;

  app.assets.loadUrls('texture', {
    json: './assets/sprites/bunny.json',
    image: './assets/sprites/bunny.png'
  }, (err, texture) => {
    bunnyTexture = texture;

    tl = app._vtween.newTimeLine({});

    ent1 = createBunny(-300, 0, 'bunnys_0');
    let prop1 = {
      'offsetX': { tweens: { value: 100, duration: 3 }, type: 'number' }
    };
    ent1.addVTweenTask('Image', prop1, { autoplay: false });
    tl.add(ent1.timeline);

    ent2 = createBunny(-200, 0, 'bunnys_1');
    let prop2 = {
      'offsetY': { tweens: { value: 100, duration: 1 }, type: 'number' }
    };
    ent2.addVTweenTask('Image', prop2, { autoplay: false });
    tl.add(ent2.timeline);

    ent3 = createBunny(-100, 0, 'bunnys_2');
    let prop3 = {
      'offsetY': { tweens: { value: -100, duration: 1, delay: 0.8 }, type: 'number' }
    };
    ent3.addVTweenTask('Image', prop3, { autoplay: false });
    tl.add(ent3.timeline);

    ent4 = createBunny(0, 0, 'bunnys_3');
    let prop4 = {
      'offsetY': { tweens: { value: 100, duration: 1, delay: 1.5 }, type: 'number' }
    };
    ent4.addVTweenTask('Image', prop4, { autoplay: false });
    tl.add(ent4.timeline);

    tl.play();
  });

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  let screen = app.createEntity('screen');
  screen.addComp('Screen');

  function createBunny(x, y, id) {
    let ent = app.createEntity(id);

    ent.setParent(screen);
    let i = ent.addComp('Image');
    i.width = 50;
    i.height = 50;
    i.setOffset(x, y);
    i.setAnchors(0.5, 0.5, 0.5, 0.5);
    i.sprite = bunnyTexture._sprites[id];

    return ent;
  }

  app.on('tick', () => {
    if (app.input.keydown('w')) {
      if (ent1) {
        tl.restart();
      }
    }
  });

})();