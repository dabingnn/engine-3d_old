(() => {
  const app = window.app;
  const engine = window.engine;

  const resl = engine.resl;
  const gfx = engine.gfx;
  const { StandardMaterial, SkinningModel } = engine;
  const { Scene } = engine.renderer;
  const { color4 } = engine.math;

  // scene
  let scene = new Scene();
  let skinningModels = [];

  resl({
    manifest: {
      gltf: {
        type: 'text',
        parser: JSON.parse,
        src: './assets/tests/skins/Zed_cc6b438d631553f468aac60d3bd4d450.gltf'
      },
      bin: {
        type: 'binary',
        src: './assets/tests/skins/Zed_cc6b438d631553f468aac60d3bd4d450.bin'
      },
      image: {
        type: 'image',
        src: './assets/tests/textures/Zed_base_TX_CM.png'
      }
    },
    onDone (assets) {
      engine.utils.loadSkin(app, assets.gltf, assets.bin, (err, info) => {
        for (let i = 0; i < info.nodes.length; ++i) {
          let node = info.nodes[i];
          if (node.mesh && node.skin) {
            let skinningModel = new SkinningModel();
            skinningModel.setNode(node);

            // set mesh
            let mesh = node.mesh;
            for (let i = 0; i < mesh.meshCount; ++i) {
              skinningModel.addMesh(mesh.getMesh(i));
            }

            // set skin
            let skin = node.skin;
            skinningModel.setSkin(skin);
            skinningModel._jointsTexture = engine.utils.createJointsTexture(app._device, skin);
            skinningModel._updateCaches();

            // set material
            let material = new StandardMaterial({
              // mainTexture: ???,
              color: color4.new(1.0, 1.0, 1.0, 0.6),
            });
            material.useColor = true;
            material.useTexture = true;
            material.blendType = engine.BLEND_NONE;
            material.mainTexture = new gfx.Texture2D(app.device, {
              width: assets.image.width,
              height: assets.image.height,
              wrapS: gfx.WRAP_CLAMP,
              wrapT: gfx.WRAP_CLAMP,
              mipmap: true,
              images: [assets.image]
            });
            skinningModel.addEffect(material._effect);

            skinningModels.push(skinningModel);
            scene.addModel(skinningModel);
          }
        }
      });
    }
  });

  return scene;
})();