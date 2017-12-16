(() => {
  const { cc, app, dgui } = window;
  const { resl, gfx, Texture2D, Material } = cc;
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
    } else {
      if (skyboxEnt) {
        skyboxEnt.destroy();
        skyboxEnt = null;
      }
    }
    // TODO: skyboxEnt.enabled = dobj.useIBL;
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
        pbrMaterial.setOption('USE_ALBEDO_TEXTURE', true);
        pbrMaterial.setProperty('albedoTexture', texture);
      } else {
        pbrMaterial.setOption('USE_ALBEDO_TEXTURE', false);
      }
    });
  });
  dgui.add(dobj, 'normal').onFinishChange(() => {
    loadTexture(dobj.normal, texture => {
      if (texture) {
        pbrMaterial.setOption('USE_NORMAL_TEXTURE', true);
        pbrMaterial.setProperty('normalTexture', texture);
      } else {
        pbrMaterial.setOption('USE_NORMAL_TEXTURE', false);
      }
    });
  });
  dgui.add(dobj, 'metallic').onFinishChange(() => {
    loadTexture(dobj.metallic, texture => {
      if (texture) {
        pbrMaterial.setOption('USE_METALLIC_TEXTURE', true);
        pbrMaterial.setProperty('metallicTexture', texture);
      } else {
        pbrMaterial.setOption('USE_METALLIC_TEXTURE', false);
      }
    });
  });
  dgui.add(dobj, 'roughness').onFinishChange(() => {
    loadTexture(dobj.roughness, texture => {
      if (texture) {
        pbrMaterial.setOption('USE_ROUGHNESS_TEXTURE', true);
        pbrMaterial.setProperty('roughnessTexture', texture);
      } else {
        pbrMaterial.setOption('USE_ROUGHNESS_TEXTURE', false);
      }
    });
  });
  dgui.add(dobj, 'ao').onFinishChange(() => {
    loadTexture(dobj.ao, texture => {
      if (texture) {
        pbrMaterial.setOption('USE_AO_TEXTURE', true);
        pbrMaterial.setProperty('aoTexture', texture);
      } else {
        pbrMaterial.setOption('USE_AO_TEXTURE', false);
      }
    });
  });

  // pre-alloc assets
  let meshSphere = cc.utils.createMesh(app, sphere(3, {
    segments: 64,
  }));

  // create skybox
  let skyboxEnt = null;

  // create point light
  let lightEnt = app.createEntity('point-light');
  vec3.set(lightEnt.lpos, 10, 10, 0);
  let light = lightEnt.addComp('Light');
  light.type = cc.renderer.LIGHT_POINT;
  light.color = color3.new(1, 1, 1);
  light.intensity = 5.0;
  light.range = 1000.0;

  let pbrMaterial = new Material();
  pbrMaterial.effectAsset = app.assets.get('builtin-pbr');

  pbrMaterial.setOption('USE_IBL', dobj.useIBL);
  pbrMaterial.setOption('USE_TEX_LOD', dobj.useTexLod);
  pbrMaterial.setProperty('maxReflectionLod', dobj.maxRefLod);
  pbrMaterial.setProperty('ao', 1.0);
  pbrMaterial.setOption('USE_AO_TEXTURE', false);
    // start loading
  loadIBL();
  const lutUrls = {
    image: './assets/textures/brdfLUT.png',
  };
  app.assets.loadUrls('texture', lutUrls, (err, lutMap) => {
    pbrMaterial.setProperty('brdfLUT', lutMap._texture);
  });
  loadTexture(dobj.albedo, texture => {
    if (texture) {
      pbrMaterial.setOption('USE_ALBEDO_TEXTURE', true);
      pbrMaterial.setProperty('albedoTexture', texture._texture);
    } else {
      pbrMaterial.setOption('USE_ALBEDO_TEXTURE', false);
    }
  });
  loadTexture(dobj.normal, texture => {
    if (texture) {
      pbrMaterial.setOption('USE_NORMAL_TEXTURE', true);
      pbrMaterial.setProperty('normalTexture', texture._texture);
    } else {
      pbrMaterial.setOption('USE_NORMAL_TEXTURE', false);
    }
  });
  loadTexture(dobj.metallic, texture => {
    if (texture) {
      pbrMaterial.setOption('USE_METALLIC_TEXTURE', true);
      pbrMaterial.setProperty('metallicTexture', texture._texture);
    } else {
      pbrMaterial.setOption('USE_METALLIC_TEXTURE', false);
    }
  });
  loadTexture(dobj.roughness, texture => {
    if (texture) {
      pbrMaterial.setOption('USE_ROUGHNESS_TEXTURE', true);
      pbrMaterial.setProperty('roughnessTexture', texture._texture);
    } else {
      pbrMaterial.setOption('USE_ROUGHNESS_TEXTURE', false);
    }
  });
  loadTexture(dobj.ao, texture => {
    if (texture) {
      pbrMaterial.setOption('USE_AO_TEXTURE', true);
      pbrMaterial.setProperty('aoTexture', texture._texture);
    } else {
      pbrMaterial.setOption('USE_AO_TEXTURE', false);
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
  camEnt.addComp('Camera');

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
      skyboxEnt = app.createEntity('skybox');
      let skyboxComp = skyboxEnt.addComp('Skybox');
      let skyboxMaterial = new Material();
      skyboxMaterial.effectAsset = app.assets.get('builtin-skybox');
      skyboxMaterial.setProperty('cubeMap', cubeMap._texture);
      skyboxComp.material = skyboxMaterial;
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
      pbrMaterial.setProperty('diffuseEnvTexture', cubeMap._texture);
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
      pbrMaterial.setProperty('specularEnvTexture', cubeMap._texture);
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
        let texture = new Texture2D();
        let gpuTexture = new gfx.Texture2D(app.device, {
          width: assets.image.width,
          height: assets.image.height,
          wrapS: gfx.WRAP_CLAMP,
          wrapT: gfx.WRAP_CLAMP,
          mipmap: true,
          images: [assets.image]
        });
        texture._texture = gpuTexture;

        cb(texture);
      }
    });
  }

})();