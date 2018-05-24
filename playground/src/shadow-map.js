(() => {
  const { cc, app, dgui } = window;
  const { color4, color3, vec3, quat } = cc.math;

  let dobj = {
    cube1Cast: true,
    cube1Receive: true,
    cube2Cast: true,
    sphere1Cast: true,
    planeReceive: true,
  };
  dgui.remember(dobj);
  dgui.add(dobj, 'cube1Cast').onFinishChange(() => {
    if (dobj.cube1Cast === true) {
      cube1Model.shadowCastingMode = 'on';
    } else {
      cube1Model.shadowCastingMode = 'off';
    }
  });
  dgui.add(dobj, 'cube1Receive').onFinishChange(() => {
    cube1Model.receiveShadows = dobj.cube1Receive;
  });
  dgui.add(dobj, 'cube2Cast').onFinishChange(() => {
    if (dobj.cube2Cast === true) {
      cube2Model.shadowCastingMode = 'on';
    } else {
      cube2Model.shadowCastingMode = 'off';
    }
  });
  dgui.add(dobj, 'sphere1Cast').onFinishChange(() => {
    if (dobj.sphere1Cast === true) {
      sphere1Model.shadowCastingMode = 'on';
    } else {
      sphere1Model.shadowCastingMode = 'off';
    }
  });
  dgui.add(dobj, 'planeReceive').onFinishChange(() => {
    planeModel.receiveShadows = dobj.planeReceive;
  });

  // create mesh
  let meshBox = cc.utils.createMesh(app, cc.primitives.box(1, 1, 1, {
    widthSegments: 1,
    heightSegments: 1,
    lengthSegments: 1,
  }));

  let meshSphere = cc.utils.createMesh(app, cc.primitives.sphere(3, { segments: 64 }));

  // create material
  let cube1Mat = new cc.Material();
  cube1Mat.effect = app.assets.get('builtin-effect-pbr');
  cube1Mat.setProperty('albedo', color4.new(1, 1, 0, 1));
  cube1Mat.setProperty('roughness', 0.5);
  cube1Mat.setProperty('metallic', 1);
  let cube2Mat = new cc.Material();
  cube2Mat.effect = app.assets.get('builtin-effect-pbr');
  cube2Mat.setProperty('albedo', color4.new(0, 1, 1, 1));
  cube2Mat.setProperty('roughness', 0.6);
  cube2Mat.setProperty('metallic', 0.8);
  let sphere1Mat = new cc.Material();
  sphere1Mat.effect = app.assets.get('builtin-effect-pbr');
  sphere1Mat.setProperty('albedo', color4.new(0, 0, 1, 1));
  sphere1Mat.setProperty('roughness', 0.7);
  sphere1Mat.setProperty('metallic', 1);
  let planeMat = new cc.Material();
  planeMat.effect = app.assets.get('builtin-effect-pbr');
  planeMat.setProperty('roughness', 0.5);
  planeMat.setProperty('metallic', 1);

  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  let cube1 = app.createEntity('cube1');
  vec3.set(cube1.lpos, -5, 5, 0);
  vec3.set(cube1.lscale, 5, 5, 5);
  let cube1Model = cube1.addComp('Model');
  cube1Model.mesh = meshBox;
  cube1Model.material = cube1Mat;
  cube1Model.shadowCastingMode = 'on';
  cube1Model.receiveShadows = true;

  let cube2 = app.createEntity('cube2');
  vec3.set(cube2.lpos, -6, 12, 0);
  quat.fromEuler(cube2.lrot, 30, 30, 30);
  vec3.set(cube2.lscale, 5, 5, 5);
  let cube2Model = cube2.addComp('Model');
  cube2Model.mesh = meshBox;
  cube2Model.material = cube2Mat;
  cube2Model.shadowCastingMode = 'on';

  let sphere1 = app.createEntity('sphere1');
  vec3.set(sphere1.lpos, 5, 5, 0);
  // vec3.set(sphere1.lscale, 5, 5, 5);
  let sphere1Model = sphere1.addComp('Model');
  sphere1Model.mesh = meshSphere;
  sphere1Model.material = sphere1Mat;
  sphere1Model.shadowCastingMode = 'on';

  let plane = app.createEntity('plane');
  vec3.set(plane.lpos, 0, -2, 0);
  vec3.set(plane.lscale, 100, 1, 100);
  let planeModel = plane.addComp('Model');
  planeModel.mesh = meshBox;
  planeModel.material = planeMat;
  planeModel.receiveShadows = true;

  let light1 = app.createEntity('light1');
  quat.fromEuler(light1.lrot, -90, 0, 0);
  vec3.set(light1.lpos, 1, 50, 0);

  let lightComp1 = light1.addComp('Light');
  //lightComp1.type = cc.renderer.LIGHT_SPOT;
  lightComp1.type = 'directional';
  lightComp1.color = color3.new(1, 1, 1);
  lightComp1.intensity = 2;
  lightComp1.range = 1000.0;
  lightComp1.shadowType = 'hard';

  app.on('tick', () => {
    quat.rotateY(cube2.lrot, cube2.lrot, app.deltaTime);
  });

})();