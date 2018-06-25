(() => {
  const { cc, app, dgui } = window;
  const { resl, Texture2D, Material } = cc;
  const { vec3, color3 } = cc.math;
  const { sphere } = cc.primitives;

  let dobj = {
    useIBL: true,
    useTexLod: true,
    maxRefLod: 9.0,
    envURL: './assets/ibl-bakes/papermill',
    albedo: './assets/textures/grid.png',
    normal: '',
    ao: '',
    metallic: './assets/textures/grid.png',
    roughness: './assets/textures/grid.png',
  };
  dgui.remember(dobj);
  dgui.add(dobj, 'useIBL').onFinishChange(() => {
    pbrMaterial.useIBL = dobj.useIBL;
    if (dobj.useIBL) {
      loadIBL();
    }
  });

  dgui.add(dobj, 'useTexLod').onFinishChange(() => {
    pbrMaterial.useTexLod = dobj.useTexLod;
  });
  dgui.add(dobj, 'maxRefLod').onFinishChange(() => {
    pbrMaterial.maxReflectionLod = dobj.maxRefLod;
  });
  dgui.add(dobj, 'envURL').onFinishChange(() => {
    loadIBL();
  });
  dgui.add(dobj, 'albedo').onFinishChange(() => {
    loadTexture(dobj.albedo, texture => {
      if (texture) {
        pbrMaterial.define('USE_ALBEDO_TEXTURE', true);
        pbrMaterial.setProperty('albedo_texture', texture);
      } else {
        pbrMaterial.define('USE_ALBEDO_TEXTURE', false);
      }
    });
  });
  dgui.add(dobj, 'normal').onFinishChange(() => {
    loadTexture(dobj.normal, texture => {
      if (texture) {
        pbrMaterial.define('USE_NORMAL_TEXTURE', true);
        pbrMaterial.setProperty('normal_texture', texture);
      } else {
        pbrMaterial.define('USE_NORMAL_TEXTURE', false);
      }
    });
  });
  dgui.add(dobj, 'metallic').onFinishChange(() => {
    loadTexture(dobj.metallic, texture => {
      if (texture) {
        pbrMaterial.define('USE_METALLIC_TEXTURE', true);
        pbrMaterial.setProperty('metallic_texture', texture);
      } else {
        pbrMaterial.define('USE_METALLIC_TEXTURE', false);
      }
    });
  });
  dgui.add(dobj, 'roughness').onFinishChange(() => {
    loadTexture(dobj.roughness, texture => {
      if (texture) {
        pbrMaterial.define('USE_ROUGHNESS_TEXTURE', true);
        pbrMaterial.setProperty('roughness_texture', texture);
      } else {
        pbrMaterial.define('USE_ROUGHNESS_TEXTURE', false);
      }
    });
  });
  dgui.add(dobj, 'ao').onFinishChange(() => {
    loadTexture(dobj.ao, texture => {
      if (texture) {
        pbrMaterial.define('USE_AO_TEXTURE', true);
        pbrMaterial.setProperty('ao_texture', texture);
      } else {
        pbrMaterial.define('USE_AO_TEXTURE', false);
      }
    });
  });

  // pre-alloc assets
  let meshSphere = cc.utils.createMesh(app, sphere(3, {
    segments: 64,
  }));

  // create point light
  let lightEnt = app.createEntity('point-light');
  vec3.set(lightEnt.lpos, 10, 10, 0);
  let light = lightEnt.addComp('Light');
  light.type = 'point';
  light.color = color3.new(1, 1, 1);
  light.intensity = 5.0;
  light.range = 1000.0;

  let pbrMaterial = new Material();
  pbrMaterial.effect = app.assets.get('builtin-effect-pbr');

  pbrMaterial.define('USE_IBL', dobj.useIBL);
  pbrMaterial.define('USE_TEX_LOD', dobj.useTexLod);
  pbrMaterial.setProperty('maxReflectionLod', dobj.maxRefLod);
  pbrMaterial.setProperty('ao', 1.0);
  pbrMaterial.define('USE_AO_TEXTURE', false);
  // start loading
  loadIBL();
  const lutUrls = {
    json: './assets/textures/brdfLUT.json',
    image: './assets/textures/brdfLUT.png',
  };
  app.assets.loadUrls('texture', lutUrls, (err, lutMap) => {
    pbrMaterial.setProperty('brdfLUT', lutMap);
  });
  loadTexture(dobj.albedo, texture => {
    if (texture) {
      pbrMaterial.define('USE_ALBEDO_TEXTURE', true);
      pbrMaterial.setProperty('albedo_texture', texture);
    } else {
      pbrMaterial.define('USE_ALBEDO_TEXTURE', false);
    }
  });
  loadTexture(dobj.normal, texture => {
    if (texture) {
      pbrMaterial.define('USE_NORMAL_TEXTURE', true);
      pbrMaterial.setProperty('normal_texture', texture);
    } else {
      pbrMaterial.define('USE_NORMAL_TEXTURE', false);
    }
  });
  loadTexture(dobj.metallic, texture => {
    if (texture) {
      pbrMaterial.define('USE_METALLIC_TEXTURE', true);
      pbrMaterial.setProperty('metallic_texture', texture);
    } else {
      pbrMaterial.define('USE_METALLIC_TEXTURE', false);
    }
  });
  loadTexture(dobj.roughness, texture => {
    if (texture) {
      pbrMaterial.define('USE_ROUGHNESS_TEXTURE', true);
      pbrMaterial.setProperty('roughness_texture', texture);
    } else {
      pbrMaterial.define('USE_ROUGHNESS_TEXTURE', false);
    }
  });
  loadTexture(dobj.ao, texture => {
    if (texture) {
      pbrMaterial.define('USE_AO_TEXTURE', true);
      pbrMaterial.setProperty('ao_texture', texture);
    } else {
      pbrMaterial.define('USE_AO_TEXTURE', false);
    }
  });

  let ent = app.createEntity('sphere');
  let modelComp = ent.addComp('Model');
  modelComp.mesh = meshSphere;
  modelComp.material = pbrMaterial;

  // camera
  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  let camComp = camEnt.addComp('Camera');
  camComp.clearFlags = camComp.clearFlags | cc.renderer.CLEAR_SKYBOX;
  app._debugger._camera._clearFlags = camComp.clearFlags;

  function loadIBL () {
    if (!dobj.useIBL) {
      return;
    }

    // load environment box.
    let envSrc = `${dobj.envURL}/environment`;
    const envUrls = {
      json: `${envSrc}/environment.json`,
      imagePosX: `${envSrc}/environment_right_0.jpg`,
      imageNegX: `${envSrc}/environment_left_0.jpg`,
      imagePosY: `${envSrc}/environment_top_0.jpg`,
      imageNegY: `${envSrc}/environment_bottom_0.jpg`,
      imagePosZ: `${envSrc}/environment_front_0.jpg`,
      imageNegZ: `${envSrc}/environment_back_0.jpg`,
    };
    app.assets.loadUrls('texture', envUrls, (err, cubeMap) => {
      let skyboxComp = camEnt.addComp('Skybox');
      let skyboxMaterial = new Material();
      skyboxMaterial.effect = app.assets.get('builtin-effect-skybox');
      skyboxMaterial.setProperty('cubeMap', cubeMap);
      skyboxComp.material = skyboxMaterial;
      app._debugger._camera._clearModel = skyboxComp._model;
    });

    // load indirect lighting resource
    let diffuseSrc = `${dobj.envURL}/diffuse`;
    const difUrls = {
      json: `${diffuseSrc}/diffuse.json`,
      imagePosX: `${diffuseSrc}/diffuse_right_0.jpg`,
      imageNegX: `${diffuseSrc}/diffuse_left_0.jpg`,
      imagePosY: `${diffuseSrc}/diffuse_top_0.jpg`,
      imageNegY: `${diffuseSrc}/diffuse_bottom_0.jpg`,
      imagePosZ: `${diffuseSrc}/diffuse_front_0.jpg`,
      imageNegZ: `${diffuseSrc}/diffuse_back_0.jpg`,
    };
    app.assets.loadUrls('texture', difUrls, (err, cubeMap) => {
      pbrMaterial.setProperty('diffuseEnvTexture', cubeMap);
    });

    let specularSrc = `${dobj.envURL}/specular`;
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
    app.assets.loadUrls('texture', specUrls, (err, cubeMap) => {
      pbrMaterial.setProperty('specularEnvTexture', cubeMap);
    });
  }

  function loadTexture (url, cb) {
    if (!url) {
      cb(null);
      return;
    }

    resl({
      manifest: {
        image: {
          type: 'image',
          src: url,
        },
      },
      onDone(assets) {
        let texture = new Texture2D(app.device);
        texture.setImage(0, assets.image);
        texture.wrapS = 'clamp';
        texture.wrapT = 'clamp';
        texture.mipmap = true;
        texture.commit();

        cb(texture);
      }
    });
  }

})();