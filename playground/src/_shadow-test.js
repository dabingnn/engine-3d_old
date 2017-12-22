(() => {
  const app = window.app;
  const cc = window.cc;

  const { vec3, color3, quat, randomRange } = cc.math;

  // create mesh
  let meshBox = cc.utils.createMesh(app, cc.primitives.box(1, 1, 1, {
    widthSegments: 1,
    heightSegments: 1,
    lengthSegments: 1,
  }));

  //let meshSphere = cc.utils.createMesh()

  // create material
  let material = new cc.Material();
  material.effect = app.assets.get('builtin-pbr');
  material.setProperty('roughness', 0.5);
  material.setProperty('metallic', 1);
  material.define('USE_SHADOW_MAP', true);

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, -10, 30, 0);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  for (let i = 0; i < 3; ++i) {
    let ent = app.createEntity(`node_${i}`);
    vec3.set(ent.lpos,
      -5 + 10 * i,//randomRange(-20, 20),
      5,//randomRange(0, 10),
      0//randomRange(0, 20)
    );
    quat.fromEuler(ent.lrot,
      30 * i,//randomRange(0, 360),
      30 * i,//randomRange(0, 360),
      30 * i//randomRange(0, 360)
    );
    vec3.set(ent.lscale,
      5,//randomRange(1, 5),
      5,//randomRange(1, 5),
      5//randomRange(1, 5)
    );
    let model = ent.addComp('Model');
    model.mesh = meshBox;
    model.material = material;
  }

  let plane = app.createEntity(`node_2`);
  vec3.set(plane.lpos, 0, -2, 0);
  vec3.set(plane.lscale, 100, 1, 100);
  let modelPlane = plane.addComp('Model');
  modelPlane.mesh = meshBox;
  modelPlane.material = material;

  let light1 = app.createEntity('light1');
  quat.fromEuler(light1.lrot, -90, 0, 0);
  vec3.set(light1.lpos, 1, 50, 0);

  let lightComp1 = light1.addComp('Light');
  //lightComp1.type = cc.renderer.LIGHT_SPOT;
  lightComp1.type = cc.renderer.LIGHT_DIRECTIONAL;
  lightComp1.color = color3.new(1, 1, 1);
  lightComp1.intensity = 2;
  lightComp1.range = 1000.0;
  lightComp1.shadowType = cc.renderer.SHADOW_SOFT;

})();