(() => {
  const app = window.app;
  const cc = window.cc;

  const { vec3, mat4, quat, color3, color4 } = cc.math;

  let color = color3.new(0.5, 0.5, 0.0);
  let a = vec3.create();
  let b = vec3.create();
  let c = vec3.create();
  let d = vec3.create();
  let wpos = vec3.create();
  let wrot = quat.create();

  let curHover = null;
  let curMousedown = null;

  function _debugEvent (ent) {
    ent.on('mouseenter', () => {
      curHover = ent;
    });
    ent.on('mouseleave', () => {
      curHover = null;
      curMousedown = null;
    });
    ent.on('mousedown', () => {
      if (curHover === ent) {
        curMousedown = ent;
      }
    });
    ent.on('mouseup', () => {
      if (curHover === ent) {
        curMousedown = null;
      }
    });
  }

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
  widget.setPivot(0.5, 0.0);
  widget.setSize(200, 50);
  widget.setAnchors(0, 0, 1, 0);
  widget.alignLeft(10);
  widget.alignRight(10);
  widget.alignBottom(5);

  let div2 = app.createEntity('div2');
  div2.setParent(div);
  widget = div2.addComp('Widget');
  widget.setPivot(0.5, 0.5);
  widget.setSize(40, 40);
  widget.setAnchors(0, 0, 0, 1);
  widget.alignLeft(2);
  widget.alignTop(2);
  widget.alignBottom(2);

    let div22 = app.createEntity('div22');
    div22.setParent(div2);
    widget = div22.addComp('Widget');
    widget.setPivot(0.5, 0.5);
    widget.setSize(10, 10);
    widget.setOffset(0, 10);

  let div3 = app.createEntity('div3');
  div3.setParent(div);
  widget = div3.addComp('Widget');
  widget.setPivot(0, 1);
  widget.setSize(10, 20);
  widget.setAnchors(0, 1, 1, 1);
  widget.alignTop(2);
  widget.alignLeft(44);
  widget.alignRight(2);

    let div33 = app.createEntity('div33');
    div33.setParent(div3);
    widget = div33.addComp('Widget');
    widget.setPivot(0, 1);
    widget.setSize(10, 20);
    widget.setAnchors(0, 0, 0.3, 1);
    widget.alignLeft(10);
    widget.alignTop(5);
    widget.alignBottom(5);

  let div4 = app.createEntity('div4');
  div4.setParent(div);
  widget = div4.addComp('Widget');
  widget.setPivot(0, 0);
  widget.setSize(40, 10);
  widget.setAnchors(1, 0, 1, 0);
  widget.alignRight(2);
  widget.alignBottom(2);

  let div5 = app.createEntity('div5');
  div5.setParent(div);
  widget = div5.addComp('Widget');
  widget.setPivot(0, 0);
  widget.setSize(40, 10);
  widget.setAnchors(1, 0, 1, 0);
  widget.alignRight(44);
  widget.alignBottom(2);

  _debugEvent(div);
  _debugEvent(div2);
  _debugEvent(div22);
  _debugEvent(div3);
  _debugEvent(div33);
  _debugEvent(div4);
  _debugEvent(div5);

  // debug draw
  let lineColor = color3.new(0.5, 0.5, 0.0);
  app.on('tick', () => {
    cc.utils.walk(screen, ent => {
      let widget = ent.getComp('Widget');
      widget.getWorldCorners(a,b,c,d);

      if (ent === curMousedown) {
        color3.set(lineColor, 0, 1, 0);
      } else if (ent === curHover) {
        color3.set(lineColor, 1, 0, 0);
      } else {
        color3.copy(lineColor, color);
      }

      // rect
      app.debugger.drawLine2D(a, b, lineColor);
      app.debugger.drawLine2D(b, c, lineColor);
      app.debugger.drawLine2D(c, d, lineColor);
      app.debugger.drawLine2D(d, a, lineColor);

      app.debugger.drawAxes2D(
        ent.getWorldPos(wpos),
        ent.getWorldRot(wrot),
        5.0
      );
    });
  });
})();