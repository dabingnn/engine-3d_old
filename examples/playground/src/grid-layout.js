(() => {
  const { cc, app, dgui } = window;
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

  let options = {
    paddingLeft: layout.paddingLeft,
    paddingRight: layout.paddingRight,
    paddingBottom: layout.paddingBottom,
    paddingTop: layout.paddingTop,
    spacingX: layout.spacingX,
    spacingY: layout.spacingY,
    cellWidth: layout.cellWidth,
    cellHeight: layout.cellHeight,
    startCorner: layout.corner,
    startAxis: layout.axisDirection,
    childAlignmlayout: layout.childAlign,
    constraint: layout.constraint,
    value: layout.constraintCount
  };

  dgui.add(options, 'paddingLeft').onFinishChange(() => {
    layout.paddingLeft = options.paddingLeft;
  });

  dgui.add(options, 'paddingRight').onFinishChange(() => {
    layout.paddingRight = options.paddingRight;
  });

  dgui.add(options, 'paddingBottom').onFinishChange(() => {
    layout.paddingBottom = options.paddingBottom;
  });

  dgui.add(options, 'paddingTop').onFinishChange(() => {
    layout.paddingTop = options.paddingTop;
  });

  dgui.add(options, 'spacingX').onFinishChange(() => {
    layout.spacingX = options.spacingX;
  });

  dgui.add(options, 'spacingY').onFinishChange(() => {
    layout.spacingY = options.spacingY;
  });

  dgui.add(options, 'cellWidth').onFinishChange(() => {
    layout.cellWidth = options.cellWidth;
  });

  dgui.add(options, 'cellHeight').onFinishChange(() => {
    layout.cellHeight = options.cellHeight;
  });

  dgui.add(options, 'startCorner').onFinishChange(() => {
    layout.corner = options.startCorner;
  });

  dgui.add(options, 'childAlignmlayout').onFinishChange(() => {
    layout.childAlign = options.childAlignmlayout;
  });

  dgui.add(options, 'constraint').onFinishChange(() => {
    layout.constraint = options.constraint;
  });

  dgui.add(options, 'value').onFinishChange(() => {
    layout.constraintCount = options.value;
  });
})();