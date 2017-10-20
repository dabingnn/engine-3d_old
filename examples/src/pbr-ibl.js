(() => {
  const app = window.app;
  const cc = window.cc;
  const resl = cc.resl;
  const gfx = cc.gfx;
  const { Node, PbrMaterial, Texture2D } = cc;
  const { vec2, vec3, color3, color4, quat, randomRange } = cc.math;
  const { Scene, Model, Light } = cc.renderer;
  const { box, sphere } = cc.primitives;

  // load environment box.
  let envSrc = '../node_modules/assets-3d/textures/pbr/papermill/environment';
  const envUrls = {
    json: `${envSrc}/environment.json`,
    imagePosX: `${envSrc}/environment_right`,
    imageNegX: `${envSrc}/environment_left`,
    imagePosY: `${envSrc}/environment_top`,
    imageNegY: `${envSrc}/environment_bottom`,
    imagePosZ: `${envSrc}/environment_front`,
    imageNegZ: `${envSrc}/environment_back`,
  };
  app.assets.loadUrls('texture-cube', envUrls, (err, cubeMap) => {
    let ent = app.createEntity(`node_${0}`);
    let envCmp = ent.addComp('Skybox');
    envCmp.cubeMap = cubeMap;
  });

  // create sphere mesh
  let meshSphere = cc.utils.createMesh(app, sphere(1, {
    segments: 64,
  }));

  // create material
  // sphere model material
  let pbrMaterial = new Array(5);
  for (let i = 0; i < 5; ++i) {
    pbrMaterial[i] = new PbrMaterial({});
    pbrMaterial[i].useIBL = true;
    pbrMaterial[i].useTexLod = true;
    pbrMaterial[i].maxReflectionLod = 9;
  }
  // cerberus material
  let cerberusMaterial = new PbrMaterial({});
  cerberusMaterial.useIBL = true;
  cerberusMaterial.ao = 1.0;
  cerberusMaterial.useAoTexture = false;

  // load indirect lighting resource
  let diffuseSrc = '../node_modules/assets-3d/textures/pbr/papermill/diffuse';
  const difUrls = {
    json: `${diffuseSrc}/diffuse.json`,
    imagePosX: `${diffuseSrc}/diffuse_right`,
    imageNegX: `${diffuseSrc}/diffuse_left`,
    imagePosY: `${diffuseSrc}/diffuse_top`,
    imageNegY: `${diffuseSrc}/diffuse_bottom`,
    imagePosZ: `${diffuseSrc}/diffuse_front`,
    imageNegZ: `${diffuseSrc}/diffuse_back`,
  };
  app.assets.loadUrls('texture-cube', difUrls, (err, cubeMap) => {
    for (let i = 0; i < 5; ++i) {
      pbrMaterial[i].irradianceMap = cubeMap;
    }
    cerberusMaterial.irradianceMap = cubeMap;
  });

  let specularSrc = '../node_modules/assets-3d/textures/pbr/papermill/specular';
  const specUrls = {
    json: `${specularSrc}/specular.json`,
    imagePosX: `${specularSrc}/specular_right`,
    imageNegX: `${specularSrc}/specular_left`,
    imagePosY: `${specularSrc}/specular_top`,
    imageNegY: `${specularSrc}/specular_bottom`,
    imagePosZ: `${specularSrc}/specular_front`,
    imageNegZ: `${specularSrc}/specular_back`,
  };
  app.assets.loadUrls('texture-cube', specUrls, (err, cubeMap) => {
    let texLod = cubeMap._opts.mipLevel > 1;
    for (let i = 0; i < 5; ++i) {
      pbrMaterial[i].prefilterMap = cubeMap;
      pbrMaterial[i].useTexLod = texLod;
    }
    cerberusMaterial.prefilterMap = cubeMap;
    cerberusMaterial.useTexLod = texLod;
  });

  const lutUrls = {
    image: '../node_modules/assets-3d/textures/pbr/brdfLUT.png',
  };
  app.assets.loadUrls('texture-2d', lutUrls, (err, lutMap) => {
    for (let i = 0; i < 5; ++i) {
      pbrMaterial[i].brdfLUT = lutMap;
    }
    cerberusMaterial.brdfLUT = lutMap;
  });

  // load sphere model texture resource and create model.
  let assetsSrc = '../node_modules/assets-3d/textures/pbr';
  for (let i = 0; i < 5; ++i) {
    resl({
      manifest: {
        albedoImage: {
          type: 'image',
          src: `${assetsSrc}/${i}/albedo.png`
        },
        aoImage: {
          type: 'image',
          src: `${assetsSrc}/${i}/ao.png`
        },
        metallicImage: {
          type: 'image',
          src: `${assetsSrc}/${i}/metallic.png`
        },
        normalImage: {
          type: 'image',
          src: `${assetsSrc}/${i}/normal.png`
        },
        roughnessImage: {
          type: 'image',
          src: `${assetsSrc}/${i}/roughness.png`
        },
      },
      onDone(assets) {
        let albedoAsset = new Texture2D();
        let albedoImg = assets.albedoImage;
        let albedoTex = new gfx.Texture2D(app.device, {
          width: albedoImg.width,
          height: albedoImg.height,
          wrapS: gfx.WRAP_CLAMP,
          wrapT: gfx.WRAP_CLAMP,
          mipmap: true,
          images: [albedoImg]
        });
        albedoAsset._texture = albedoTex;
        pbrMaterial[i].useAlbedoTexture = true;
        pbrMaterial[i].albedoTexture = albedoAsset;

        let aoAsset = new Texture2D();
        let aoImg = assets.aoImage;
        let aoTex = new gfx.Texture2D(app.device, {
          width: aoImg.width,
          height: aoImg.height,
          wrapS: gfx.WRAP_CLAMP,
          wrapT: gfx.WRAP_CLAMP,
          mipmap: true,
          images: [aoImg]
        });
        aoAsset._texture = aoTex;
        pbrMaterial[i].useAoTexture = true;
        pbrMaterial[i].aoTexture = aoAsset;

        let metallicAsset = new Texture2D();
        let metallicImg = assets.metallicImage;
        let metallicTex = new gfx.Texture2D(app.device, {
          width: metallicImg.width,
          height: metallicImg.height,
          wrapS: gfx.WRAP_CLAMP,
          wrapT: gfx.WRAP_CLAMP,
          mipmap: true,
          images: [metallicImg]
        });
        metallicAsset._texture = metallicTex;
        pbrMaterial[i].useMetallicTexture = true;
        pbrMaterial[i].metallicTexture = metallicAsset;

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
        pbrMaterial[i].useNormalTexture = true;
        pbrMaterial[i].normalTexture = normalAsset;

        let roughnessAsset = new Texture2D();
        let roughnessImg = assets.roughnessImage;
        let roughnessTex = new gfx.Texture2D(app.device, {
          width: roughnessImg.width,
          height: roughnessImg.height,
          wrapS: gfx.WRAP_CLAMP,
          wrapT: gfx.WRAP_CLAMP,
          mipmap: true,
          images: [roughnessImg]
        });
        roughnessAsset._texture = roughnessTex;
        pbrMaterial[i].useRoughnessTexture = true;
        pbrMaterial[i].roughnessTexture = roughnessAsset;

        // model
        let ent = app.createEntity(`node_${i}`);
        vec3.set(ent.lpos,
            10*i - 20,//randomRange(-20, 20),
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
        modelComp.material = pbrMaterial[i];
      }
    });
  }

  // load cerberus resource.
  let cerberusSrc = '../node_modules/assets-3d/textures/pbr/cerberus';
  resl({
    manifest: {
      albedoImage: {
        type: 'image',
        src: `${cerberusSrc}/Cerberus_A.png`
      },
      metallicImage: {
        type: 'image',
        src: `${cerberusSrc}/Cerberus_M.png`
      },
      normalImage: {
        type: 'image',
        src: `${cerberusSrc}/Cerberus_N.png`
      },
      roughnessImage: {
        type: 'image',
        src: `${cerberusSrc}/Cerberus_R.png`
      },
    },
    onDone(assets) {
      let albedoAsset = new Texture2D();
      let albedoImg = assets.albedoImage;
      let albedoTex = new gfx.Texture2D(app.device, {
        width: albedoImg.width,
        height: albedoImg.height,
        wrapS: gfx.WRAP_CLAMP,
        wrapT: gfx.WRAP_CLAMP,
        mipmap: true,
        images: [albedoImg]
      });
      albedoAsset._texture = albedoTex;
      cerberusMaterial.useAlbedoTexture = true;
      cerberusMaterial.albedoTexture = albedoAsset;

      let metallicAsset = new Texture2D();
      let metallicImg = assets.metallicImage;
      let metallicTex = new gfx.Texture2D(app.device, {
        width: metallicImg.width,
        height: metallicImg.height,
        wrapS: gfx.WRAP_CLAMP,
        wrapT: gfx.WRAP_CLAMP,
        mipmap: true,
        images: [metallicImg]
      });
      metallicAsset._texture = metallicTex;
      cerberusMaterial.useMetallicTexture = true;
      cerberusMaterial.metallicTexture = metallicAsset;

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
      cerberusMaterial.useNormalTexture = true;
      cerberusMaterial.normalTexture = normalAsset;

      let roughnessAsset = new Texture2D();
      let roughnessImg = assets.roughnessImage;
      let roughnessTex = new gfx.Texture2D(app.device, {
        width: roughnessImg.width,
        height: roughnessImg.height,
        wrapS: gfx.WRAP_CLAMP,
        wrapT: gfx.WRAP_CLAMP,
        mipmap: true,
        images: [roughnessImg]
      });
      roughnessAsset._texture = roughnessTex;
      cerberusMaterial.useRoughnessTexture = true;
      cerberusMaterial.roughnessTexture = roughnessAsset;
    }
  });

  let Cerberus = {
    gltf: '../node_modules/assets-3d/textures/pbr/cerberus/a5c37fd97fce24fea81d95160e2f1caf.gltf',
    bin: '../node_modules/assets-3d/textures/pbr/cerberus/a5c37fd97fce24fea81d95160e2f1caf.bin'
  }
  app.assets.loadUrls('mesh', Cerberus, (err, mesh) =>{
    let ent = app.createEntity('model');
    quat.fromEuler(ent.lrot, 90, 0, 0);
    vec3.set(ent.lscale, 10, 10, 10);
    vec3.set(ent.lpos,8,8,0);
    let modelComp = ent.addComp('Model');
    modelComp.mesh = mesh;
    modelComp.material = cerberusMaterial;
  });

  // light
  for (let index = 0; index < 1; ++index) {
    let entity = app.createEntity(`light_${index}`);
    vec3.set(entity.lpos, 0, 10, 0);
    let light = entity.addComp('Light');
    light.setType(cc.renderer.LIGHT_POINT);
    light.setColor(1.0, 1.0, 1.0);
    light.setIntensity(5.0);
    light.setRange(1000.0);
  }
  // let light1 = app.createEntity('light1');
  // quat.fromEuler(light1.lrot, -45, 135, 0);

  // let lightComp1 = light1.addComp('Light');
  // lightComp1.setColor(1, 1, 1);
  // lightComp1.setIntensity(5);

  // camera
  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

})();