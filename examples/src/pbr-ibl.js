(() => {
    const { vec2, vec3, color3, color4, quat, randomRange } = cc.math;
    const app = window.app;
    let envSrc = '../node_modules/assets-3d/textures/pbr/papermill/environment';
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
      // camera
      let camEnt = app.createEntity('camera');
      vec3.set(camEnt.lpos, 10, 10, 10);
      camEnt.lookAt(vec3.new(0, 0, 0));
      camEnt.addComp('Camera');
    });

    let diffuseSrc = '../node_modules/assets-3d/textures/pbr/papermill/diffuse';
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
        let ent = app.createEntity(`node_${0}`);
        let envCmp = ent.addComp('Skybox');
        envCmp.cubeMap = cubeMap;
        // camera
        let camEnt = app.createEntity('camera');
        vec3.set(camEnt.lpos, 10, 10, 10);
        camEnt.lookAt(vec3.new(0, 0, 0));
        camEnt.addComp('Camera');
    });

  })();