(() => {
  const app = window.app;
  const cc = window.cc;

  const resl = cc.resl;
  const gfx = cc.gfx;
  const { Node, PbrMaterial, Texture2D } = cc;
  const { vec2, vec3, color3, color4, quat, randomRange } = cc.math;
  const { Scene, Model, Light } = cc.renderer;
  const { box, sphere } = cc.primitives;

  // create sphere mesh
  let meshSphere = cc.utils.createMesh(app, sphere(1, {
      segments: 64,
  }));

  let meshBox = cc.utils.createMesh(app,box(1, 1, 1, {
    widthSegments: 1,
    heightSegments: 1,
    lengthSegments:1,
  }))

  // create material
  let pbrMaterial = new PbrMaterial({});
  pbrMaterial.metallic = 0.6;
  pbrMaterial.roughness = 0.2;
  let assetsSrc = '../node_modules/assets-3d/textures/pbr/rusted_iron';
  resl({
    manifest: {
      albedoImage: {
        type: 'image',
        src: `${assetsSrc}/albedo.png`
      },
      aoImage: {
        type: 'image',
        src: `${assetsSrc}/ao.png`
      },
      metallicImage: {
        type: 'image',
        src: `${assetsSrc}/metallic.png`
      },
      normalImage: {
        type: 'image',
        src: `${assetsSrc}/normal.png`
      },
      roughnessImage: {
        type: 'image',
        src: `${assetsSrc}/roughness.png`
      },
    },
    onDone(assets) {
      let albedoAsset = new Texture2D();
      let albedoImg = assets.albedoImage;
      let albedoTex = new gfx.Texture2D(app.device, {
        width: albedoImg.width,
        height: albedoImg.height,
        wrapS: gfx.WRAP_REPEAT,
        wrapT: gfx.WRAP_REPEAT,
        mipmap: false,
        images: [albedoImg]
      });
      albedoAsset._texture = albedoTex;
      pbrMaterial.useAlbedoTexture = true;
      pbrMaterial.albedoTexture = albedoAsset;

      let aoAsset = new Texture2D();
      let aoImg = assets.aoImage;
      let aoTex = new gfx.Texture2D(app.device, {
        width: aoImg.width,
        height: aoImg.height,
        wrapS: gfx.WRAP_REPEAT,
        wrapT: gfx.WRAP_REPEAT,
        mipmap: false,
        images: [aoImg]
      });
      aoAsset._texture = aoTex;
      pbrMaterial.useAoTexture = true;
      pbrMaterial.aoTexture = aoAsset;

      let metallicAsset = new Texture2D();
      let metallicImg = assets.metallicImage;
      let metallicTex = new gfx.Texture2D(app.device, {
        width: metallicImg.width,
        height: metallicImg.height,
        wrapS: gfx.WRAP_REPEAT,
        wrapT: gfx.WRAP_REPEAT,
        mipmap: false,
        images: [metallicImg]
      });
      metallicAsset._texture = metallicTex;
      pbrMaterial.useMetallicTexture = true;
      pbrMaterial.metallicTexture = metallicAsset;

      let normalAsset = new Texture2D();
      let normalImg = assets.normalImage;
      let normalTex = new gfx.Texture2D(app.device, {
        width: normalImg.width,
        height: normalImg.height,
        wrapS: gfx.WRAP_CLAMP,
        wrapT: gfx.WRAP_CLAMP,
        mipmap: true,
        images: [normalImg]
      });
      normalAsset._texture = normalTex;
      pbrMaterial.useNormalTexture = true;
      pbrMaterial.normalTexture = normalAsset;

      let roughnessAsset = new Texture2D();
      let roughnessImg = assets.roughnessImage;
      let roughnessTex = new gfx.Texture2D(app.device, {
        width: roughnessImg.width,
        height: roughnessImg.height,
        wrapS: gfx.WRAP_REPEAT,
        wrapT: gfx.WRAP_REPEAT,
        mipmap: false,
        images: [roughnessImg]
      });
      roughnessAsset._texture = roughnessTex;
      pbrMaterial.useRoughnessTexture = true;
      pbrMaterial.roughnessTexture = roughnessAsset;
    }
  });

  // models
  for (let i = 0; i < 10; ++i) {
    let ent = app.createEntity(`node_${i}`);
    vec3.set(ent.lpos,
        10*i - 50,//randomRange(-20, 20),
        0,//randomRange(-10, 10),
        0,//randomRange(-20, 20)
      );
      quat.fromEuler(ent.lrot,
        randomRange(0, 360),
        randomRange(0, 360),
        randomRange(0, 360)
      );
      vec3.set(ent.lscale,
        3, //randomRange(1, 5),
        3, //randomRange(1, 5),
        3 //randomRange(1, 5)
      );

      let modelComp = ent.addComp('Model');
      modelComp.mesh = meshSphere;
      modelComp.material = pbrMaterial;
  }

  // light
  for (let index = 0; index < 1; ++index) {
    let entity = app.createEntity(`light_${index}`);
    vec3.set(entity.lpos, 0, 10, 0);
    let light = entity.addComp('Light');
    light.setType(cc.renderer.LIGHT_POINT);
    light.setColor(1.0, 1.0, 1.0);
    light.setIntensity(1000.0);
    light.setRange(10000.0);
  }
  let light1 = app.createEntity('light1');
  quat.fromEuler(light1.lrot, -45, 135, 0);

  let lightComp1 = light1.addComp('Light');
  lightComp1.setColor(1, 1, 1);

  // camera
  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

})();