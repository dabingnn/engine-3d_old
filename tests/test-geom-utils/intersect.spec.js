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
    let out = vec3.zero();
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
    let out = vec3.zero();
    let intersects = intersect.line_triangle(l1, t1, out);

    t.assert(intersects);
    t.equal_v3(out, [0, 0.5, 0]);

    intersects = intersect.line_triangle(l2, t1, out);
    t.assert(intersects);
    t.equal_v3(out, [0, 0.0, 0]);

    t.end();
  });

  t.test('line_quad', t => {
    let out = vec3.zero();
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
    let out = vec3.zero();
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
    let axis_x = vec3.zero();
    let axis_y = vec3.zero();
    let axis_z = vec3.zero();
    vec3.set(axis_x, 1, 0, 0);
    vec3.set(axis_y, 0, 1, 0);
    vec3.set(axis_z, 0, 0, 1);

    let box_center = vec3.zero();
    vec3.set(box_center, 2, 1, 0);

    let ori_x = vec3.zero();
    let ori_y = vec3.zero();
    let ori_z = vec3.zero();
    let ori_center = vec3.zero();
    let angle = (-45) * Math.PI / 180;
    let ori_rot = vec3.zero();
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
    let out = vec3.zero();
    let intersects = intersect.ray_box(r1, b1, out);

    t.assert(intersects);
    t.equal_v3(out, [Math.sqrt(2), 0, 0]);

    t.end();
  });

  // hand-tuned unit-tests for frustum related tests.
  // test scene could be found at playground/frustum.js

  let pj = mat4.create();
  mat4.perspective(pj, Math.PI / 3, 16 / 9, 0.5, 100);

  t.test('sphere_frustum', t => {
    let eye = vec3.new(4, 5, 6);
    let at = vec3.zero();
    let up = vec3.new(0, 1, 0);
    let center = vec3.new(7, 2, 5);
    let s = sphere.new(center.x, center.y, center.z, 1);

    let v = new renderer.View();
    mat4.set(v._matProj,
      pj.m00, pj.m01, pj.m02, pj.m03,
      pj.m04, pj.m05, pj.m06, pj.m07,
      pj.m08, pj.m09, pj.m10, pj.m11,
      pj.m12, pj.m13, pj.m14, pj.m15);
    let i1 = false, i2 = false;

    let update = function(x, y, z) {
      vec3.set(at, x, y, z); 
      mat4.lookAt(v._matView, eye, at, up);
      mat4.mul(v._matViewProj, v._matProj, v._matView);
      v.updateFrustum();
      i1 = intersect.sphere_frustum(s, v._frustum);
      i2 = intersect.sphere_frustum_accurate(s, v._frustum);
    };

    update(7, 2, 5); t.assert( i1); t.assert( i2); // (T) facing towards the sphere
    update(1, 2, 3); t.assert(!i1); t.assert(!i2); // (F) facing away from the sphere
    update(5, 4, 3); t.assert( i1); t.assert( i2); // (T) a small portion of the sphere is in lower-left corner
    update(5, 5, 3); t.assert(!i1); t.assert(!i2); // (F) sphere has just left the frustum

    t.end();
  });

  t.test('box_frustum', t => {
    let eye = vec3.new(4, 5, 6);
    let at = vec3.zero();
    let up = vec3.new(0, 1, 0);
    let center = vec3.new(1, 2, 3);
    let axis = vec3.new(3, 2, 1);
    let angle = Math.PI / 16 * 13;
    let size = vec3.new(1, 1, 1);

    let q = quat.create(); quat.fromAxisAngle(q, vec3.normalize(axis, axis), angle);
    let m = mat3.create(); mat3.fromQuat(m, q);
    let b = box.new(center.x, center.y, center.z, size.x, size.y, size.z, m.m00, m.m01, m.m02, m.m03, m.m04, m.m05, m.m06, m.m07, m.m08);
    let v = new renderer.View(); v.fullUpdate = true;
    mat4.set(v._matProj,
      pj.m00, pj.m01, pj.m02, pj.m03,
      pj.m04, pj.m05, pj.m06, pj.m07,
      pj.m08, pj.m09, pj.m10, pj.m11,
      pj.m12, pj.m13, pj.m14, pj.m15);

    let update = function(x, y, z) {
      vec3.set(at, x, y, z); 
      mat4.lookAt(v._matView, eye, at, up);
      mat4.mul(v._matViewProj, v._matProj, v._matView);
      mat4.invert(v._matInvViewProj, v._matViewProj);
      v.updateFrustum();
      i1 = intersect.box_frustum(b, v._frustum);
      i2 = intersect.box_frustum_accurate(b, v._frustum);
    };

    let i1 = false, i2 = false;
    // make sure we have the right frustum setup
    update(5, 4, 3);
    t.equal_v3(v._frustum.vertices[0], [137.02885239, 29.89705380, -68.51022681]);

    update(1, 2, 3); t.assert( i1); t.assert( i2); // (T) facing towards the box
    update(7, 2, 5); t.assert(!i1); t.assert(!i2); // (F) facing away from the box
    update(5, 4, 3); t.assert( i1); t.assert( i2); // (T) a small portion of the box is in lower-left corner
    update(5, 5, 3); t.assert(!i1); t.assert(!i2); // (F) box has just left the frustum

    t.end();
  });

  t.test('sphere_frustum_accurate', t => {
    let eye = vec3.new(4, 5, 6);
    let at = vec3.new(5, 4, 3);
    let up = vec3.new(0, 1, 0);
    let center = vec3.new(-90, 20, -135);
    let s = sphere.new(center.x, center.y, center.z, 30);

    let v = new renderer.View();
    mat4.set(v._matProj,
      pj.m00, pj.m01, pj.m02, pj.m03,
      pj.m04, pj.m05, pj.m06, pj.m07,
      pj.m08, pj.m09, pj.m10, pj.m11,
      pj.m12, pj.m13, pj.m14, pj.m15);
    mat4.lookAt(v._matView, eye, at, up);
    mat4.mul(v._matViewProj, v._matProj, v._matView);
    v.updateFrustum();

    let intersects = false;
    intersects = intersect.sphere_frustum(s, v._frustum);
    t.assert( intersects); // (T) false positive
    intersects = intersect.sphere_frustum_accurate(s, v._frustum);
    t.assert(!intersects); // (F) actually outside the frustum

    t.end();
  });

  t.test('box_frustum_accurate', t => {
    let eye = vec3.new(4, 5, 6);
    let at = vec3.new(5, 4, 3);
    let up = vec3.new(0, 1, 0);
    let center = vec3.new(160, 20, -80);
    let axis = vec3.new(1, 2, 3);
    let angle = -Math.PI / 16 * 13;

    let q = quat.create(); quat.fromAxisAngle(q, vec3.normalize(axis, axis), angle);
    let m = mat3.create(); mat3.fromQuat(m, q);
    let b = box.new(center.x, center.y, center.z, 15, 25, 15, m.m00, m.m01, m.m02, m.m03, m.m04, m.m05, m.m06, m.m07, m.m08);
    let v = new renderer.View(); v.fullUpdate = true;
    mat4.lookAt(v._matView, eye, at, up);
    mat4.set(v._matProj,
      pj.m00, pj.m01, pj.m02, pj.m03,
      pj.m04, pj.m05, pj.m06, pj.m07,
      pj.m08, pj.m09, pj.m10, pj.m11,
      pj.m12, pj.m13, pj.m14, pj.m15);
    mat4.mul(v._matViewProj, v._matProj, v._matView);
    mat4.invert(v._matInvViewProj, v._matViewProj);
    v.updateFrustum();
    // make sure we have the right frustum setup
    t.equal_v3(v._frustum.vertices[0], [137.02885239, 29.89705380, -68.51022681]);

    let intersects = false;
    intersects = intersect.box_frustum(b, v._frustum);
    t.assert( intersects); // (T) false positive
    intersects = intersect.box_frustum_accurate(b, v._frustum);
    t.assert(!intersects); // (F) actually outside the frustum

    t.end();
  });

  t.end();
});