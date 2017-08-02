(() => {
  // var SPECTOR = require("spectorjs");

  // var spector = new SPECTOR.Spector();
  // spector.displayUI();

  const app = window.app;
  const cc = window.cc;

  const resl = cc.resl;
  const gfx = cc.gfx;
  const { Node, PhongMaterial } = cc;
  const { vec3, color3, color4, quat, randomRange } = cc.math;
  const { Scene, Model, Light } = cc.renderer;
  const { box } = cc.primitives;

  // create mesh
  let meshBox = cc.utils.createMesh(app.device, box(1, 1, 1, {
    widthSegments: 1,
    heightSegments: 1,
    lengthSegments: 1,
  }));

  // create material
  let material = new PhongMaterial({
    // mainTexture: ???,
    color: color4.new(1.0, 1.0, 1.0, 0.6),
  });
  material.blendType = cc.BLEND_NONE;
  material.useColor = true;
  material.useTexture = true;
  material.useSkinning = false;

  resl({
    manifest: {
      image: {
        type: 'image',
        src: '../node_modules/assets-3d/textures/uv_checker_02.jpg'
      },
    },
    onDone(assets) {
      let image = assets.image;
      let texture = new gfx.Texture2D(app.device, {
        width: image.width,
        height: image.height,
        wrapS: gfx.WRAP_CLAMP,
        wrapT: gfx.WRAP_CLAMP,
        mipmap: true,
        images: [image]
      });
      material.mainTexture = texture;
    }
  });

  // scene
  let scene = new Scene();

  // light
  for (let index = 0; index < 1; ++index) {
    let light = new Light();
    light.color = color3.new(randomRange(0, 0.5), randomRange(0, 0.5), randomRange(0, 0.5));
    let node = new Node(`light0`);
    quat.fromEuler(node.lrot,
      randomRange(0, -90),
      randomRange(0, 0),
      randomRange(0, 0)
    );
    light.setNode(node);
    scene.addLight(light);
  }

  for (let index = 0; index < 0; ++index) {
    let light = new Light();
    light.type = cc.renderer.LIGHT_POINT;
    light.color = color3.new(randomRange(0, 0.5), randomRange(0, 0.5), randomRange(0, 0.5));
    light.range = 50;
    let node = new Node(`ptlight0`);
    vec3.set(node.lpos,
      randomRange(-50, 50),
      randomRange(-10, 10),
      randomRange(-50, 50)
    );
    light.setNode(node);
    scene.addLight(light);
  }

  for (let index = 0; index < 0; ++index) {
    let light = new Light();
    light.type = cc.renderer.LIGHT_SPOT;
    light.color = color3.new(randomRange(1, 1), randomRange(1, 1), randomRange(1, 1));
    light.range = 40;
    light.spotExp = 10;
    let node = new Node(`spotlight1`);
    vec3.set(node.lpos,
      randomRange(-0, 0),
      randomRange(10, 10),
      randomRange(-0, 0)
    );
    quat.fromEuler(node.lrot,
      randomRange(-90, -90),
      randomRange(0, 0),
      randomRange(0, 0)
    );
    light.setNode(node);
    scene.addLight(light);
  }

  // big plane
  {
    let node = new Node(`node_plane`);
    vec3.set(node.lpos, 0, -10, 0);
    vec3.set(node.lscale, 100, 0.1, 100);
    let model = new Model();
    model.addMesh(meshBox);

    model.addEffect(material._effect);
    model.setNode(node);

    scene.addModel(model);
  }
  // models
  for (let i = 0; i < 100; ++i) {
    let node = new Node(`node_${i}`);
    vec3.set(node.lpos,
      randomRange(-50, 50),
      randomRange(-10, 10),
      randomRange(-50, 50)
    );
    quat.fromEuler(node.lrot,
      randomRange(0, 360),
      randomRange(0, 360),
      randomRange(0, 360)
    );
    vec3.set(node.lscale,
      randomRange(1, 5),
      randomRange(1, 5),
      randomRange(1, 5)
    );

    let model = new Model();
    model.addMesh(meshBox);

    model.addEffect(material._effect);
    model.setNode(node);

    scene.addModel(model);
  }

  return scene;
})();