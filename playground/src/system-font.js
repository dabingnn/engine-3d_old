(() => {

  const { cc, app, dgui } = window;
  const { color4, vec3 } = cc.math;

  // let dobj = {
  //   addText: '输入要更新的文本',
  //   removeText: '输入要删除的文本',
  // };
  // dgui.remember(dobj);
  // dgui.add(dobj, 'addText').onFinishChange(() => {
  //   addText();
  // });
  // dgui.add(dobj, 'removeText').onFinishChange(() => {
  //   removeText();
  // });

  // function addText() {
  //   textComp.text = dobj.addText;
  // }

  // function removeText() {
  //   textComp.font.removeText(dobj.removeText);
  // }

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  let screenEnt = app.createEntity('screen');
  screenEnt.addComp('Screen');
  screenEnt.addComp('Widget');

  let textEnt = app.createEntity('TextEntity');
  textEnt.setParent(screenEnt);
  let textComp = textEnt.addComp('Text');
  textComp.color = color4.new(1, 0, 0, 1);
  let style = {
    fontFamily: 'Arial',
    fontSize: 26,
    fillStyle: 'black',
    fontStyle: 'italic', // normal, italic or oblique
    fontVariant: 'normal', // normal or small-caps
    fontWeight: 'bold', // normal, bold, bolder, lighter or 100
    align: 'center',
    lineHeight: 30,
    wrap: false,
    wrapWidth: 100,
    breakWord: false,
    leftPadding: 10,
    rightPadding: 10,
    topPadding: 30,
    bottomPadding: 10
  };
  textComp.font = new cc.SystemFont(app.device, style);
  textComp.text = 'Hello, Engine3D!\n this is the second line. \n this is the third line. \n this is the four line.\n' +
  'a long paragraph is presented here. it is used to demonstrate long labels which need more than one pool.\n' +
  'a long paragraph is presented here. it is used to demonstrate long labels which need more than one pool.';
  let textWidgetComp = textEnt.addComp('Widget');
  textWidgetComp.width = textComp.font.texture.width;
  textWidgetComp.height = textComp.font.texture.height;
  textWidgetComp.setAnchors(0, 0, 0, 0);
  textWidgetComp.pivotX = 0;
  textWidgetComp.pivotY = 0;
  textWidgetComp.setOffset(60, 60);
  let imageComp = textEnt.addComp('Image');
  imageComp.color = color4.new(1, 1, 1, 1);

})();