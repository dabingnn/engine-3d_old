(() => {
  const app = window.app;

  const urls = {
    json: './skybox/skybox.json',
    image_posX: './skybox/skybox_px.jpg',
    image_negX: './skybox/skybox_nx.jpg',
    image_posY: './skybox/skybox_py.jpg',
    image_negY: './skybox/skybox_ny.jpg',
    image_posZ: './skybox/skybox_pz.jpg',
    image_negZ: './skybox/skybox_nz.jpg',
  };

  let ent = app.createEntity(`node_${0}`);
  let skyCmp = ent.addComp('Skybox');
  app.assets.loadUrls('texture-cube', urls, (err, cubeMap) => {
    skyCmp.cubeMap = cubeMap;
  });

})();