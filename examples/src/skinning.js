(() => {
  const app = window.app;
  const engine = window.engine;

  const resl = engine.resl;
  const gfx = engine.gfx;
  const { Node, StandardMaterial } = engine;
  const { Scene, Model } = engine.renderer;
  const { color4 } = engine.math;

  // create material
  let material = new StandardMaterial({
    // mainTexture: ???,
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
        src: './assets/meshes/transformZed_cc6b438d631553f468aac60d3bd4d450.gltf'
      },
      bin: {
        type: 'binary',
        src: './assets/meshes/transformZed_cc6b438d631553f468aac60d3bd4d450.bin'
      },
      image: {
        type: 'image',
        src: './assets/meshes/Zed_base_TX_CM.png'
      }
    },
    onDone (assets) {
      engine.utils.loadMesh(app, assets.gltf, assets.bin, (err, asset) => {
        for (let i = 0; i < asset.meshCount; ++i) {
          model.addMesh(asset.getMesh(i));
        }

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
        model.addEffect(material._effect);

        let node = new Node('Zed');
        model.setNode(node);

        scene.addModel(model);
      });
    }
  });

  return scene;
})();