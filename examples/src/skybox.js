(() => {
  const app = window.app;

  const urls = {
    json: './skybox/skybox.json',
    imagePosX: './skybox/skybox_px.jpg',
    imageNegX: './skybox/skybox_nx.jpg',
    imagePosY: './skybox/skybox_py.jpg',
    imageNegY: './skybox/skybox_ny.jpg',
    imagePosZ: './skybox/skybox_pz.jpg',
    imageNegZ: './skybox/skybox_nz.jpg',
  };

  let ent = app.createEntity(`node_${0}`);
  let skyCmp = ent.addComp('Skybox');
  app.assets.loadUrls('texture-cube', urls, (err, cubeMap) => {
    skyCmp.cubeMap = cubeMap;
  });

})();