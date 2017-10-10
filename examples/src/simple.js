(() => {
  const app = window.app;
  const cc = window.cc;

  const { vec3 } = cc.math;

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  app.on('tick', () => {
    // do something here...
  });
})();