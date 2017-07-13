(() => {
  const app = window.app;
  const engine = window.engine;

  const gfx = engine.gfx;
  const renderer = engine.renderer;
  const Node = engine.Node;
  const { vec3, color4, quat, randomRange } = engine.math;
  const { Scene, Pass, Technique, Material, Model } = engine.renderer;
  const { box } = engine.primitives;

  // create mesh
  let meshBox = engine.utils.createMesh(app.device, box(1, 1, 1, {
    widthSegments: 1,
    heightSegments: 1,
    lengthSegments: 1,
  }));

  // create material
  let pass = new Pass('unlit');
  // pass.setDepth(true, true);
  // pass.setCullMode(gfx.CULL_FRONT);
  pass.setDepth(true, false);
  pass.setBlend(
    gfx.BLEND_FUNC_ADD,
    gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
    gfx.BLEND_FUNC_ADD,
    gfx.BLEND_ONE, gfx.BLEND_ONE
  );

  let technique = new Technique(
    renderer.STAGE_TRANSPARENT,
    [
      { name: 'mainTexture', type: renderer.PARAM_TEXTURE_2D },
      { name: 'color', type: renderer.PARAM_COLOR4, },
    ], [
      pass,
    ]
  );
  let material = new Material(
    [technique],
    {
      // mainTexture: ???,
      color: color4.new(1.0, 1.0, 1.0, 0.6),
    },
    {
      useTexture: true,
      useColor: true,
    }
  );

  // resl({
  //   manifest: {
  //     image: {
  //       type: 'image',
  //       src: './assets/uv_checker_02.jpg'
  //     },
  //   },
  //   onDone (assets) {
  //     let image = assets.image;
  //     let texture = new gfx.Texture2D(device, {
  //       width : image.width,
  //       height: image.height,
  //       wrapS: gfx.WRAP_CLAMP,
  //       wrapT: gfx.WRAP_CLAMP,
  //       mipmap: true,
  //       images : [image]
  //     });
  //     material.setValue('mainTexture', texture);
  //   }
  // });

  // scene
  let scene = new Scene();

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

    model.addMaterial(material);
    model.setNode(node);

    scene.addModel(model);
  }

  return scene;
})();