
(() => {
  const app = window.app;
  const cc = window.cc;
  const { color4, vec3 } = cc.math;

  let screenEnt = app.createEntity('screen');
  screenEnt.addComp('Screen');

  let textEnt = app.createEntity('TextEntity');
  textEnt.setParent(screenEnt);
  let textComp = textEnt.addComp('Text');
  textComp.text = 'Hello, Engine3D!\n this is the second line. \n this is the third line. \n this is the four line.\n' +
  'a long paragraph is presented here. it is used to demonstrate long labels which need more than one pool.\n' +
  'a long paragraph is presented here. it is used to demonstrate long labels which need more than one pool.' +
  '\n 字体渲染 フォントレンダリング面白い(ノ∀｀)';
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
  let fontUrls = {
    bin: `./assets/fireflysung.ttf`
  };

  let debugEnt = app.createEntity('debugSprite');
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
  debugImageComp.type = 'simple';

  app.assets.loadUrls('otfont', fontUrls, (err, font) => {
    textComp.font = font;
    // fontAltasSprite._texture = textComp.font.texture;
    // fontAltasSprite.commit();
    // debugImageComp.sprite = fontAltasSprite;
    // fontAltasSprite._loaded = true;
  });

  // app.assets.loadUrls('texture', {
  //   image: './assets/textures/checker_uv.jpg'
  // }, (err, texture) => {
  //   fontAltasSprite._texture = texture;
  //   fontAltasSprite.commit();
  //   debugImageComp.sprite = fontAltasSprite;
  //   fontAltasSprite._loaded = true;
  // });

  app.on('tick', () => {
    if (textComp.font && textComp.font._fontAtlasReady) {
      textComp.font._fontAtlasReady = false;
      fontAltasSprite._texture = textComp.font.texture;
      fontAltasSprite.commit();
      fontAltasSprite._loaded = true;
      debugImageComp.sprite = fontAltasSprite;
    }
  });

})();