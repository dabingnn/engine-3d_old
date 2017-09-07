(() => {
  const app = window.app;
  const cc = window.cc;

  const { vec3, color4, quat, randomRange } = cc.math;

  // create mesh
  let meshBox = cc.utils.createMesh(app, cc.primitives.box(1, 1, 1, {
    widthSegments: 1,
    heightSegments: 1,
    lengthSegments: 1,
  }));

  // create material
  let material = new cc.UnlitMaterial();
  material.useColor = true;
  material.useTexture = true;
  material.blendType = cc.BLEND_NORMAL;
  material.color = color4.new(1, 1, 1, 0.6);

  app.assets.loadUrls('texture-2d', {
    image: '../node_modules/assets-3d/textures/uv_checker_02.jpg'
  }, (err, texture) => {
    material.mainTexture = texture;
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