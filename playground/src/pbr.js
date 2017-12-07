(() => {
  const { cc, app, dgui } = window;
  const { resl, gfx, PbrMaterial, Texture2D } = cc;
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
        pbrMaterial.useAlbedoTexture = true;
        pbrMaterial.albedoTexture = texture;
      } else {
        pbrMaterial.useAlbedoTexture = false;
      }
    });
  });
  dgui.add(dobj, 'normal').onFinishChange(() => {
    loadTexture(dobj.normal, texture => {
      if (texture) {
        pbrMaterial.useNormalTexture = true;
        pbrMaterial.normalTexture = texture;
      } else {
        pbrMaterial.useNormalTexture = false;
      }
    });
  });
  dgui.add(dobj, 'metallic').onFinishChange(() => {
    loadTexture(dobj.metallic, texture => {
      if (texture) {
        pbrMaterial.useMetallicTexture = true;
        pbrMaterial.metallicTexture = texture;
      } else {
        pbrMaterial.useMetallicTexture = false;
      }
    });
  });
  dgui.add(dobj, 'roughness').onFinishChange(() => {
    loadTexture(dobj.roughness, texture => {
      if (texture) {
        pbrMaterial.useRoughnessTexture = true;
        pbrMaterial.roughnessTexture = texture;
      } else {
        pbrMaterial.useRoughnessTexture = false;
      }
    });
  });
  dgui.add(dobj, 'ao').onFinishChange(() => {
    loadTexture(dobj.ao, texture => {
      if (texture) {
        pbrMaterial.useAoTexture = true;
        pbrMaterial.aoTexture = texture;
      } else {
        pbrMaterial.useAoTexture = false;
      }
    });
  });

  // pre-alloc assets
  let meshSphere = cc.utils.createMesh(app, sphere(3, {
    segments: 64,
  }));
  let pbrMaterial = new PbrMaterial({});
  pbrMaterial.useIBL = dobj.useIBL;
  pbrMaterial.useTexLod = dobj.useTexLod;
  pbrMaterial.maxReflectionLod = dobj.maxRefLod;
  pbrMaterial.ao = 1.0;
  pbrMaterial.useAoTexture = false;

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

  // let light1 = app.createEntity('light1');
  // quat.fromEuler(light1.lrot, -45, 135, 0);
  // let lightComp1 = light1.addComp('Light');
  // lightComp1.setColor(1, 1, 1);
  // lightComp1.setIntensity(5);

  // create sphere entity
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

    if (!skyboxEnt) {
      skyboxEnt = app.createEntity('skybox');
      skyboxEnt.addComp('Skybox');
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
      skyboxEnt.getComp('Skybox').cubeMap = cubeMap;
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
      pbrMaterial.diffuseEnvTexture = cubeMap;
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
      pbrMaterial.specularEnvTexture = cubeMap;
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

  // start loading
  loadIBL();
  const lutUrls = {
    image: './assets/textures/brdfLUT.png',
  };
  app.assets.loadUrls('texture', lutUrls, (err, lutMap) => {
    pbrMaterial.brdfLUT = lutMap;
  });
  loadTexture(dobj.albedo, texture => {
    if (texture) {
      pbrMaterial.useAlbedoTexture = true;
      pbrMaterial.albedoTexture = texture;
    } else {
      pbrMaterial.useAlbedoTexture = false;
    }
  });
  loadTexture(dobj.normal, texture => {
    if (texture) {
      pbrMaterial.useNormalTexture = true;
      pbrMaterial.normalTexture = texture;
    } else {
      pbrMaterial.useNormalTexture = false;
    }
  });
  loadTexture(dobj.metallic, texture => {
    if (texture) {
      pbrMaterial.useMetallicTexture = true;
      pbrMaterial.metallicTexture = texture;
    } else {
      pbrMaterial.useMetallicTexture = false;
    }
  });
  loadTexture(dobj.roughness, texture => {
    if (texture) {
      pbrMaterial.useRoughnessTexture = true;
      pbrMaterial.roughnessTexture = texture;
    } else {
      pbrMaterial.useRoughnessTexture = false;
    }
  });
  loadTexture(dobj.ao, texture => {
    if (texture) {
      pbrMaterial.useAoTexture = true;
      pbrMaterial.aoTexture = texture;
    } else {
      pbrMaterial.useAoTexture = false;
    }
  });

  // let Cerberus = {
  //   gltf: '../node_modules/assets-3d/textures/pbr/cerberus/a5c37fd97fce24fea81d95160e2f1caf.gltf',
  //   bin: '../node_modules/assets-3d/textures/pbr/cerberus/a5c37fd97fce24fea81d95160e2f1caf.bin'
  // }
  // app.assets.loadUrls('mesh', Cerberus, (err, mesh) =>{
  //   let ent = app.createEntity('model');
  //   quat.fromEuler(ent.lrot, 90, 0, 0);
  //   vec3.set(ent.lscale, 10, 10, 10);
  //   vec3.set(ent.lpos,8,8,0);
  //   let modelComp = ent.addComp('Model');
  //   modelComp.mesh = mesh;
  //   modelComp.material = cerberusMaterial;
  // });

})();