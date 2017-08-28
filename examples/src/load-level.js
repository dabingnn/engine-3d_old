(() => {
  const app = window.app;
  const cc = window.cc;

  const {resl, path} = cc;

  resl({
    manifest: {
      assetInfos: {
        type: 'text',
        parser: JSON.parse,
        src: './test-assets/levels/assets.json'
      },

      scene: {
        type: 'text',
        parser: JSON.parse,
        src: './test-assets/levels/test-01.json'
      },
    },

    onDone (data) {
      const sceneJson = data.scene;
      const assetInfos = data.assetInfos;
      const baseUrl = './test-assets/levels/';

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