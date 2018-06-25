(() => {
  const { cc, app } = window;
  const { color4, vec3 } = cc.math;

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  let screen = app.createEntity('screen');
  screen.addComp('Screen');

  let ent = app.createEntity('entity');
  ent.setParent(screen);
  let sprite = ent.addComp('Image');
  sprite.color = color4.create();
  sprite.setSize(350, 80);
  let entEditor = ent.addComp('EditBox');
  entEditor.background = ent;
  entEditor.transition = 'color';
  entEditor.transitionColors.normal = color4.new(1, 1, 1, 1);
  entEditor.transitionColors.highlight = color4.new(0.3, 1, 1, 1);
  entEditor.transitionColors.pressed = color4.new(0.8, 0.8, 0.8, 1);
  entEditor.transitionColors.disabled = color4.new(0.2, 0.2, 0.2, 1);
  entEditor._updateState();

  let input = app.createEntity('input');
  input.setParent(ent);
  let inputTextComp = input.addComp('Text');
  inputTextComp.color = color4.new(0, 0, 0, 1);
  inputTextComp.setSize(-10, -10);
  inputTextComp.setAnchors(0, 0, 1, 1);

  entEditor.defaultText = 'please enter here';
  entEditor.textEnt = input;
  // entEditor._contentType = 'password';
  // entEditor._lineType = 'multi-line';
  entEditor.returnKeyType = 'submit';
})();