(() => {
  const app = window.app;
  const cc = window.cc;

  const { vec3, quat, color3, color4 } = cc.math;

  let color = color3.new(0, 1, 0);
  let wmat = vec3.create();
  let a = vec3.create();
  let b = vec3.create();
  let c = vec3.create();
  let d = vec3.create();

  // create cube
  app.assets.loadUrls('texture-2d', {
    image: '../node_modules/assets-3d/textures/uv_checker_02.jpg'
  }, (err, texture) => {
    // create material
    let material = new cc.UnlitMaterial();
    material.useColor = true;
    material.useTexture = true;
    material.blendType = cc.BLEND_NORMAL;
    material.color = color4.new(1, 1, 1, 0.6);
    material.mainTexture = texture;

    // create entity
    let ent = app.createEntity('Box');
    let modelComp = ent.addComp('Model');
    modelComp.mesh = cc.utils.createMesh(app, cc.primitives.box(1, 1, 1, {
      widthSegments: 1,
      heightSegments: 1,
      lengthSegments: 1,
    }));
    modelComp.material = material;
  });

  // create camera
  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  // create screen
  let screen = app.createEntity('screen');
  screen.addComp('Screen');

  // create widget
  let div = app.createEntity('div');
  div.setParent(screen);
  let widget = div.addComp('Widget');
  widget.pivotX = 0.0;
  widget.pivotY = 0.0;
  widget.width = 200.0;
  widget.height = 50.0;
  widget.offsetX = 10;
  widget.offsetY = 10;

  let div2 = app.createEntity('div2');
  div2.setParent(div);
  widget = div2.addComp('Widget');
  widget.pivotX = 0.0;
  widget.pivotY = 0.0;
  widget.width = 10.0;
  widget.height = 10.0;
  widget.offsetX = 0;
  widget.offsetY = 0;
  widget.right = 2;
  widget.alignRight = true;
  widget.top = 2;
  widget.alignTop = true;
  widget.bottom = 2;
  widget.alignBottom = true;

  let div3 = app.createEntity('div2');
  div3.setParent(div);
  widget = div3.addComp('Widget');
  widget.pivotX = 0.0;
  widget.pivotY = 0.0;
  widget.width = 10.0;
  widget.height = 10.0;
  widget.offsetX = 0;
  widget.offsetY = 0;
  widget.left = 2;
  widget.alignLeft = true;
  widget.top = 2;
  widget.alignTop = true;

  // debug draw
  app.on('tick', () => {
    cc.utils.walk(screen, ent => {
      ent.getWorldMatrix(wmat);
      let widget = ent.getComp('Widget');

      // a
      vec3.set(a,
        -widget.pivotX * widget._calcWidth,
        -widget.pivotY * widget._calcHeight,
        0.0
      );
      vec3.transformMat4(a, a, wmat),

      // b
      vec3.set(b,
        -widget.pivotX * widget._calcWidth,
        (1.0 - widget.pivotY) * widget._calcHeight,
        0.0
      );
      vec3.transformMat4(b, b, wmat),

      // c
      vec3.set(c,
        (1.0 - widget.pivotX) * widget._calcWidth,
        (1.0 - widget.pivotY) * widget._calcHeight,
        0.0
      );
      vec3.transformMat4(c, c, wmat),

      // d
      vec3.set(d,
        (1.0 - widget.pivotX) * widget._calcWidth,
        -widget.pivotY * widget._calcHeight,
        0.0
      );
      vec3.transformMat4(d, d, wmat),

      // rect
      app.debugger.drawLine2D(a, b, color);
      app.debugger.drawLine2D(b, c, color);
      app.debugger.drawLine2D(c, d, color);
      app.debugger.drawLine2D(d, a, color);
    });
  });

})();