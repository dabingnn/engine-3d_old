(() => {
  const { app, cc, dgui } = window;
  const { vec3, quat } = cc.math;

  let dobj = {
    play: true,
    pause: false,
    stop: false,
    emitShape: 'circle',
    gravity: 0.0,
    loop: true,
    prewarm: false,
    duration: 10,
    rateOverTime: 100,
    rateOverDistance: 0,
    startDelay: 1,
    startSpeedMin: 2,
    startSpeedMax: 8,
    startSizeMin: 0.5,
    startSizeMax: 2.5,
    startLifetime: 8,
    startRotation: 0,
    billboard: 'camera',
    simulationSpace: 'local',
    simulationSpeed: 1
  };
  dgui.remember(dobj);
  dgui.add(dobj, 'emitShape').onFinishChange(() => {
    psys.shapeType = dobj.emitShape;
  });
  dgui.add(dobj, 'play').onFinishChange(() => {
    if (dobj.play === true) {
      psys.play();
    }
  });
  dgui.add(dobj, 'pause').onFinishChange(() => {
    if (dobj.pause === true) {
      psys.pause();
    } else if (psys.isPaused) {
      psys.play();
    }
  });
  dgui.add(dobj, 'stop').onFinishChange(() => {
    if (dobj.stop === true) {
      psys.stop();
    }
  });
  dgui.add(dobj, 'gravity').onFinishChange(() => {
    psys.gravityModifier = dobj.gravity;
  });
  dgui.add(dobj, 'loop').onFinishChange(() => {
    psys.loop = dobj.loop;
  });
  dgui.add(dobj, 'prewarm').onFinishChange(() => {
    if (dobj.prewarm === true) {
      psys.prewarm = true;
    } else {
      psys.prewarm = false;
    }
  });
  dgui.add(dobj, 'duration').onFinishChange(() => {
    psys.duration = dobj.duration;
  });
  dgui.add(dobj, 'rateOverTime').onFinishChange(() => {
    psys.rateOverTime = dobj.rateOverTime;
  });
  dgui.add(dobj, 'rateOverDistance').onFinishChange(() => {
    psys.rateOverDistance = dobj.rateOverDistance;
  });
  dgui.add(dobj, 'startDelay').onFinishChange(() => {
    psys.startDelay = dobj.startDelay;
  });
  dgui.add(dobj, 'startSpeedMin').onFinishChange(() => {
    psys.startSpeedMin = dobj.startSpeedMin;
  });
  dgui.add(dobj, 'startSpeedMax').onFinishChange(() => {
    psys.startSpeedMax = dobj.startSpeedMax;
  });
  dgui.add(dobj, 'startSizeMin').onFinishChange(() => {
    psys.startSizeMin = dobj.startSizeMin;
  });
  dgui.add(dobj, 'startSizeMax').onFinishChange(() => {
    psys.startSizeMax = dobj.startSizeMax;
  });
  dgui.add(dobj, 'startLifetime').onFinishChange(() => {
    psys.startLifetime = dobj.startLifetime;
  });
  dgui.add(dobj, 'startRotation').onFinishChange(() => {
    psys.startRotation = dobj.startRotation;
  });
  dgui.add(dobj, 'billboard').onFinishChange(() => {
    if (dobj.billboard === 'camera') {
      psys.renderMode = 'billboard';
    } else if (dobj.billboard === 'horizontal') {
      psys.renderMode = 'horizontalBillboard';
    } else if (dobj.billboard === 'vertical') {
      psys.renderMode = 'verticalBillboard';
    } else if (dobj.billboard === 'stretch') {
      psys.renderMode = 'stretchedBillboard';
    }
  });
  dgui.add(dobj, 'simulationSpace').onFinishChange(() => {
    psys.simulationSpace = dobj.simulationSpace;
  });
  dgui.add(dobj, 'simulationSpeed').onFinishChange(() => {
    psys.simulationSpeed = dobj.simulationSpeed;
  });

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 0, 10, 80);
  camEnt.lookAt(vec3.new(0, 10, 0));
  camEnt.addComp('Camera');

  let particleMaterial = new cc.Material();
  particleMaterial.effect = app.assets.get('builtin-effect-particle-add');
  const texUrls = {
    image: './assets/textures/particle.png',
  };
  app.assets.loadUrls('texture', texUrls, (err, mainTexture) => {
    particleMaterial.setProperty('mainTexture', mainTexture);
  });

  let ent = app.createEntity('particle-node');
  let psys = ent.addComp('ParticleSystem', {capacity: 10000});

  // let burst = app.createObject('Burst');
  // burst.particleSystem = psys;
  // burst.time = 1.0;
  // burst.repeatCount = 3;
  // burst.repeatInterval = 3.0;
  // psys.addBurst(burst);

  vec3.set(ent.lpos, 0, 0, 0);
  psys.material = particleMaterial;
  psys.loop = true;
  psys.duration = 10;
  psys.rateOverTime = 100;
  psys.startLifetime = 8;
  psys.startColorType = 'randomColor';
  psys.startSpeedType = 'randomBetweenTwoConstants';
  psys.startSpeedMin = 2;
  psys.startSpeedMax = 8;
  psys.startSizeType = 'randomBetweenTwoConstants';
  psys.startSizeMin = 0.5;
  psys.startSizeMax = 2.5;
  psys.startDelay = 1;
  psys.simulationSpeed = 1;
  psys.gravityModifier = 0;
  psys.shapeType = 'circle';
  psys.radius = 10.0;
  psys.boxSize = vec3.new(10.0, 10.0, 10.0);
  psys.play();

  app.on('tick', () => {
    // do something here...
    // quat.rotateY(ent.lrot, ent.lrot, app.deltaTime);
    // vec3.set(ent.lpos, ent.lpos.x + app.deltaTime * 2.0, ent.lpos.y, ent.lpos.z);
  });
})();