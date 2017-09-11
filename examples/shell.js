'use strict';

(() => {
  const { App, Orbit, Node } = window.cc;
  const { vec3 } = window.cc.math;
  const { Camera } = window.cc.renderer;
  const { createGrid } = window.cc.utils;

  // create global camera
  let nodeCam = new Node('nodeCam');
  vec3.set(nodeCam.lpos, 10, 10, 10);
  nodeCam.lookAt(vec3.new(0, 0, 0));
  let orbit = new Orbit(nodeCam, null);

  function _loadPromise(url) {
    return new Promise((resolve, reject) => {
      let xhr = new window.XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onreadystatechange = onreadystatechange;
      xhr.send(null);

      function onreadystatechange(e) {
        if (xhr.readyState !== 4) {
          return;
        }

        // Testing harness file:/// results in 0.
        if ([0, 200, 304].indexOf(xhr.status) === -1) {
          reject(`While loading from url ${url} server responded with a status of ${xhr.status}`);
        } else {
          resolve(e.target.response);
        }
      }
    });
  }

  function _load(view, url) {
    if (window.reqID) {
      window.cancelAnimationFrame(window.reqID);
    }

    _loadPromise(url).then(result => {
      // destroy old instances
      if (view.firstElementChild) {
        view.firstElementChild.remove();
      }

      if (window.app) {
        window.app.destroy();
        window.app = null;
      }

      // create new canvas
      let canvas = document.createElement('canvas');
      canvas.classList.add('fit');
      canvas.tabIndex = -1;
      view.appendChild(canvas);

      // init app
      let app = new App(canvas);
      app.resize();
      app.on('tick', () => {
        window.stats.tick();
        orbit.tick(app.deltaTime);
      });
      window.app = app;

      // init example modules
      eval(`${result}\n//# sourceURL=${url}`);

      orbit._input = app._input;

      // add debug camera
      let camera = new Camera();
      camera.setNode(orbit._node);
      app.scene.addCamera(camera);

      // add grid
      let grid = createGrid(app.device, new Node('grid'), 100, 100, 100 );
      app.scene.addModel(grid);

      //
      app.run();

    }).catch(err => {
      console.error(err);
    });
  }

  document.addEventListener('readystatechange', () => {
    if (document.readyState !== 'complete') {
      return;
    }

    // let spector = new window.SPECTOR.Spector();
    // spector.displayUI();

    let view = document.getElementById('view');
    let showFPS = document.getElementById('showFPS');
    let exampleList = document.getElementById('exampleList');

    // update profile
    showFPS.checked = localStorage.getItem('gfx.showFPS') === 'true';
    let exampleIndex = parseInt(localStorage.getItem('gfx.exampleIndex'));
    if (isNaN(exampleIndex)) {
      exampleIndex = 0;
    }
    exampleList.selectedIndex = exampleIndex;

    // init
    let stats = new window.LStats(document.body);
    showFPS.checked ? stats.show() : stats.hide();

    window.stats = stats;
    _load(view, exampleList.value);

    showFPS.addEventListener('click', event => {
      localStorage.setItem('gfx.showFPS', event.target.checked);
      if (event.target.checked) {
        stats.show();
      } else {
        stats.hide();
      }
    });

    exampleList.addEventListener('change', event => {
      localStorage.setItem('gfx.exampleIndex', event.target.selectedIndex);
      _load(view, exampleList.value);
    });
  });
})();