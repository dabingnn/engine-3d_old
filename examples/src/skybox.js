(() => {
  const app = window.app;
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

  let ent = app.createEntity(`node_${0}`);
  let skyCmp = ent.addComp('Skybox');
  app.assets.loadUrls('texture-cube', urls, (err, cubeMap) => {
    skyCmp.cubeMap = cubeMap;
  });

})();