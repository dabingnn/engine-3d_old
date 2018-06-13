(() => {
  const { cc, app } = window;
  const { vec3, color3, color4 } = cc.math;

  // manifest
  let manifest = {};
  manifest.materials = {
    num: 3,
    names: [
      "builtin-effect-phong", 
      "builtin-effect-phong-transparent", 
      "builtin-effect-phong-transparent",
    ],
    properties: [
      {}, 
      { "diffuseColor": color4.new(1, 1, 1, 0.3) },
      { "diffuseColor": color4.new(1, 1, 1, 0.1) },
    ]
  };
  manifest.lights = {
    num:2,
    names: [
      "point-light1",
      "point-light2",
    ],
    pos: [
      vec3.new(10, 10, 5),
      vec3.new(-10, 10, -5),
    ],
    color: [
      color3.new(1, 1, 1),
      color3.new(0.3, 0.3, 0.3),
    ],
  };
  manifest.geometries = {
    num: 6,
    names: [
      "sphere",
      "box",
      "capsule",
      "cylinder",
      "cone",
      "torus",
    ],
    meshes: [
      cc.primitives.sphere(),
      cc.primitives.box(),
      cc.primitives.capsule(),
      cc.primitives.cylinder(),
      cc.primitives.cone(),
      cc.primitives.torus(),
    ],
    pos: [
      vec3.new(0, 0, -1),
      vec3.new(-4, 0, -1),
      vec3.new(-2, 3, 1),
      vec3.new(-2, 0, 4),
      vec3.new(-2, 1, 1),
      vec3.new(-4, -1, 2),
    ],
  };

  // materials
  let materials = [];
  for (let i = 0; i < manifest.materials.num; i++) {
    let m = new cc.Material();
    m.effect = app.assets.get(manifest.materials.names[i]);
    for (let key in manifest.materials.properties[i])
      m.setProperty(key, manifest.materials.properties[i][key]);
    materials.push(m);
  }

  // lights
  let lights = [];
  for (let i = 0; i < manifest.lights.num; i++) {
    let e = app.createEntity(manifest.lights.names[i]);
    e.lpos = manifest.lights.pos[i];
    let l = e.addComp('Light');
    l.type = 'point';
    l.color = manifest.lights.color[i];
    l.intensity = 1.0;
    l.range = 1000.0;
    lights.push(e);
  }

  // geometries
  let geometries = [];
  for (let i = 0; i < manifest.geometries.num; i++) {
    let e = app.createEntity(manifest.geometries.names[i]);
    let g = e.addComp('Model');
    g.mesh = cc.utils.createMesh(app, manifest.geometries.meshes[i]);
    g.material = materials[1]; e.lpos = manifest.geometries.pos[i];
    g.material_bak = g.material;
    geometries.push(e);
  }

  // camera
  let camera = app.createEntity('camera');
  vec3.set(camera.lpos, -3, 2, 7);
  camera.addComp('Camera');

  class RaycastTest extends cc.ScriptComponent {
    constructor() {
      super();
      this.pos = vec3.create();
      this.hitInfo = {};
      this.input = app._input;
      this.canvas = app._device._gl.canvas;
      this.camera = camera.getComp('Camera')._camera;
      this.idRight = vec3.new(1, 0, 0);
      this.idUp = vec3.new(0, 1, 0);
      this.idForward = vec3.new(0, 0, -1);
      this.right = vec3.create();
      this.up = vec3.create();
      this.forward = vec3.create();
      this.center = vec3.new(-3, 0, 0);
    }

    tick() {
      // move camera
      vec3.transformQuat(this.right, this.idRight, camera.lrot);
      vec3.transformQuat(this.forward, this.idForward, camera.lrot);
      if (vec3.sqrDist(camera.lpos, this.center) > 9)
      if (this.input.keypress('w')) vec3.add(camera.lpos, camera.lpos, vec3.scale(this.forward, this.forward, 0.1));
      if (this.input.keypress('s')) vec3.sub(camera.lpos, camera.lpos, vec3.scale(this.forward, this.forward, 0.1));
      if (this.input.keypress('d')) vec3.add(camera.lpos, camera.lpos, vec3.scale(this.right, this.right, 0.1));
      if (this.input.keypress('a')) vec3.sub(camera.lpos, camera.lpos, vec3.scale(this.right, this.right, 0.1));
      if (this.input.keypress('e')) vec3.add(camera.lpos, camera.lpos, vec3.scale(this.up, this.idUp, 0.1));
      if (this.input.keypress('q')) vec3.sub(camera.lpos, camera.lpos, vec3.scale(this.up, this.idUp, 0.1));
      if (!this.input.keypress('Shift')) vec3.sub(camera.lpos, camera.lpos, vec3.scale(this.right, this.right, 0.02));
      camera.lookAt(this.center);

      // reset materials
      for (let i = 0; i < geometries.length; i++) {
        let model = geometries[i].getComp('Model');
        model.material = model.material_bak;
      }

      // get mouse pos if pressed
      if (!this.input.mousepress('left')) return;
      vec3.set(this.pos, this.input.mouseX, this.input.mouseY, 1);

      // raycasting
      let ray = this.camera.screenPointToRay(this.pos, this.canvas.width, this.canvas.height);
      if (app.Raycast(this.hitInfo, ray)) {
        this.hitInfo.entity.getComp('Model').material = materials[0];
      }
    }
  }
  app.registerClass('RaycastTest', RaycastTest);
  camera.addComp('RaycastTest');

})();
