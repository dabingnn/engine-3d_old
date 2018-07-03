(() => {
  const { cc, app, dgui } = window;
  const { resl, path } = cc;
  const { vec3, quat, color3, color4 } = cc.math;

  let dobj = {
    baseUrl: '../assets/out',
    scene: 'spec-primitives',
    load,
    preset,
  };

  dgui.remember(dobj);
  dgui.add(dobj, 'baseUrl').onFinishChange(() => {
    load();
  });
  dgui.add(dobj, 'scene').onFinishChange(() => {
    load();
  });
  dgui.add(dobj, 'load');
  dgui.add(dobj, 'preset');

  function _debugUI(root) {
    let color = color3.new(0.5, 0.5, 0.0);
    let a = vec3.create();
    let b = vec3.create();
    let c = vec3.create();
    let d = vec3.create();
    let wpos = vec3.create();
    let wrot = quat.create();

    let curHover = null;
    let curMousedown = null;
    let curLineColor = color3.new(0.5, 0.5, 0.0);

    function _debugEvent(ent) {
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

    function _debugDraw() {
      let drawFunc = ent => {
        let widget = ent.getComp('Widget');
        widget.getWorldCorners(a, b, c, d);

        if (ent === curMousedown) {
          color3.set(curLineColor, 0, 1, 0);

          if (widget.color) {
            widget.color = color4.new(0, 1, 0, 1);
          }
        } else if (ent === curHover) {
          color3.set(curLineColor, 1, 0, 0);

          if (widget) {
            widget.color = color4.new(1, 0, 0, 1);
          }
        } else {
          color3.copy(curLineColor, color);

          if (widget) {
            widget.color = color4.new(1, 1, 1, 1);
          }
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
      };
      drawFunc(root);
      cc.utils.walk(root, drawFunc);
    }

    cc.utils.walk(root, ent => {
      _debugEvent(ent);
    });

    // debug draw
    app.off('tick', _debugDraw);
    app.on('tick', _debugDraw);
  }

  function load() {
    resl({
      manifest: {
        assetInfos: {
          type: 'text',
          parser: JSON.parse,
          src: `${dobj.baseUrl}/assets.json`
        },

        scene: {
          type: 'text',
          parser: JSON.parse,
          src: `${dobj.baseUrl}/${dobj.scene}.json`
        },
      },

      onDone(data) {
        const sceneJson = data.scene;
        const assetInfos = data.assetInfos;

        for (let uuid in assetInfos) {
          let info = assetInfos[uuid];
          for (let item in info.urls) {
            info.urls[item] = path.join(dobj.baseUrl, info.urls[item]);
          }

          app.assets.registerAsset(uuid, info);
        }

        cc.utils.parseLevel(
          app,
          sceneJson,
          (err, level) => {
            app.loadLevel(level);

            cc.utils.walk(app.activeLevel, ent => {
              let screen = ent.getComp('Screen');
              if (screen) {
                _debugUI(ent);
                return false;
              }

              return true;
            });
          }
        );
      }
    });
  }

  function preset() {
    app.loadLevel(new cc.Level());

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
    widget.setSize(-200, 50);
    widget.setAnchors(0, 0, 1, 0);
    widget.setLeft(10);
    widget.setRight(10);
    widget.setOffset(0, 10);

    let div2 = app.createEntity('div2');
    div2.setParent(div);
    widget = div2.addComp('Widget');
    widget.setPivot(0.5, 0.5);
    widget.setSize(40, 40);
    widget.setAnchors(0, 0, 0, 1);
    widget.setLeft(2);
    widget.setTop(2);
    widget.setBottom(2);

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
    widget.setTop(2);
    widget.setLeft(44);
    widget.setRight(2);

    let div33 = app.createEntity('div33');
    div33.setParent(div3);
    widget = div33.addComp('Widget');
    widget.setPivot(0, 1);
    widget.setSize(10, 20);
    widget.setAnchors(0, 0, 0.3, 1);
    widget.setLeft(10);
    widget.setTop(5);
    widget.setBottom(5);

    let div4 = app.createEntity('div4');
    div4.setParent(div);
    widget = div4.addComp('Widget');
    widget.setPivot(0, 0);
    widget.setAnchors(1, 0, 1, 0);
    widget.setSize(40, 20);
    widget.setOffset(-300, 5);
    widget.setRight(100);
    widget.setBottom(10);

    _debugUI(screen);
  }

  preset();
})();