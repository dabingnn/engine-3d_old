(() => {
  const app = window.app;
  const cc = window.cc;

  const resl = cc.resl;
  const gfx = cc.gfx;
  const { StandardMaterial } = cc;
  const { vec3, color4, quat, randomRange } = cc.math;
  const { box } = cc.primitives;

  // create mesh
  let meshBox = cc.utils.createMesh(app, box(1, 1, 1, {
    widthSegments: 1,
    heightSegments: 1,
    lengthSegments: 1,
  }));

  // create material
  let material = new StandardMaterial({
    // mainTexture: ???,
    color: color4.new(1.0, 1.0, 1.0, 0.6),
  });
  material.blendType = cc.BLEND_NORMAL;
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
    onDone (assets) {
      let image = assets.image;
      let texture = new gfx.Texture2D(app.device, {
        width : image.width,
        height: image.height,
        wrapS: gfx.WRAP_CLAMP,
        wrapT: gfx.WRAP_CLAMP,
        mipmap: true,
        images : [image]
      });
      material.mainTexture = texture;
    }
  });

  // models
  for (let i = 0; i < 100; ++i) {
    let ent = app.createEntity(`node_${i}`);
    vec3.set(ent.lpos,
      randomRange(-50, 50),
      randomRange(-10, 10),
      randomRange(-50, 50)
    );
    quat.fromEuler(ent.lrot,
      randomRange(0, 360),
      randomRange(0, 360),
      randomRange(0, 360)
    );
    vec3.set(ent.lscale,
      randomRange(1, 5),
      randomRange(1, 5),
      randomRange(1, 5)
    );

    let modelComp = ent.addComp('Model');
    modelComp.mesh = meshBox;
    modelComp.material = material;
  }
})();