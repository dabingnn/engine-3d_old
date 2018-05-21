(() => {
  const { cc, app, uikit } = window;
  const { vec3, quat, color4 } = cc.math;

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  let screen = app.createEntity('screen');
  screen.addComp('Screen');

  let rotation = quat.create();
  quat.fromEuler(rotation, 0, 0, 60);
  // toggle horizontal
  {
    let sliderEnt = app.createEntity('slider');
    sliderEnt.setParent(screen);
    let sliderWidget = sliderEnt.addComp('Widget');
    sliderWidget.setOffset(-100, 0);
    sliderWidget.setSize(160, 20);
    sliderEnt.setWorldRot(rotation);
    let sliderComp = sliderEnt.addComp('Slider');
    sliderComp._direction = 'horizontal';

    let sliderBg = app.createEntity('bg');
    sliderBg.setParent(sliderEnt);
    let bgSprite = sliderBg.addComp('Image');
    bgSprite._color = color4.new(1, 1, 1, 1);
    bgSprite.setAnchors(0, 0, 1, 1);
    bgSprite.setSize(0, 0);

    let fillArea = app.createEntity('fillArea');
    fillArea.setParent(sliderEnt);
    let faWidget = fillArea.addComp('Widget');
    faWidget.setAnchors(0, 0, 1, 1);
    faWidget.setSize(-20, 0);
    faWidget.setOffset(-5, 0);

    let fill = app.createEntity('fill');
    fill.setParent(fillArea);
    let fillSprite = fill.addComp('Image');
    fillSprite._color = color4.new(1, 0, 0, 1);
    fillSprite.setAnchors(0, 0, 0, 1);
    fillSprite.setSize(10, 0);

    let handleArea = app.createEntity('handleArea');
    handleArea.setParent(sliderEnt);
    let haWidget = handleArea.addComp('Widget');
    haWidget.setAnchors(0, 0, 1, 1);
    haWidget.setSize(-20, 0);

    let handle = app.createEntity('handle');
    handle.setParent(handleArea);
    let handleSprite = handle.addComp('Image');
    handleSprite._color = color4.new(0, 1, 1, 1);
    handleSprite.setAnchors(0, 0, 0, 1);
    handleSprite.setSize(20, 20);
    sliderComp._background = handle;
    sliderComp._transition = 'color';
    sliderComp._transitionColors.normal = color4.new(0, 1, 1, 1);
    sliderComp._transitionColors.highlight = color4.new(1, 1, 0, 1);
    sliderComp._transitionColors.pressed = color4.new(0.5, 0.5, 0.5, 1);
    sliderComp._transitionColors.disabled = color4.new(0.2, 0.2, 0.2, 1);
    sliderComp._updateState();

    sliderComp._handle = handleSprite;
    sliderComp._fill = fillSprite;
  }

  // toggle vertical
  {
    let sliderEnt = app.createEntity('slider');
    sliderEnt.setParent(screen);
    let sliderWidget = sliderEnt.addComp('Widget');
    sliderWidget.setOffset(200, 0);
    sliderWidget.setSize(20, 160);
    sliderEnt.setWorldRot(rotation);
    let sliderComp = sliderEnt.addComp('Slider');
    sliderComp._direction = 'vertical';

    let sliderBg = app.createEntity('bg');
    sliderBg.setParent(sliderEnt);
    let bgSprite = sliderBg.addComp('Image');
    bgSprite._color = color4.new(1, 1, 1, 1);
    bgSprite.setAnchors(0, 0, 1, 1);
    bgSprite.setSize(0, 0);

    let fillArea = app.createEntity('fillArea');
    fillArea.setParent(sliderEnt);
    let faWidget = fillArea.addComp('Widget');
    faWidget.setAnchors(0, 0, 1, 1);
    faWidget.setSize(0, -20);
    faWidget.setOffset(0, 5);

    let fill = app.createEntity('fill');
    fill.setParent(fillArea);
    let fillSprite = fill.addComp('Image');
    fillSprite._color = color4.new(1, 0, 0, 1);
    fillSprite.setAnchors(0, 0, 1, 0);
    fillSprite.setSize(0, 10);

    let handleArea = app.createEntity('handleArea');
    handleArea.setParent(sliderEnt);
    let haWidget = handleArea.addComp('Widget');
    haWidget.setAnchors(0, 0, 1, 1);
    haWidget.setSize(0, -20);

    let handle = app.createEntity('handle');
    handle.setParent(handleArea);
    let handleSprite = handle.addComp('Image');
    handleSprite._color = color4.new(0, 1, 1, 1);
    handleSprite.setAnchors(0, 0, 1, 0);
    handleSprite.setSize(20, 20);

    sliderComp._background = handle;
    sliderComp._transition = 'color';
    sliderComp._transitionColors.normal = color4.new(0, 1, 1, 1);
    sliderComp._transitionColors.highlight = color4.new(1, 1, 0, 1);
    sliderComp._transitionColors.pressed = color4.new(0.5, 0.5, 0.5, 1);
    sliderComp._transitionColors.disabled = color4.new(0.2, 0.2, 0.2, 1);
    sliderComp._updateState();

    sliderComp._handle = handleSprite;
    sliderComp._fill = fillSprite;
    sliderComp._reverse = true;
    sliderComp._progress = 0.3;
  }
})();