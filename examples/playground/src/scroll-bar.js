(() => {
  const { cc, app } = window;
  const { color4, quat, vec3 } = cc.math;

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  let screen = app.createEntity('screen');
  screen.addComp('Screen');

  let rot = quat.create();
  quat.fromEuler(rot, 0, 0, 30);

  // horizontal
  {
    let ent = app.createEntity('ent');
    ent.setParent(screen);
    ent.setWorldRot(rot);
    let bgSprite = ent.addComp('Image');
    bgSprite._color = color4.new(1, 1, 1, 1);
    bgSprite.setOffset(-150, 0);
    bgSprite.setSize(300, 40);
    let scrollBar = ent.addComp('ScrollBar');

    let area = app.createEntity('area');
    area.setParent(ent);
    let areaWidget = area.addComp('Widget');
    areaWidget.setAnchors(0, 0, 1, 1);
    areaWidget.setSize(-40, -40);

    let handle = app.createEntity('handle');
    handle.setParent(area);
    let handleSprite = handle.addComp('Image');
    handleSprite._color = color4.new(0, 1, 1, 1);
    handleSprite.setAnchors(0, 0, 0, 1);
    handleSprite.setSize(40, 40);
    scrollBar.background = handle;
    scrollBar.transition = 'color';
    scrollBar.transitionColors.normal = color4.new(0, 1, 1, 1);
    scrollBar.transitionColors.highlight = color4.new(1, 1, 0, 1);
    scrollBar.transitionColors.pressed = color4.new(0.5, 0.5, 0.5, 1);
    scrollBar.transitionColors.disabled = color4.new(0.2, 0.2, 0.2, 1);
    scrollBar._updateState();

    scrollBar.handle = handle;
    scrollBar.reverse = true;
    scrollBar.size = 0.1;
  }

  // vertical reverse
  {
    let ent = app.createEntity('ent');
    ent.setParent(screen);
    ent.setWorldRot(rot);
    let bgSprite = ent.addComp('Image');
    bgSprite._color = color4.new(1, 1, 1, 1);
    bgSprite.setOffset(200, 0);
    bgSprite.setSize(40, 300);
    let scrollBar = ent.addComp('ScrollBar');

    let area = app.createEntity('area');
    area.setParent(ent);
    let areaWidget = area.addComp('Widget');
    areaWidget.setAnchors(0, 0, 1, 1);
    areaWidget.setSize(-40, -40);

    let handle = app.createEntity('handle');
    handle.setParent(area);
    let handleSprite = handle.addComp('Image');
    handleSprite._color = color4.new(0, 1, 1, 1);
    handleSprite.setAnchors(0, 0, 1, 0);
    handleSprite.setSize(40, 40);
    scrollBar.background = handle;
    scrollBar.transition = 'color';
    scrollBar.transitionColors.normal = color4.new(0, 1, 1, 1);
    scrollBar.transitionColors.highlight = color4.new(1, 1, 0, 1);
    scrollBar.transitionColors.pressed = color4.new(0.5, 0.5, 0.5, 1);
    scrollBar.transitionColors.disabled = color4.new(0.2, 0.2, 0.2, 1);
    scrollBar._updateState();

    scrollBar.handle = handle;
    scrollBar.direction = 'vertical';
    scrollBar.reverse = true;
    scrollBar.size = 0.1;
  }
})();