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
        // src: './assets/tests/skins/Paladin_w_Prop_J_Nordstrom_6e101c6123cad4071a9442b6463e7611.gltf'
      },
      bin: {
        type: 'binary',
        src: './assets/tests/skins/Zed_cc6b438d631553f468aac60d3bd4d450.bin'
        // src: './assets/tests/skins/Paladin_w_Prop_J_Nordstrom_6e101c6123cad4071a9442b6463e7611.bin'
      },
      image: {
        type: 'image',
        src: './assets/tests/textures/Zed_base_TX_CM.png'
        // src: './assets/tests/textures/Paladin_diffuse.png'
      },
      animGltf: {
        type: 'text',
        parser: JSON.parse,
        src: './assets/tests/anims/Zed_cc6b438d631553f468aac60d3bd4d450.gltf'
      },
      animBin: {
        type: 'binary',
        src: './assets/tests/anims/Zed_cc6b438d631553f468aac60d3bd4d450.bin'
      },
    },
    onDone (assets) {
      engine.utils.loadSkin(app, assets.gltf, assets.bin, (err, info) => {
        let skeleton = info.skeleton.clone();
        let mainTexture = new gfx.Texture2D(app.device, {
          width: assets.image.width,
          height: assets.image.height,
          wrapS: gfx.WRAP_CLAMP,
          wrapT: gfx.WRAP_CLAMP,
          mipmap: true,
          images: [assets.image]
        });

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
            skinningModel.setSkeleton(skeleton);
            skinningModel.setJointsTexture(engine.utils.createJointsTexture(app._device, skin));

            // set material
            let material = new StandardMaterial({
              mainTexture,
              color: color4.new(1.0, 1.0, 1.0, 0.6),
            });
            material.useColor = true;
            material.useTexture = true;
            material.blendType = engine.BLEND_NONE;
            skinningModel.addEffect(material._effect);

            skinningModels.push(skinningModel);
            scene.addModel(skinningModel);
          }
        }

        // load animations
        engine.utils.loadAnim(app, assets.animGltf, assets.animBin, (err, animClips) => {
          let clip = animClips[15];
          let t = 0;

          setInterval(() => {
            t += 0.01;
            t %= clip._length;

            clip.sample(skeleton, t);
          }, 10);
        });
      });
    }
  });

  return scene;
})();