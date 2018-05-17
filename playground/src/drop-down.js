(() => {
  const { cc, app } = window;
  const { vec3, color4 } = cc.math;

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  let screen = app.createEntity('screen');
  screen.addComp('Screen');

  let ent = app.createEntity('ent');
  ent.setParent(screen);
  let image = ent.addComp('Image');
  image._color = color4.new(1, 1, 1, 1);
  image.setSize(300, 50);
  image.setOffset(0, 200);
  let dropdown = ent.addComp('DropDown');
  dropdown.background = image;
  dropdown.transition = 'color';
  dropdown.transitionColors.normal = color4.new(1, 1, 1, 1);
  dropdown.transitionColors.highlight = color4.new(1, 1, 0, 1);
  dropdown.transitionColors.pressed = color4.new(0.5, 0.5, 0.5, 1);
  dropdown.transitionColors.disabled = color4.new(0.2, 0.2, 0.2, 1);
  dropdown._updateState();

  let label = app.createEntity('label');
  label.setParent(ent);
  let text = label.addComp('Text');
  text.color = color4.new(0, 0, 0, 1);
  text.setAnchors(0, 0, 1, 1);
  text.setSize(0, 0);
  text.align = 'middle-left';
  text.text = 'option 1';

  let arrow = app.createEntity('arrow');
  arrow.setParent(ent);
  let arrowImg = arrow.addComp('Image');
  arrowImg._color = color4.new(0.8, 0.8, 0.8, 1);
  arrowImg.setAnchors(0.7, 0.4, 0.9, 0.6);
  arrowImg.setSize(0, 0);

  let optionTexts = ['option A', 'option B', 'option C'];
  let optionSprites = [null, null, null, null];

  dropdown._labComp = text;
  dropdown._imageComp = arrowImg;
  dropdown._optionTexts = optionTexts;
  dropdown._optionSprites = optionSprites;
})();