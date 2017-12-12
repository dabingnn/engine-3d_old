(() => {
  const { app, cc } = window;
  const { vec3, quat, color3, color4 } = cc.math;

  let curLineColor = color3.new(0.5, 0.5, 0.0);
  let a = vec3.create();
  let b = vec3.create();
  let c = vec3.create();
  let d = vec3.create();
  let wpos = vec3.create();
  let wrot = quat.create();

  function _debugDraw(root) {
    cc.utils.walk(root, ent => {
      let widget = ent.getComp('Widget');
      widget.getWorldCorners(a, b, c, d);

      if (ent.getComp('Mask')) {
        color3.set(curLineColor, 1, 0, 0);
      } else {
        color3.set(curLineColor, 0, 1, 0);
      }

      // rect
      app.debugger.drawLine2D(a, b, curLineColor);
      app.debugger.drawLine2D(b, c, curLineColor);
      app.debugger.drawLine2D(c, d, curLineColor);
      app.debugger.drawLine2D(d, a, curLineColor);

      app.debugger.drawAxes2D(
        ent.getWorldPos(wpos),
        ent.getWorldRot(wrot),
        5.0
      );
    });
  }

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  let screen = app.createEntity('screen');
  screen.addComp('Screen');

  let mask1 = app.createEntity('mask');
  mask1.setParent(screen);
  mask1.addComp('Mask');
  {
    let widget = mask1.addComp('Widget');
    widget.setPivot(0.5, 0.5);
    widget.setSize(300, 100);
  }

  let mask2 = app.createEntity('mask');
  quat.fromEuler(mask2.lrot, 0, 0, 20);
  mask2.setParent(mask1);
  mask2.addComp('Mask');
  {
    let widget = mask2.addComp('Widget');
    widget.setPivot(0.5, 0.5);
    widget.setSize(30, 150);
  }

  let sprite1 = app.createEntity('sprite1');
  quat.fromEuler(sprite1.lrot, 0, 0, -20);
  sprite1.setParent(mask1);
  {
    let sprite = sprite1.addComp('Sprite');
    sprite.color = color4.new(0, 0, 1, 1);

    let widget = sprite1.addComp('Widget');
    widget.setPivot(0.5, 0.5);
    widget.setSize(100, 20);
    widget.setOffset(0, 50);
  }

  let sprite2 = app.createEntity('sprite1');
  sprite2.setParent(mask2);
  {
    let sprite = sprite2.addComp('Sprite');
    sprite.color = color4.new(0, 1, 0, 1);

    let widget = sprite2.addComp('Widget');
    widget.setPivot(0.5, 0.5);
    widget.setSize(80, 20);
    widget.setOffset(0, -50);
  }

  // TODO:
  // let spriteCmp = entity.addComp('Sprite');
  // spriteCmp.type = cc.SPRITE_SLICED;
  // spriteCmps.push(spriteCmp);

  // let spriteDir = './assets/sprites';
  // app.assets.registerAsset("test_sprite_texture", {
  //   type: 'texture',
  //   urls: {
  //     json: `${spriteDir}/menu.json`,
  //     image: `${spriteDir}/menu.png`
  //   }
  // });

  // let urls = {
  //   json: `${spriteDir}/test-sprite.json`,
  // };
  // app.assets.loadUrls('sprite', urls, (err, sprite) => {
  //   sprite._left = sprite._right = 100;
  //   sprite._top = sprite._bottom = 50;
  //   // spriteCmp.texture = texture;
  //   sprite.commit();
  //   spriteCmps.forEach(spriteCmp => {
  //     spriteCmp.sprite = sprite;
  //   });
  // });

  app.on('tick', () => {
    _debugDraw(screen);
  });
})();