(() => {
  const { cc, app } = window;
  const { vec3, color3, color4, quat } = cc.math;

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  let screen = app.createEntity('screen');
  screen.addComp('Screen');

  // toggle1 (simple)
  {
    let ent = app.createEntity('toggle');
    ent.setParent(screen);
    let image = ent.addComp('Image');
    image.setOffset(0, 50);
    image.setSize(40, 40);
    let toggle = ent.addComp('Toggle');
    toggle.transition = 'color';
    toggle.transitionColors.normal = color4.new(0.8, 0.8, 0.8, 1);
    toggle.transitionColors.highlight = color4.new(1, 1, 0, 1);
    toggle.transitionColors.pressed = color4.new(0.5, 0.5, 0.5, 1);
    toggle.transitionColors.disabled = color4.new(0.2, 0.2, 0.2, 1);

    let checker = app.createEntity('checker');
    checker.setParent(ent);
    let checkerImage = checker.addComp('Image');
    checkerImage._color = color4.new(1, 0, 0, 1);
    checkerImage.setAnchors(0, 0, 1, 1);
    checkerImage.setSize(-10, -10);

    toggle.background = ent;
    toggle.checker = checker;
    toggle._updateState();
  }

  // toggle2 (with text)
  {
    let entToggle = app.createEntity('toggle-02');
    entToggle.setParent(screen);
    let widget = entToggle.addComp('Widget');
    widget.setOffset(0, -50);
    widget.setSize(200, 40);
    let toggle = entToggle.addComp('Toggle');
    toggle.transition = 'color';
    toggle.transitionColors.normal = color4.new(0.8, 0.8, 0.8, 1);
    toggle.transitionColors.highlight = color4.new(1, 1, 0, 1);
    toggle.transitionColors.pressed = color4.new(0.5, 0.5, 0.5, 1);
    toggle.transitionColors.disabled = color4.new(0.2, 0.2, 0.2, 1);

    let entBG = app.createEntity('background');
    entBG.setParent(entToggle);
    let image = entBG.addComp('Image');
    image.setAnchors(0, 1, 0, 1);
    image.setOffset(30, 0);
    image.setSize(40, 40);

    let entChecker = app.createEntity('checker');
    entChecker.setParent(entBG);
    let checkerImage = entChecker.addComp('Image');
    checkerImage._color = color4.new(1, 0, 0, 1);
    checkerImage.setAnchors(0, 0, 1, 1);
    checkerImage.setSize(-10, -10);

    let entLabel = app.createEntity('label');
    entLabel.setParent(entToggle);
    let text = entLabel.addComp('Text');
    text.setAnchors(0, 1, 0, 1);
    text.setOffset(110, 0);
    text.setSize(100, 30);
    text.text = 'Foobar';
    text.color = color4.new(0.1, 0.1, 0.1, 1);
    text.align = 'middle-center';

    //
    toggle.background = entBG;
    toggle.checker = entChecker;
    toggle._updateState();
  }

  // DEBUG
  app.on('tick', () => {
    cc.utils.walk(screen, ent => {
      let color = color3.new(0, 0, 0);
      let a = vec3.zero();
      let b = vec3.zero();
      let c = vec3.zero();
      let d = vec3.zero();
      let wpos = vec3.zero();
      let wrot = quat.create();

      let widget = ent.getComp('Widget');
      widget.getWorldCorners(a, b, c, d);

      // rect
      app.debugger.drawLine2D(a, b, color);
      app.debugger.drawLine2D(b, c, color);
      app.debugger.drawLine2D(c, d, color);
      app.debugger.drawLine2D(d, a, color);

      app.debugger.drawAxes2D(
        ent.getWorldPos(wpos),
        ent.getWorldRot(wrot),
        5.0
      );
    });
  });
})();