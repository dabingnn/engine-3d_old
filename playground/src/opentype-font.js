(() => {

  const { cc, app, dgui } = window;
  const { color4, vec3 } = cc.math;

  let dobj = {
    addText: '输入要更新的文本',
    removeText: '输入要删除的文本',
  };
  dgui.remember(dobj);
  dgui.add(dobj, 'addText').onFinishChange(() => {
    addText();
  });
  dgui.add(dobj, 'removeText').onFinishChange(() => {
    removeText();
  });

  function addText() {
    textComp.text = dobj.addText;
  }

  function removeText() {
    textComp.font.removeText(dobj.removeText);
  }

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
  let textWidgetComp = textEnt.addComp('Widget');
  textWidgetComp.width = 512;
  textWidgetComp.height = 512;
  textWidgetComp.setAnchors(0, 0, 0, 0);
  textWidgetComp.pivotX = 0;
  textWidgetComp.pivotY = 0;
  textWidgetComp.setOffset(60, 60);
  let imageComp = textEnt.addComp('Image');
  imageComp.color = color4.new(1, 1, 1, 1);

  let debugEnt = app.createEntity('debugEntity');
  debugEnt.setParent(screenEnt);
  let debugWidgetComp = debugEnt.addComp('Widget');
  debugWidgetComp.width = 512;
  debugWidgetComp.height = 512;
  debugWidgetComp.setAnchors(0, 0, 0, 0);
  debugWidgetComp.pivotX = 0;
  debugWidgetComp.pivotY = 0;
  debugWidgetComp.setOffset(600, 60);
  let fontAltasSprite = new cc.Sprite();
  fontAltasSprite.width = 512;
  fontAltasSprite.height = 512;
  let debugImageComp = debugEnt.addComp('Image');
  debugImageComp.color = color4.new(1, 1, 1, 1);

  let fontUrls = {
    bin: `./assets/fonts/Roboto-Black.ttf`,
    json: `./assets/fonts/Roboto-Black.json`
  };
  app.assets.loadUrls('otfont', fontUrls, (err, font) => {
    textComp.font = font;
    textComp.text = 'Hello, Engine3D!\n this is the second line. \n this is the third line. \n this is the four line.\n' +
    'a long paragraph is presented here. it is used to demonstrate long labels which need more than one pool.\n' +
    'a long paragraph is presented here. it is used to demonstrate long labels which need more than one pool.';
    fontAltasSprite._texture = textComp.font.texture;
    fontAltasSprite.commit();
    debugImageComp.sprite = fontAltasSprite;
  });

})();