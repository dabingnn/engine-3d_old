(() => {
  const app = window.app;
  const cc = window.cc;

  const {resl, path} = cc;
  // const baseUrl = './test-assets/levels_03';
  const baseUrl = '/Users/johnny/gamedev-js/u3d-exporter/out';

  resl({
    manifest: {
      assetInfos: {
        type: 'text',
        parser: JSON.parse,
        src: `${baseUrl}/assets.json`
      },

      scene: {
        type: 'text',
        parser: JSON.parse,
        src: `${baseUrl}/scene.json`
      },
    },

    onDone (data) {
      const sceneJson = data.scene;
      const assetInfos = data.assetInfos;

      for ( let uuid in assetInfos) {
        let info = assetInfos[uuid];
        for (let item in info.urls) {
          info.urls[item] = path.join(baseUrl, info.urls[item]);
        }

        app.assets.registerAsset(uuid, info);
      }

      cc.utils.parseLevel(
        app,
        sceneJson,
        (err, level) => {
          app.loadLevel(level);
        }
      );
    }
  });
})();