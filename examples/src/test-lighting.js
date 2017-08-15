(() => {
  const app = window.app;
  const cc = window.cc;

  const resl = cc.resl;
  const gfx = cc.gfx;
  const { PhongMaterial } = cc;
  const { vec3, quat, color3, color4 } = cc.math;

  //
  let light0 = app.createEntity('light0');
  quat.fromEuler(light0.lrot, -45, 135, 0);

  let lightComp0 = light0.addComp('Light');
  lightComp0.setColor(1, 1, 1);

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
    },
    image_E: {
      type: 'image',
      src: './test-assets/biohazard/glow5.jpg'
    },
    image_S: {
      type: 'image',
      src: './test-assets/biohazard/spec.jpg'
    },
    image_N: {
      type: 'image',
      src: './test-assets/biohazard/normal.jpg'
    }
  };

  resl({
    // manifest: Cerberus,
    manifest: biohazard,

    onDone (assets) {
      cc.utils.loadMesh(app, assets.gltf, assets.bin, (err, asset) => {
        // create material
        let material = new PhongMaterial({
          color: color4.new(1.0, 1.0, 1.0, 1.0),
        });
        material.blendType = cc.BLEND_NONE;
        // material.diffuseColor = cc.BLEND_NONE;
        material.useDiffuseTexture = true;
        material.useEmissive = true;
        material.useEmissiveTexture = true;
        material.useSpecular = true;
        material.useSpecularTexture = true;
        material.useNormal = true;
        material.useNormalTexture = true;

        let image = assets.image_A;
        let diffuseTexture = new gfx.Texture2D(app.device, {
          width: image.width,
          height: image.height,
          wrapS: gfx.WRAP_REPEAT,
          wrapT: gfx.WRAP_REPEAT,
          mipmap: true,
          images: [image]
        });

        image = assets.image_E;
        let emissiveTexture = new gfx.Texture2D(app.device, {
          width: image.width,
          height: image.height,
          wrapS: gfx.WRAP_REPEAT,
          wrapT: gfx.WRAP_REPEAT,
          mipmap: true,
          images: [image]
        });

        image = assets.image_S;
        let specularTexture = new gfx.Texture2D(app.device, {
          width: image.width,
          height: image.height,
          wrapS: gfx.WRAP_REPEAT,
          wrapT: gfx.WRAP_REPEAT,
          mipmap: true,
          images: [image]
        });

        image = assets.image_N;
        let normalTexture = new gfx.Texture2D(app.device, {
          width: image.width,
          height: image.height,
          wrapS: gfx.WRAP_REPEAT,
          wrapT: gfx.WRAP_REPEAT,
          mipmap: true,
          images: [image]
        });

        material.diffuseTexture = diffuseTexture;
        material.emissiveTexture = emissiveTexture;
        material.specularTexture = specularTexture;
        material.normalTexture = normalTexture;
        material.specularColor = color3.new(1,1,1);

        // create entity
        let ent = app.createEntity('model');
        quat.fromEuler(ent.lrot, 0, 0, 0);
        vec3.set(ent.lscale, 0.1, 0.1, 0.1);

        // create component
        let modelComp = ent.addComp('Model');
        modelComp.mesh = asset;
        modelComp.material = material;
      });
    }
  });
})();
