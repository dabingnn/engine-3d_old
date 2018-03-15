
(() => {
  const { app, cc, dgui } = window;
  const { vec3, quat, toRadian } = cc.math;

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 0, 10, 100);
  camEnt.lookAt(vec3.new(0, 10, 0));
  camEnt.addComp('Camera');

  let particleMaterial = new cc.Material();
  particleMaterial.effect = app.assets.get('builtin-effect-particle-add');
  particleMaterial.define('USE_BILLBOARD', true);
  const texUrls = {
    image: './assets/textures/particle.png',
  };
  app.assets.loadUrls('texture', texUrls, (err, mainTexture) => {
    particleMaterial.setProperty('mainTexture', mainTexture);
  });

  let ent = app.createEntity('particle-node');
  let psys = ent.addComp('ParticleSystem');
  vec3.set(ent.lpos, 0, 10, 0);
  // quat.rotateX(ent.lrot, ent.lrot, toRadian(90));
  psys.material = particleMaterial;
  psys.loop = true;
  psys.duration = 4;
  psys.rateOverTime = 300;
  psys.startSpeed = 10;
  psys.startLifetimeConst = 10;
  psys.startColorType = 'randomColor';
  psys.startSpeedType = 'randomBetweenTwoConstants';
  psys.startSpeedConstMin = 2;
  psys.startSpeedConstMax = 12;
  psys.startSizeType = 'randomBetweenTwoConstants';
  psys.startSizeConstMin = 0.5;
  psys.startSizeConstMax = 2.5;
  psys.startDelay = 1;
  psys.simulationSpeed = 1;
  psys.gravityModifier = 2;
  psys._shape.boxX = 10;
  psys._shape.boxY = 10;
  psys._shape.boxZ = 10;
  psys._shape.emitFrom = 'edge';
  psys.play();

  app.on('tick', () => {
    // do something here...
    // quat.rotateY(ent.lrot, ent.lrot, app.deltaTime);
  });
})();