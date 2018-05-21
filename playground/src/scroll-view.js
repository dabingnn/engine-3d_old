(() => {
  const { cc, app, uikit } = window;
  const { vec3, color4 } = cc.math;

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  let screen = app.createEntity('screen');
  screen.addComp('Screen');

  // 220x220
  let entity = app.createEntity('scrollView');
  entity.setParent(screen);
  let scrollSprite = entity.addComp('Image');
  scrollSprite.color = color4.new(1, 1, 1, 1);
  scrollSprite.setSize(220, 220);
  let scrollView = entity.addComp('ScrollView');

  // 200x200
  let view = app.createEntity('view');
  view.setParent(entity);
  let viewSprite = view.addComp('Image');
  viewSprite.color = color4.new(1, 0, 1, 1);
  viewSprite.setAnchors(0, 0, 1, 1);
  viewSprite.setSize(-20, -20);
  viewSprite.setOffset(-10, 10);
  // let viewMask = view.addComp('Mask');

  // 300x400
  let content = app.createEntity('content');
  content.setParent(view);
  let contentSprite = content.addComp('Image');
  contentSprite._color = color4.new(0.8, 0.8, 0.8, 1);
  contentSprite.setSize(300, 400);
  contentSprite.setPivot(1, 1);

  let temp = app.createEntity('temp');
  temp.setParent(content);
  let tempSprite = temp.addComp('Image');
  tempSprite.color = color4.new(1, 1, 0, 1);
  tempSprite.setSize(50, 50);

  // 20x200
  let vScrollBarEnt = app.createEntity('vScrollBar');
  vScrollBarEnt.setParent(entity);
  // ent.setWorldRot(rot);
  let vScrollBarSprite = vScrollBarEnt.addComp('Image');
  vScrollBarSprite.color = color4.new(1, 1, 1, 1);
  vScrollBarSprite.setAnchors(1, 0, 1, 1);
  vScrollBarSprite.setSize(20, -20);
  vScrollBarSprite.setOffset(-10, 10);
  let vScrollBar = vScrollBarEnt.addComp('ScrollBar');

  let vScrollBarArea = app.createEntity('vScrollBarArea');
  vScrollBarArea.setParent(vScrollBarEnt);
  let vScrollBarAreaWidget = vScrollBarArea.addComp('Widget');
  vScrollBarAreaWidget.setAnchors(0, 0, 1, 1);
  vScrollBarAreaWidget.setSize(-20, -20);

  let vScrollBarHandle = app.createEntity('vScrollBarHandle');
  vScrollBarHandle.setParent(vScrollBarArea);
  let vScrollBarHandleSprite = vScrollBarHandle.addComp('Image');
  vScrollBarHandleSprite.color = color4.new(0, 1, 1, 1);
  vScrollBarHandleSprite.setAnchors(0, 1, 1, 1);
  vScrollBarHandleSprite.setSize(20, 20);

  vScrollBar.background = vScrollBarHandleSprite;
  vScrollBar.transition = 'color';
  vScrollBar.transitionColors.normal = color4.new(0, 1, 1, 1);
  vScrollBar.transitionColors.highlight = color4.new(1, 1, 0, 1);
  vScrollBar.transitionColors.pressed = color4.new(0.5, 0.5, 0.5, 1);
  vScrollBar.transitionColors.disabled = color4.new(0.2, 0.2, 0.2, 1);
  vScrollBar._updateState();

  vScrollBar.dragArea = screen;
  vScrollBar.handle = vScrollBarHandleSprite;
  vScrollBar.direction = 'vertical';
  vScrollBar.reverse = true;
  // vScrollBar.scrollPos = 0.3;

  let hScrollBarEnt = app.createEntity('hScrollBar');
  hScrollBarEnt.setParent(entity);
  // ent.setWorldRot(rot);
  let hScrollBarSprite = hScrollBarEnt.addComp('Image');
  hScrollBarSprite.color = color4.new(1, 1, 1, 1);
  hScrollBarSprite.setAnchors(0, 0, 1, 0);
  hScrollBarSprite.setSize(-20, 20);
  hScrollBarSprite.offsetX = -10;
  hScrollBarSprite.offsetY = 10;
  let hScrollBar = hScrollBarEnt.addComp('ScrollBar');

  let hScrollBarArea = app.createEntity('hScrollBarArea');
  hScrollBarArea.setParent(hScrollBarEnt);
  let hScrollBarAreaWidget = hScrollBarArea.addComp('Widget');
  hScrollBarAreaWidget.setAnchors(0, 0, 1, 1);
  hScrollBarAreaWidget.setSize(-20, -20);

  let hScrollBarHandle = app.createEntity('hScrollBarHandle');
  hScrollBarHandle.setParent(hScrollBarArea);
  let hScrollBarHandleSprite = hScrollBarHandle.addComp('Image');
  hScrollBarHandleSprite.color = color4.new(0, 1, 1, 1);
  hScrollBarHandleSprite.setAnchors(0, 0, 0, 1);
  hScrollBarHandleSprite.setSize(20, 20);
  hScrollBar.background = hScrollBarHandleSprite;
  hScrollBar.transition = 'color';
  hScrollBar.transitionColors.normal = color4.new(0, 1, 1, 1);
  hScrollBar.transitionColors.highlight = color4.new(1, 1, 0, 1);
  hScrollBar.transitionColors.pressed = color4.new(0.5, 0.5, 0.5, 1);
  hScrollBar.transitionColors.disabled = color4.new(0.2, 0.2, 0.2, 1);
  hScrollBar._updateState();

  hScrollBar._dragArea = screen;
  hScrollBar._handle = hScrollBarHandleSprite;
  hScrollBar._direction = 'horizontal';

  scrollView._content = contentSprite;
  scrollView._viewPort = viewSprite;
  scrollView._movementType = 'elastic';
  scrollView._vScrollBar = vScrollBar;
  scrollView._hScrollBar = hScrollBar;
})();