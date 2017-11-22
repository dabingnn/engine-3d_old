(() => {
  const { cc, app, dgui } = window;
  const resl = cc.resl;
  const gfx = cc.gfx;
  const { Node, PbrMaterial, Texture2D } = cc;
  const { vec2, vec3, color3, color4, quat, randomRange } = cc.math;
  const { Scene, Model, Light } = cc.renderer;
  const { box, sphere } = cc.primitives;

  let dobj = {
    useTexLod: true,
    maxRefLod: 9.0,
    envSrcUrl: '../node_modules/assets-3d/textures/pbr/papermill'
  }
  dgui.remember(dobj);
  dgui.add(dobj, 'useTexLod');
  dgui.add(dobj, 'maxRefLod');
  dgui.add(dobj, 'envSrcUrl');

  // load environment box.
  let envSrc = `${dobj.envSrcUrl}/environment`;
  const envUrls = {
    json: `${envSrc}/environment.json`,
    imagePosX: `${envSrc}/environment_right_0.jpg`,
    imageNegX: `${envSrc}/environment_left_0.jpg`,
    imagePosY: `${envSrc}/environment_top_0.jpg`,
    imageNegY: `${envSrc}/environment_bottom_0.jpg`,
    imagePosZ: `${envSrc}/environment_front_0.jpg`,
    imageNegZ: `${envSrc}/environment_back_0.jpg`,
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
    pbrMaterial[i].useTexLod = dobj.useTexLod;
    pbrMaterial[i].maxReflectionLod = dobj.maxRefLod;
  }
  // cerberus material
  let cerberusMaterial = new PbrMaterial({});
  cerberusMaterial.useIBL = true;
  cerberusMaterial.ao = 1.0;
  cerberusMaterial.useAoTexture = false;

  // load indirect lighting resource
  let diffuseSrc = `${dobj.envSrcUrl}/diffuse`;
  const difUrls = {
    json: `${diffuseSrc}/diffuse.json`,
    imagePosX: `${diffuseSrc}/diffuse_right_0.jpg`,
    imageNegX: `${diffuseSrc}/diffuse_left_0.jpg`,
    imagePosY: `${diffuseSrc}/diffuse_top_0.jpg`,
    imageNegY: `${diffuseSrc}/diffuse_bottom_0.jpg`,
    imagePosZ: `${diffuseSrc}/diffuse_front_0.jpg`,
    imageNegZ: `${diffuseSrc}/diffuse_back_0.jpg`,
  };
  app.assets.loadUrls('texture-cube', difUrls, (err, cubeMap) => {
    for (let i = 0; i < 5; ++i) {
      pbrMaterial[i].diffuseEnvTexture = cubeMap;
    }
    cerberusMaterial.diffuseEnvTexture = cubeMap;
  });

  let specularSrc = `${dobj.envSrcUrl}/specular`;
  let specUrls = {
    json: `${specularSrc}/specular.json`,
  };
  for(let i = 0; i < 10; ++i) {
    let suffix = i === 0 ? '' : `@${i}`;
    specUrls[`imagePosX${suffix}`] = `${specularSrc}/specular_right_${i}.jpg`;
    specUrls[`imageNegX${suffix}`] = `${specularSrc}/specular_left_${i}.jpg`;
    specUrls[`imagePosY${suffix}`] = `${specularSrc}/specular_top_${i}.jpg`;
    specUrls[`imageNegY${suffix}`] = `${specularSrc}/specular_bottom_${i}.jpg`;
    specUrls[`imagePosZ${suffix}`] = `${specularSrc}/specular_front_${i}.jpg`;
    specUrls[`imageNegZ${suffix}`] = `${specularSrc}/specular_back_${i}.jpg`;
  }
  app.assets.loadUrls('texture-cube', specUrls, (err, cubeMap) => {
    for (let i = 0; i < 5; ++i) {
      pbrMaterial[i].specularEnvTexture = cubeMap;
      pbrMaterial[i].useTexLod = dobj.useTexLod;
    }
    cerberusMaterial.specularEnvTexture = cubeMap;
    cerberusMaterial.useTexLod = dobj.useTexLod;
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
            10*i - 20,
            0,
            0,
          );
          quat.fromEuler(ent.lrot,
            randomRange(0, 360),
            randomRange(0, 360),
            randomRange(0, 360)
          );
          vec3.set(ent.lscale,
            3,
            3,
            3
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
        wrapS: gfx.WRAP_REPEAT,
        wrapT: gfx.WRAP_REPEAT,
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
        wrapS: gfx.WRAP_REPEAT,
        wrapT: gfx.WRAP_REPEAT,
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
        wrapS: gfx.WRAP_REPEAT,
        wrapT: gfx.WRAP_REPEAT,
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
        wrapS: gfx.WRAP_REPEAT,
        wrapT: gfx.WRAP_REPEAT,
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
    vec3.set(ent.lpos,8 - 15,8,0);
    let modelComp = ent.addComp('Model');
    modelComp.mesh = mesh;
    modelComp.material = cerberusMaterial;
  });

  // light
  for (let index = 0; index < 1; ++index) {
    let entity = app.createEntity(`light_${index}`);
    vec3.set(entity.lpos, 0, 100, 0);
    quat.fromEuler(entity.lrot, -90, 0, 0);
    let light = entity.addComp('Light');
    //light.type = cc.renderer.LIGHT_SPOT;
    light.type = cc.renderer.LIGHT_DIRECTIONAL;
    light.color = color3.new(1.0, 1.0, 1.0);
    light.intensity = 3.0;
    light.range = 1000.0;
    light.castShadow = true;
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

  let meshBox = cc.utils.createMesh(app, cc.primitives.box(1, 1, 1, {
    widthSegments: 1,
    heightSegments: 1,
    lengthSegments: 1,
  }));
  let material = new cc.PbrMaterial();
  material.roughness = 0.5;
  material.metallic = 1.0;
  let plane = app.createEntity(`node_2`);
  vec3.set(plane.lpos, 0, -8, 0);
  vec3.set(plane.lscale, 100, 1, 100);
  let modelPlane = plane.addComp('Model');
  modelPlane.mesh = meshBox;
  modelPlane.material = material;

})();