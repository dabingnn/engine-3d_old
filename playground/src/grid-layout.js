(() => {
  const { cc, app } = window;
  const { color4, vec3 } = cc.math;

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  let screen = app.createEntity('screen');
  screen.addComp('Screen');

  let ent = app.createEntity('ent');
  ent.setParent(screen);
  let widget = ent.addComp('Image');
  widget.color = color4.create();
  widget.setSize(320, 250);
  let layout = ent.addComp('GridLayout');
  layout.spacingX = 5;
  layout.spacingY = 5;
  layout.cellHeight = 30;
  layout.childAlign = 'upper-center';

  for (let i = 0; i < 10; ++i) {
    let child = app.createEntity('child_' + i);
    child.setParent(ent);
    let childWidget = child.addComp('Image');
    childWidget.color = color4.new(0, 1, 1, 1);
    childWidget.setPivot(0, 0);

    let label = app.createEntity('label');
    label.setParent(child);
    let labelComp = label.addComp('Text');
    labelComp.color = color4.new(0, 0, 0, 1);
    labelComp.setSize(0, 0);
    labelComp.setAnchors(0, 0, 1, 1);
    labelComp.align = 'middle-center';
    labelComp.text = i + '';
  }

  let buttonManager = app.createEntity('ButtonManager');
  buttonManager.setParent(screen);
  let managerWidget = buttonManager.addComp('Widget');
  managerWidget.setAnchors(0, 0, 1, 1);
  managerWidget.setSize(0, 0);
  let managerGrid = buttonManager.addComp('GridLayout');
  managerGrid.childAlign = 'upper-center';
  managerGrid.spacingX = 5;
  managerGrid.spacingY = 5;
  managerGrid.constraint = 'fixed-col';
  managerGrid.constraintCount = 4;
  managerGrid.cellWidth = 200;
  managerGrid.cellHeight = 30;

  for (let i = 0; i < 9; ++i) {
    let child = app.createEntity('child_' + i);
    child.setParent(buttonManager);
    let childWidget = child.addComp('Image');
    childWidget.color = color4.new(0, 1, 1, 1);
    childWidget.setPivot(0, 0);
    let button = child.addComp('Button');
    button.background = child;
    button.transition = 'color';
    button.transitionColors.normal = color4.new(0, 1, 1, 1);
    button.transitionColors.highlight = color4.new(0, 1, 0, 1);
    button.transitionColors.pressed = color4.new(0, 0.5, 0.5, 1);
    button.transitionColors.disabled = color4.new(0.2, 0.2, 0.2, 1);
    button._updateState();

    let label = app.createEntity('label');
    label.setParent(child);
    let labelComp = label.addComp('Text');
    labelComp.color = color4.new(0, 0, 0, 1);
    labelComp.setSize(0, 0);
    labelComp.setAnchors(0, 0, 1, 1);
    labelComp.fontSize = 20;
    labelComp.align = 'middle-center';
    labelComp.text = i + '';
  }

  buttonManager.children[0].children[0].getComp('Text').text = 'corner-lower-right';
  buttonManager.children[0].on('clicked', () => {
    layout.corner = 'lower-right';
  });

  buttonManager.children[1].children[0].getComp('Text').text = 'padding-H40-V20';
  buttonManager.children[1].on('clicked', () => {
    layout.paddingLeft = 20;
    layout.paddingRight = 20;
    layout.paddingBottom = 10;
    layout.paddingTop = 10;
  });

  buttonManager.children[2].children[0].getComp('Text').text = 'Spacing-X10-Y10';
  buttonManager.children[2].on('clicked', () => {
    layout.spacingX = 10;
    layout.spacingY = 10;
  });

  buttonManager.children[3].children[0].getComp('Text').text = 'align-center';
  buttonManager.children[3].on('clicked', () => {
    layout.childAlign = 'middle-center';
  });

  buttonManager.children[4].children[0].getComp('Text').text = 'align-lower-right';
  buttonManager.children[4].on('clicked', () => {
    layout.childAlign = 'lower-right';
  });

  buttonManager.children[5].children[0].getComp('Text').text = 'vertical';
  buttonManager.children[5].on('clicked', () => {
    layout.axisDirection = 'vertical';
  });

  buttonManager.children[6].children[0].getComp('Text').text = 'fixed-col-4';
  buttonManager.children[6].on('clicked', () => {
    layout.constraint = 'fixed-col';
    layout.constraintCount = 4;
  });

  buttonManager.children[7].children[0].getComp('Text').text = 'fixed-row-5';
  buttonManager.children[7].on('clicked', () => {
    layout.constraint = 'fixed-row';
    layout.constraintCount = 5;
  });

  buttonManager.children[8].children[0].getComp('Text').text = 'reset';
  buttonManager.children[8].on('clicked', () => {
    layout.reset();
    layout.spacingX = 5;
    layout.spacingY = 5;
    layout.cellWidth = 100;
    layout.cellHeight = 30;
    layout.childAlign = 'upper-center';
    layout.constraint = 'flexible';
    layout.constraintCount = 2;
    layout.corner = 'upper-left';
  });
})();