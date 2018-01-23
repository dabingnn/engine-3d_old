(() => {

  const { cc, app, dgui } = window;
  const { color4, vec3 } = cc.math;

  let dobj = {
    addText: '输入要更新的文本',
    removeText: '输入要删除的文本',
    italic: false,
    bold: false,
    align: 'middle-center'
  };
  dgui.remember(dobj);
  dgui.add(dobj, 'addText').onFinishChange(() => {
    addText();
  });
  dgui.add(dobj, 'removeText').onFinishChange(() => {
    removeText();
  });
  dgui.add(dobj, 'italic').onFinishChange(() => {
    setItalic();
  });
  dgui.add(dobj, 'bold').onFinishChange(() => {
    setBold();
  });
  dgui.add(dobj, 'align').onFinishChange(() => {
    setAlign();
  });

  function addText() {
    otTextComp.text = dobj.addText;
  }
  function removeText() {
    otTextComp.font.removeText(dobj.removeText);
  }
  function setItalic() {
    sysTextComp.italic = dobj.italic;
  }
  function setBold() {
    sysTextComp.bold = dobj.bold;
  }
  function setAlign() {
    otTextComp.align = dobj.align;
    sysTextComp.align = dobj.align;
  }

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  let screenEnt = app.createEntity('screen');
  screenEnt.addComp('Screen');
  screenEnt.addComp('Widget');


  // OpenType Font Text
  let otTextEnt = app.createEntity('OpenTypeFontText');
  otTextEnt.setParent(screenEnt);
  let otTextComp = otTextEnt.addComp('Text');
  otTextComp.color = color4.new(1, 0, 0, 1);
  let otTextWidgetComp = otTextEnt.addComp('Widget');
  otTextComp.align = 'middle-center';
  otTextWidgetComp.width = 512;
  otTextWidgetComp.height = 258;
  otTextWidgetComp.setAnchors(0, 0, 0, 0);
  otTextWidgetComp.pivotX = 0;
  otTextWidgetComp.pivotY = 0;
  otTextWidgetComp.setOffset(20, 20);
  let otImageComp = otTextEnt.addComp('Image');
  otImageComp.color = color4.new(1, 1, 1, 1);

  let debugEnt = app.createEntity('debugEntity');
  debugEnt.setParent(screenEnt);
  let debugWidgetComp = debugEnt.addComp('Widget');
  debugWidgetComp.width = 512;
  debugWidgetComp.height = 258;
  debugWidgetComp.setAnchors(0, 0, 0, 0);
  debugWidgetComp.pivotX = 0;
  debugWidgetComp.pivotY = 0;
  debugWidgetComp.setOffset(580, 20);
  let fontAltasSprite = new cc.Sprite();
  fontAltasSprite.width = 512;
  fontAltasSprite.height = 258;
  let debugImageComp = debugEnt.addComp('Image');
  debugImageComp.color = color4.new(1, 1, 1, 1);

  let fontUrls = {
    bin: `./assets/fonts/Roboto-Black.ttf`,
    json: `./assets/fonts/Roboto-Black.json`
  };
  app.assets.loadUrls('otfont', fontUrls, (err, font) => {
    otTextComp.font = font;
    otTextComp.text = 'OPENTYPE FONT\n\nHello, Engine3D!\n' +
    'a long paragraph is presented here. it is used to demonstrate long labels which need more than one pool.';
    fontAltasSprite._texture = otTextComp.font.texture;
    fontAltasSprite.commit();
    debugImageComp.sprite = fontAltasSprite;
  });


  // System Font Text
  let sysTextEnt = app.createEntity('SystemFontText');
  sysTextEnt.setParent(screenEnt);
  let sysTextComp = sysTextEnt.addComp('Text');
  sysTextComp.color = color4.new(1, 0, 0, 1);
  sysTextComp.font = new cc.SystemFont(app.device);
  sysTextComp.text = 'SYSTEM FONT\n\nHello, Engine3D!\n' +
  'a long paragraph is presented here. it is used to demonstrate long labels which need more than one pool. \n' +
  '你好 こんにちは';
  sysTextComp.align = 'middle-center';
  sysTextComp.wrap = true;
  let sysTextWidgetComp = sysTextEnt.addComp('Widget');
  sysTextWidgetComp.width = 600;
  sysTextWidgetComp.height = 300;
  sysTextWidgetComp.setAnchors(0, 0, 0, 0);
  sysTextWidgetComp.pivotX = 0;
  sysTextWidgetComp.pivotY = 0;
  sysTextWidgetComp.setOffset(20, 300);
  let imageComp = sysTextEnt.addComp('Image');
  imageComp.color = color4.new(1, 1, 1, 1);
})();