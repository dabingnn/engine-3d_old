(() => {
  const app = window.app;
  const cc = window.cc;

  const { vec3 } = cc.math;

  let skyboxSrc = '../node_modules/assets-3d/textures';
  const urls = {
    json: `${skyboxSrc}/skybox/skybox.json`,
    imagePosX: `${skyboxSrc}/skybox/skybox_px.jpg`,
    imageNegX: `${skyboxSrc}/skybox/skybox_nx.jpg`,
    imagePosY: `${skyboxSrc}/skybox/skybox_py.jpg`,
    imageNegY: `${skyboxSrc}/skybox/skybox_ny.jpg`,
    imagePosZ: `${skyboxSrc}/skybox/skybox_pz.jpg`,
    imageNegZ: `${skyboxSrc}/skybox/skybox_nz.jpg`,
  };

  app.assets.loadUrls('texture-cube', urls, (err, cubeMap) => {
    let camEnt = app.createEntity('camera');
    vec3.set(camEnt.lpos, 10, 10, 10);
    camEnt.lookAt(vec3.new(0, 0, 0));
    camEnt.addComp('Camera');

    let ent = app.createEntity(`node_${0}`);
    let skyCmp = ent.addComp('Skybox');
    skyCmp.cubeMap = cubeMap;
  });

})();