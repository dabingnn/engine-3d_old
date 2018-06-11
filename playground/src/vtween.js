(() => {
  const { cc, app } = window;
  const { vec3 } = cc.math;

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

    tl = app._vtween.newTimeLine({loopNum: 3});

    ent1 = createBunny(-300, 0, 'bunnys_0');
    let prop1 = {
      'offsetX': { clips: { value: 100, duration: 3 }, type: 'number' }
    };
    ent1.createTimeline();
    ent1.addTracks('Image', prop1);
    tl.addChild(ent1.timeline);

    ent2 = createBunny(-200, 0, 'bunnys_1');
    let prop2 = {
      'offsetY': { clips: { value: 100, duration: 1 }, type: 'number' }
    };
    ent2.createTimeline();
    ent2.addTracks('Image', prop2);
    tl.addChild(ent2.timeline);

    ent3 = createBunny(-100, 0, 'bunnys_2');
    let prop3 = {
      'offsetY': { clips: [{ value: -100, duration: 1, delay: 1, easing: cc.vtween.easing.bounceIn }], type: 'number' }
    };
    ent3.createTimeline();
    ent3.addTracks('Image', prop3);
    tl.addChild(ent3.timeline);

    ent4 = createBunny(0, 0, 'bunnys_3');
    let prop4 = {
      'offsetX': { clips: { value: 100, duration: 1, delay: 1.5 }, type: 'number' },
      'offsetY': { clips: { value: 100, duration: 1, delay: 1.5 }, type: 'number' }
    };
    ent4.createTimeline();
    ent4.addTracks('Image', prop4);
    tl.addChild(ent4.timeline);

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