(() => {
  const app = window.app;
  const cc = window.cc;

  const { vec2, vec3, color3, quat, randomRange } = cc.math;

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  let start = vec3.create();
  let end = vec3.create();
  let color = color3.create();
  let rot = quat.create();
  let timer = 0.0;

  app.on('tick', () => {
    if (timer >= 0.05) {
      timer = 0.0;
      for (let i = 0; i < 10; ++i) {
        let gray = randomRange(0.5, 0.8);
        app.debugger.drawLine(
          vec3.scale(start, vec3.random(start), 1.0),
          vec3.scale(end, start, randomRange(2, 5)),
          color3.set(color, gray * 0.1, gray * 0.8, gray),
          randomRange(0.0, 4.0)
        );
      }
    }

    // draw line 2d
    for (let i = 0; i < 10; ++i) {
      app.debugger.drawLine2D(
        vec2.set(start, i * 10, 50),
        vec2.set(end, i * 10, 150),
        color3.set(color, 1.0, 0.0, 0.0)
      );
    }
    for (let i = 0; i < 10; ++i) {
      app.debugger.drawLine2D(
        vec2.set(start, 10, i * 10 + 50),
        vec2.set(end, 100, i * 10 + 50),
        color3.set(color, 0.0, 0.0, 1.0)
      );
    }

    // rect
    app.debugger.drawRect(
      10, 10, 30, 30,
      color3.set(color, 0.0, 1.0, 0.0)
    );

    app.debugger.drawAxes(
      vec3.set(start, 0, 0.01, 0),
      rot,
      0.2
    );

    let t = app.totalTime * 0.1;
    app.debugger.drawSphere(
      vec3.set(start, 10.0 * Math.sin(t), 0.01, 10.0 * Math.cos(t)),
      0.5,
      color3.set(color, 1.0, 1.0, 0.0)
    );

    app.debugger.drawSphere(
      vec3.set(start, 0.0, 0.0, 0.0),
      2.0,
      color3.set(color, 1.0, 1.0, 0.0)
    );

    timer += app.deltaTime;
  });
})();