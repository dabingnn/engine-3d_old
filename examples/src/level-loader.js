(() => {
  const app = window.app;
  const cc = window.cc;

  const resl = cc.resl;

  resl({
    manifest: {
      scene: {
        type: 'text',
        parser: JSON.parse,
        src: './test-assets/level-01/test-01.json'
      },
    },
    onDone (assets) {
      let sceneJson = assets.scene;

      cc.utils.parseLevel(
        app,
        sceneJson,
        './test-assets/level-01/',
        (err, level) => {
          app.loadLevel(level);
        }
      );
    }
  });
})();