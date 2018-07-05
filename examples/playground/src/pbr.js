(() => {
  const { cc, app, dgui } = window;
  const { resl, Texture2D, Material } = cc;
  const { vec3, color3, color4, clamp } = cc.math;
  const { sphere } = cc.primitives;

  // configs
  let dobj = {
    useIBL: true,
    useTexLod: true,
    maxRefLod: 9,
    envURL: '../assets/pbr/ibl/home',
    albedo: '',
    normal: '',
    ao: '',
    metallic: '',
    roughness: '',
  };

  // lights
  let lightPos = [
    vec3.new( 10,  10, 10),
    vec3.new(-10,  10, 10),
    vec3.new( 10, -10, 10),
    vec3.new(-10, -10, 10),
  ];
  for (let i = 0; i < 4; i++) {
    let lightEnt = app.createEntity('point-light');
    vec3.set(lightEnt.lpos, lightPos[i].x, lightPos[i].y, lightPos[i].z);
    let light = lightEnt.addComp('Light');
    light.type = 'point';
    light.color = color3.new(1, 1, 1);
    light.intensity = 2;
    light.range = 1000;
  }
  
  // geometries
  let rows = 7, cols = 7, spacing = 2.5;
  let entities = [];
  let meshSphere = cc.utils.createMesh(app, sphere(1, {
    segments: 64,
  }));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let m = new Material();
      m.effect = app.assets.get('builtin-effect-pbr');
      m.setProperty('ao', 1.0);
      m.setProperty('albedo', color4.new(0.707, 0, 0, 1));
      m.setProperty('metallic', i/rows);
      m.setProperty('roughness', clamp(j/cols, 0.05, 1));

      let ent = app.createEntity('sphere'+i);
      let modelComp = ent.addComp('Model');
      modelComp.mesh = meshSphere;
      modelComp.material = m;
      vec3.set(ent.lpos, (j-cols/2)*spacing, (i-rows/2)*spacing, -2);
      entities.push(ent);
    }
  }

  // camera
  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, -15, 10, 12);
  camEnt.lookAt(vec3.new(0, 0, 0));
  let camComp = camEnt.addComp('Camera');
  camComp.clearFlags |= cc.renderer.CLEAR_SKYBOX;

  // util functions
  let setProperty = function(name, prop) {
    for (let i = 0; i < rows*cols; i++)
      entities[i].getComp('Model').material.setProperty(name, prop);
  };
  let define = function(name, def) {
    for (let i = 0; i < rows*cols; i++)
      entities[i].getComp('Model').material.define(name, def);
  };
  let loadTexture = (function() {
    let cb = function(texture, prop) {
      if (texture) {
        define('USE_'+prop.toUpperCase(), true);
        setProperty(prop, texture);
      } else {
        define('USE_'+prop.toUpperCase(), false);
      }
    };
    return function (url, prop) {
      if (!url) {
        cb(null, prop);
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

          cb(texture, prop);
        }
      });
    };
  })();
  let activateSkyBox = function(model) {
    if (model) {
      camComp.clearFlags |= cc.renderer.CLEAR_SKYBOX;
    } else {
      camComp.clearFlags &= ~cc.renderer.CLEAR_SKYBOX;
    }
    app._debugger._camera._clearFlags = camComp.clearFlags;
    app._debugger._camera._clearModel = model;
  };
  let loadIBL = function(useIBL) {
    define("USE_IBL", dobj.useIBL);
    if (!useIBL) {
      activateSkyBox(null);
      return;
    }

    // load environment box.
    let envSrc = `${dobj.envURL}/environment`;
    // front, back, top, bottom, right, left
    const envUrls = {
      json: `${envSrc}/environment.json`,
      imagePosX: `${envSrc}/environment_0.jpg`,
      imageNegX: `${envSrc}/environment_1.jpg`,
      imagePosY: `${envSrc}/environment_2.jpg`,
      imageNegY: `${envSrc}/environment_3.jpg`,
      imagePosZ: `${envSrc}/environment_4.jpg`,
      imageNegZ: `${envSrc}/environment_5.jpg`,
    };
    app.assets.loadUrls('texture', envUrls, (err, cubeMap) => {
      let skyboxComp = camEnt.getComp('Skybox');
      if (!skyboxComp) {
        skyboxComp = camEnt.addComp('Skybox');
        let skyboxMaterial = new Material();
        skyboxMaterial.effect = app.assets.get('builtin-effect-skybox');
        skyboxComp.material = skyboxMaterial;
      }
      skyboxComp.material.setProperty('cubeMap', cubeMap);
      activateSkyBox(skyboxComp._model);
      setProperty('specularEnvTexture', cubeMap);
    });

    // load indirect lighting resource
    let diffuseSrc = `${dobj.envURL}/diffuse`;
    const difUrls = {
      json: `${diffuseSrc}/diffuse.json`,
      imagePosX: `${diffuseSrc}/diffuse_0.jpg`,
      imageNegX: `${diffuseSrc}/diffuse_1.jpg`,
      imagePosY: `${diffuseSrc}/diffuse_2.jpg`,
      imageNegY: `${diffuseSrc}/diffuse_3.jpg`,
      imagePosZ: `${diffuseSrc}/diffuse_4.jpg`,
      imageNegZ: `${diffuseSrc}/diffuse_5.jpg`,
    };
    app.assets.loadUrls('texture', difUrls, (err, cubeMap) => {
      setProperty('diffuseEnvTexture', cubeMap);
    });
  };

  // immediate init
  const lutUrls = {
    json: '../assets/pbr/brdfLUT.json',
    image: '../assets/pbr/brdfLUT.png',
  };
  app.assets.loadUrls('texture', lutUrls, (err, lutMap) => {
    setProperty('brdfLUT', lutMap);
  });
  loadIBL(dobj.useIBL);
  define("USE_TEX_LOD", dobj.useTexLod);
  setProperty("maxReflectionLod", dobj.maxRefLod);
  loadTexture(dobj.albedo, 'albedo_texture');
  loadTexture(dobj.normal, 'normal_texture');
  loadTexture(dobj.metallic, 'metallic_texture');
  loadTexture(dobj.roughness, 'roughness_texture');
  loadTexture(dobj.ao, 'ao_texture');

  // dat.GUI controllers
  dgui.remember(dobj);
  dgui.add(dobj, 'useIBL').onFinishChange(() => {
    loadIBL(dobj.useIBL);
  });
  dgui.add(dobj, 'useTexLod').onFinishChange(() => {
    define("USE_TEX_LOD", dobj.useTexLod);
  });
  dgui.add(dobj, 'maxRefLod').onFinishChange(() => {
    setProperty("maxReflectionLod", dobj.maxRefLod);
  });
  dgui.add(dobj, 'envURL').onFinishChange(() => {
    loadIBL(dobj.useIBL);
  });
  dgui.add(dobj, 'albedo').onFinishChange(() => {
    loadTexture(dobj.albedo, 'albedo_texture');
  });
  dgui.add(dobj, 'normal').onFinishChange(() => {
    loadTexture(dobj.normal, 'normal_texture');
  });
  dgui.add(dobj, 'metallic').onFinishChange(() => {
    loadTexture(dobj.metallic, 'metallic_texture');
  });
  dgui.add(dobj, 'roughness').onFinishChange(() => {
    loadTexture(dobj.roughness, 'roughness_texture');
  });
  dgui.add(dobj, 'ao').onFinishChange(() => {
    loadTexture(dobj.ao, 'ao_texture');
  });

})();