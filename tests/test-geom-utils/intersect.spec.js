const tap = require('./tap');
const { math, renderer } = require('../../dist/engine');
const { vec3, mat3, mat4, quat } = math;
const { intersect, ray, line, triangle, sphere, box } = require('./dist/geom-utils');

tap.test('intersect', t => {

  t.test('ray_triangle', t => {
    let r1 = ray.new(
      0, 0.5, 1,
      0, 0.0, -1
    );
    let t1 = triangle.new(
      0,    1, 0,
     -0.5, -1, 0,
      0.5, -1, 0
    );
    let out = vec3.create();
    let intersects = intersect.ray_triangle(r1, t1, out);

    t.assert(intersects);
    t.equal_v3(out, [0, 0.5, 0]);

    t.end();
  });

  t.test('line_triangle', t => {
    let l1 = line.new(
      0, 0.5, 1,
      0, 0.5, -1
    );
    let l2 = line.new(
      0, 0.2, 1,
      0, -0.2, -1
    );
    let t1 = triangle.new(
      0,    1, 0,
     -0.5, -1, 0,
      0.5, -1, 0
    );
    let out = vec3.create();
    let intersects = intersect.line_triangle(l1, t1, out);

    t.assert(intersects);
    t.equal_v3(out, [0, 0.5, 0]);

    intersects = intersect.line_triangle(l2, t1, out);
    t.assert(intersects);
    t.equal_v3(out, [0, 0.0, 0]);

    t.end();
  });

  t.test('line_quad', t => {
    let out = vec3.create();
    let intersects = intersect.line_quad(
      vec3.new(0, 0.5, 1),
      vec3.new(0, 0.5, -1),
      vec3.new(-0.5, 1, 0),
      vec3.new(-0.5, -1, 0),
      vec3.new(0.5, -1, 0),
      vec3.new(0.5, 1, 0),
      out
    );

    t.assert(intersects);
    t.equal_v3(out, [0, 0.5, 0]);

    t.end();
  });

  t.test('ray_sphere', t => {
    let r1 = ray.new(
      0, 0, 0,
      1, 1, 1
    );
    let s1 = sphere.new(2, 2, 2, 1);
    let out = vec3.create();
    let intersects = intersect.ray_sphere(r1, s1, out);

    t.assert(intersects);
    t.equal_v3(out, [2 - Math.sqrt(3) / 3, 2 - Math.sqrt(3) / 3, 2 - Math.sqrt(3) / 3]);

    t.end();
  });

  t.test('ray_box', t => {
    let r1 = ray.new(
      0, 0, 0,
      1, 0, 0
    );
    let axis_x = vec3.create();
    let axis_y = vec3.create();
    let axis_z = vec3.create();
    vec3.set(axis_x, 1, 0, 0);
    vec3.set(axis_y, 0, 1, 0);
    vec3.set(axis_z, 0, 0, 1);

    let box_center = vec3.create();
    vec3.set(box_center, 2, 1, 0);

    let ori_x = vec3.create();
    let ori_y = vec3.create();
    let ori_z = vec3.create();
    let ori_center = vec3.create();
    let angle = (-45) * Math.PI / 180;
    let ori_rot = vec3.create();
    vec3.rotateZ(ori_x, axis_x, ori_rot, angle);
    vec3.rotateZ(ori_y, axis_y, ori_rot, angle);
    vec3.rotateZ(ori_z, axis_z, ori_rot, angle);
    vec3.rotateZ(ori_center, box_center, ori_rot, angle);

    let b1 = box.new(
      ori_center.x, ori_center.y, ori_center.z,
      1, 1, 1,
      ori_x.x, ori_x.y, ori_x.z,
      ori_y.x, ori_y.y, ori_y.z,
      ori_z.x, ori_z.y, ori_z.z
    );
    let out = vec3.create();
    let intersects = intersect.ray_box(r1, b1, out);

    t.assert(intersects);
    t.equal_v3(out, [Math.sqrt(2), 0, 0]);

    t.end();
  });

  t.test('sphere_frustum', t => {
    let eye = vec3.new(4, 5, 6);
    let at = vec3.create();
    let up = vec3.new(0, 1, 0);
    let v = new renderer.View();
    mat4.perspective(v._matProj, Math.PI/2, 16/9, 0.01, 1000);
    let center = vec3.new(1, 2, 3);
    let s = sphere.new(center.x, center.y, center.z, 1);
    let intersects = false;

    // let transformed = vec3.create();
    // let inFrustum = function(v) {
    //   return v.x > -1 && v.x < 1 && v.y > -1 && v.y < 1 && v.z > -1 && v.z < 1;
    // };

    let update = function(x, y, z) {
      vec3.set(at, x, y, z); 
      mat4.lookAt(v._matView, eye, at, up);
      mat4.mul(v._matViewProj, v._matProj, v._matView);
      v.updateFrustumPlanes();
      intersects = intersect.sphere_frustum(s, v._frustumPlanes);
      
      /**
       * an rough comparison test (compare the result with manual clipping space test)
       * it's just an approximation since only the sphere center is concerned,
       * use this only when doing quick-and-dirty try-outs
       */
      // vec3.transformMat4(transformed, center, v._matViewProj);
      // t.assert(inFrustum(transformed) == intersects);
    };

    // hand-tuned unit-tests. 3 steps to reproduce in playground/pbr.js:
    // modify `app._device._gl.canvas` width:height to be 16:9
    // change the sphere to be located at `center` with radius 1
    // place the camera to `eye` and look at following parameters passed into each `update`
    update(1, 2, 3);    t.assert( intersects); // (T) facing towards the sphere
    update(7, 8, 9);    t.assert(!intersects); // (F) facing away from the sphere
    update(5, 5, 3);    t.assert( intersects); // (T) a small portion of the sphere is in lower-left corner
    update(5, 5.25, 3); t.assert(!intersects); // (F) sphere has just left the frustum

    t.end();
  });

  t.test('box_frustum', t => {
    let eye = vec3.new(4, 5, 6);
    let at = vec3.create();
    let up = vec3.new(0, 1, 0);
    let v = new renderer.View();
    mat4.perspective(v._matProj , Math.PI/2, 16/9, 0.01, 1000);
    let center = vec3.new(1, 2, 3);
    let axis = vec3.new(3, 2, 1);
    let angle = Math.PI / 16 * 13;
    let q = quat.create(); quat.fromAxisAngle(q, vec3.normalize(axis, axis), angle);
    let m = mat3.create(); mat3.fromQuat(m, q);
    let b = box.new(center.x, center.y, center.z, 1, 1, 1, m.m00, m.m01, m.m02, m.m03, m.m04, m.m05, m.m06, m.m07, m.m08);
    let intersects = false;

    let update = function(x, y, z) {
      vec3.set(at, x, y, z); 
      mat4.lookAt(v._matView, eye, at, up);
      mat4.mul(v._matViewProj, v._matProj, v._matView);
      v.updateFrustumPlanes();
      intersects = intersect.box_frustum(b, v._frustumPlanes);
    };

    // hand-tuned unit-tests. 3 steps to reproduce in playground/pbr.js:
    // modify `app._device._gl.canvas` width:height to be 16:9
    // change the sphere to a length 2 cube located at `center` and rotated by `q'
    // place the camera to `eye` and look at following parameters passed into each `update`
    update(1, 2, 3);   t.assert( intersects); // (T) facing towards the sphere
    update(7, 8, 9);   t.assert(!intersects); // (F) facing away from the sphere
    update(5, 5.7, 3); t.assert( intersects); // (T) a small portion of the box is in lower-left corner
    update(5, 6, 3);   t.assert(!intersects); // (F) sphere has just left the frustum

    t.end();
  });

  t.end();
});