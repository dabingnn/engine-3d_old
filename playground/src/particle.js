
(() => {
  const { app, cc, dgui } = window;
  const { vec3, vec2, quat } = cc.math;

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 10, 0));
  camEnt.addComp('Camera');

  let particleMaterial = new cc.Material();
  particleMaterial.effect = app.assets.get('builtin-effect-particle-premultiply-blend');
  // particleMaterial.define('USE_BILLBOARD', true);
  const texUrls = {
    image: './assets/textures/particle.png',
  };
  app.assets.loadUrls('texture', texUrls, (err, mainTexture) => {
    particleMaterial.setProperty('mainTexture', mainTexture);
  });

  let ent = app.createEntity('particle-node');
  let psys = ent.addComp('ParticleSystem');
  vec3.set(ent.lpos, 0, 10, 0);
  psys.material = particleMaterial;
  psys.loop = true;
  psys.duration = 4;
  psys.rateOverTime = 55;
  psys.startLifetime = 10;
  psys.startDelay = 1;
  psys.simulationSpeed = 1;
  //psys.gravityModifier = 9;
  psys._shape.boxX = 10;
  psys._shape.boxY = 10;
  psys._shape.boxZ = 10;
  psys.play();


  app.on('tick', () => {
    // do something here...
  });
})();