(() => {
  const app = window.app;
  const engine = window.engine;

  const resl = engine.resl;
  const gfx = engine.gfx;
  const { Node, StandardMaterial } = engine;
  const { Scene, Model } = engine.renderer;
  const { quat, color4 } = engine.math;

  // create material
  let material = new StandardMaterial({
    color: color4.new(1.0, 1.0, 1.0, 0.6),
  });
  material.useColor = true;
  material.useTexture = true;
  material.useSkinning = false;
  material.blendType = engine.BLEND_NONE;

  // scene
  let model = new Model();
  let scene = new Scene();

  resl({
    manifest: {
      gltf: {
        type: 'text',
        parser: JSON.parse,
        src: './assets/tests/pbr/Cerberus00_Fixed_a5c37fd97fce24fea81d95160e2f1caf.gltf'
      },
      bin: {
        type: 'binary',
        src: './assets/tests/pbr/Cerberus00_Fixed_a5c37fd97fce24fea81d95160e2f1caf.bin'
      },
      image_A: {
        type: 'image',
        src: './assets/tests/pbr/cerberus_A.png'
      }
    },
    onDone (assets) {
      engine.utils.loadMesh(app, assets.gltf, assets.bin, (err, asset) => {
        for (let i = 0; i < asset.meshCount; ++i) {
          model.addMesh(asset.getMesh(i));
        }

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
        model.addEffect(material._effect);

        let node = new Node('Cerberus');
        quat.fromEuler(node.lrot, 90, 0, 0);
        model.setNode(node);

        scene.addModel(model);
      });
    }
  });

  return scene;
})();