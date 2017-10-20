(() => {
  const { app, cc, dgui } = window;
  const { vec3 } = cc.math;

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  let camComp = camEnt.addComp('Camera');

  let dobj = {
    background: [0, 128, 255]
  };

  dgui.addColor(dobj, 'background').onChange(val => {
    camComp._camera.setColor(
      val[0]/255.0,
      val[1]/255.0,
      val[2]/255.0,
      1.0
    );
  });

  app.on('tick', () => {
    // do something here...
  });
})();