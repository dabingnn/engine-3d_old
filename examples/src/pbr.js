(() => {
  const app = window.app;
  const cc = window.cc;

  const resl = cc.resl;
  const gfx = cc.gfx;
  const { StandardMaterial } = cc;
  const { quat, vec3, color4 } = cc.math;

  // create material
  let material = new StandardMaterial({
    color: color4.new(1.0, 1.0, 1.0, 0.6),
  });
  material.useColor = true;
  material.useTexture = true;
  material.useSkinning = false;
  material.blendType = cc.BLEND_NONE;

  let Cerberus = {
    gltf: '../node_modules/assets-3d/models/Cerberus/Cerberus00_Fixed_a5c37fd97fce24fea81d95160e2f1caf.gltf',
    bin: '../node_modules/assets-3d/models/Cerberus/Cerberus00_Fixed_a5c37fd97fce24fea81d95160e2f1caf.bin',
    image_A: '../node_modules/assets-3d/models/Cerberus/cerberus_A.png',
  };

  let biohazard = {
    gltf: './test-assets/biohazard/body_80d8edc52714b4c179460a32e8c3c2f6.gltf',
    bin: './test-assets/biohazard/body_80d8edc52714b4c179460a32e8c3c2f6.bin',
    image_A: './test-assets/biohazard/diffuse.jpg'
  };

  let vikingroom = {
    gltf: './test-assets/vikingroom/mesh.gltf',
    bin: './test-assets/vikingroom/mesh.bin',
    image_A: './test-assets/vikingroom/diffuse.png'
  };

  app.assets.loadUrls('mesh', Cerberus, (err, mesh) => {
    let ent = app.createEntity('model');
    quat.fromEuler(ent.lrot, 0, 0, 0);
    vec3.set(ent.lscale, 10, 10, 10);

    let modelComp = ent.addComp('Model');
    modelComp.mesh = mesh;
    modelComp.material = material;

    resl({
      manifest: {
        image_A: {
          type: 'image',
          src: Cerberus.image_A,
        },
      },

      onDone(assets) {
        let image = assets.image_A;
        let texture = new gfx.Texture2D(app.device, {
          width: image.width,
          height: image.height,
          wrapS: gfx.WRAP_REPEAT,
          wrapT: gfx.WRAP_REPEAT,
          mipmap: true,
          images: [image]
        });
        material.mainTexture = texture;
      }
    });
  });
})();