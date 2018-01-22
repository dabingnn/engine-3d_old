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
    fontFamily: 'Arial, Microsoft Yahei UI, Meiryo',
    fontSize: 26,
    fillStyle: 'red',
    fontStyle: 'italic', // normal, italic or oblique
    fontVariant: 'normal', // normal or small-caps
    fontWeight: 'bold', // normal, bold, bolder, lighter or 100
    align: 'left',
    lineHeight: 30,
    wrap: true,
    wrapWidth: 1000,
    breakWord: false,
    leftPadding: 10,
    rightPadding: 10,
    topPadding: 10,
    bottomPadding: 10
  };
  textComp.font = new cc.SystemFont(app.device, style);
  textComp.text = '你好，こんにちは\n'+
  'Hello, Engine3D!\nthis is the second line. \nthis is the third line. \nthis is the four line.\n' +
  'a long paragraph is presented here. it is used to demonstrate long labels which need more than one pool.\n' +
  'a long paragraph is presented here. it is used to demonstrate long labels which need more than one pool. \n' +
  '你好 こんにちは';
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