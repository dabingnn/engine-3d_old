(() => {
  const app = window.app;
  const cc = window.cc;

  const resl = cc.resl;
  const gfx = cc.gfx;
  const { Node, StandardMaterial } = cc;
  const { Scene, Model } = cc.renderer;
  const { vec3, quat, color4 } = cc.math;

  // create material
  let material = new StandardMaterial({
    color: color4.new(1.0, 1.0, 1.0, 0.6),
  });
  material.useColor = true;
  material.useTexture = true;
  material.useSkinning = false;
  material.blendType = cc.BLEND_NONE;

  let Cerberus = {
    gltf: {
      type: 'text',
      parser: JSON.parse,
      src: '../node_modules/assets-3d/models/Cerberus/Cerberus00_Fixed_a5c37fd97fce24fea81d95160e2f1caf.gltf'
    },
    bin: {
      type: 'binary',
      src: '../node_modules/assets-3d/models/Cerberus/Cerberus00_Fixed_a5c37fd97fce24fea81d95160e2f1caf.bin'
    },
    image_A: {
      type: 'image',
      src: '../node_modules/assets-3d/models/Cerberus/cerberus_A.png'
    }
  };

  let biohazard = {
    gltf: {
      type: 'text',
      parser: JSON.parse,
      src: './test-assets/biohazard/body_80d8edc52714b4c179460a32e8c3c2f6.gltf'
    },
    bin: {
      type: 'binary',
      src: './test-assets/biohazard/body_80d8edc52714b4c179460a32e8c3c2f6.bin'
    },
    image_A: {
      type: 'image',
      src: './test-assets/biohazard/diffuse.jpg'
    }
  };

  let vikingroom = {
    gltf: {
      type: 'text',
      parser: JSON.parse,
      src: './test-assets/vikingroom/mesh.gltf'
    },
    bin: {
      type: 'binary',
      src: './test-assets/vikingroom/mesh.bin'
    },
    image_A: {
      type: 'image',
      src: './test-assets/vikingroom/diffuse.png'
    }
  };

  resl({
    manifest: Cerberus,
    // manifest: biohazard,
    // manifest: vikingroom,

    onDone (assets) {
      cc.utils.loadMesh(app, assets.gltf, assets.bin, (err, asset) => {
        // TODO:
        // for (let i = 0; i < asset.subMeshCount; ++i) {
        //   model.addMesh(asset.getSubMesh(i));
        // }

        // let image = assets.image_A;
        // let texture = new gfx.Texture2D(app.device, {
        //   width: image.width,
        //   height: image.height,
        //   wrapS: gfx.WRAP_REPEAT,
        //   wrapT: gfx.WRAP_REPEAT,
        //   mipmap: true,
        //   images: [image]
        // });
        // material.mainTexture = texture;
        // model.addEffect(material._effect);

        // let node = new Node('Cerberus');
        // quat.fromEuler(node.lrot, 0, 0, 0);
        // vec3.set(node.lscale, 10, 10, 10);
        // model.setNode(node);

        // scene.addModel(model);
      });
    }
  });
})();