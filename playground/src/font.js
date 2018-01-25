(() => {

  const { cc, app, dgui } = window;
  const { color4, vec3 } = cc.math;

  let dobj = {
    addText: 'add text',
    removeText: 'remove text',
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
  let camComp = camEnt.addComp('Camera');
  camComp.color = color4.new(1,1,0,1);

  let screenEnt = app.createEntity('screen');
  screenEnt.addComp('Screen');


  // OpenType Font Text
  let otTextEnt = app.createEntity('OpenTypeFontText');
  otTextEnt.setParent(screenEnt);
  let otTextComp = otTextEnt.addComp('Text');
  otTextComp.color = color4.new(1, 1, 0, 1);
  otTextComp.align = 'middle-center';
  otTextComp.width = 512;
  otTextComp.height = 256;
  otTextComp.setOffset(-100, -100);

  let debugEnt = app.createEntity('debugEntity');
  debugEnt.setParent(screenEnt);
  let fontAltasSprite = new cc.Sprite();
  fontAltasSprite.width = 512;
  fontAltasSprite.height = 512;
  let debugImageComp = debugEnt.addComp('Image');
  debugImageComp.color = color4.new(1, 1, 1, 1);
  debugImageComp.width = 512;
  debugImageComp.height = 512;
  debugImageComp.setOffset(500, -100);

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
  sysTextComp.text = 'SYSTEM FONT\n\nHello, Engine3D!\n' +
  'a long paragraph is presented here. it is used to demonstrate long labels which need more than one pool. \n' +
  '你好 こんにちは';
  sysTextComp.align = 'middle-center';
  sysTextComp.wrap = true;
  sysTextComp.color = color4.new(0, 1, 0, 1);
  sysTextComp.width = 600;
  sysTextComp.height = 300;
  sysTextComp.setOffset(-100, 200);
})();