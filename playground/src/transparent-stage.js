(() => {
  const { app, cc, dgui } = window;
  const { vec3, color4, quat, randomRange } = cc.math;

  let dobj = {
    maxObj: 100,
  };
  dgui.add(dobj, 'maxObj', 0, 200).step(1).onChange(updateObjs);

  let ents = [];
  function updateObjs(val) {
    let len = ents.length;
    let delta = parseInt(val) - len;

    // models
    if (delta > 0) {
      for (let i = 0; i < delta; ++i) {
        let ent = app.createEntity(`node_${i}`);
        vec3.set(ent.lpos,
          randomRange(-50, 50),
          randomRange(-10, 10),
          randomRange(-50, 50)
        );
        quat.fromEuler(ent.lrot,
          randomRange(0, 360),
          randomRange(0, 360),
          randomRange(0, 360)
        );
        vec3.set(ent.lscale,
          randomRange(1, 5),
          randomRange(1, 5),
          randomRange(1, 5)
        );

        let modelComp = ent.addComp('Model');
        modelComp.mesh = meshBox;
        modelComp.material = material;

        ents.push(ent);
      }
    } else {
      for (let i = 0; i < -delta; ++i) {
        ents[len - i - 1].destroy();
      }
      ents.length = val;
    }
  }

  // create mesh
  let meshBox = cc.utils.createMesh(app, cc.primitives.box(1, 1, 1, {
    widthSegments: 1,
    heightSegments: 1,
    lengthSegments: 1,
  }));

  // create material
  let material = new cc.Material();
  material.effect = app.assets.get('builtin-unlit-transparent');
  material.define('USE_COLOR', true);
  material.define('USE_TEXTURE', true);
  material.setProperty('color', color4.new(1, 1, 1, 0.6));

  app.assets.loadUrls('texture', {
    image: './assets/textures/checker_uv.jpg'
  }, (err, texture) => {
    material.setProperty('mainTexture', texture);
  });

  // create camera
  let camEnt = app.createEntity('camera');
  vec3.set(camEnt.lpos, 10, 10, 10);
  camEnt.lookAt(vec3.new(0, 0, 0));
  camEnt.addComp('Camera');

  updateObjs(dobj.maxObj);
})();