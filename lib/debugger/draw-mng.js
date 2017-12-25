import { vec3, color3 } from 'vmath';
import { LinkedArray } from 'memop';
import { Node } from 'scene-graph';
import gfx from 'gfx.js';
import renderer from 'renderer.js';
import { sphere, wireframe } from 'primitives.js';

let _right = vec3.new(1, 0, 0);
let _up = vec3.new(0, 1, 0);
let _forward = vec3.new(0, 0, 1);
let _v3_tmp = vec3.create();
let _v3_tmp2 = vec3.create();
let _c3_tmp = color3.create();

export default class DrawMng {
  constructor(app) {
    this._app = app;

    this._lines = new LinkedArray(() => {
      return {
        start: vec3.create(),
        end: vec3.create(),
        color: color3.create(),
        duration: 0.0,
        depthTest: false,
        timer: 0.0,
        is2D: false,

        _prev: null,
        _next: null,
      };
    }, 2000);

    this._rects = new LinkedArray(() => {
      return {
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        color: color3.create(),
        duration: 0.0,
        timer: 0.0,

        _prev: null,
        _next: null,
      };
    }, 2000);

    this._axesList = new LinkedArray(() => {
      return {
        pos: vec3.create(),
        up: vec3.create(),
        right: vec3.create(),
        forward: vec3.create(),
        duration: 0.0,
        depthTest: false,
        timer: 0.0,
        is2D: false,

        _prev: null,
        _next: null,
      };
    }, 2000);

    let wireframePass = new renderer.Pass('wireframe');
    wireframePass.setDepth(true, true);
    let wireframeTech = new renderer.Technique(
      ['opaque'],
      [
        { name: 'color', type: renderer.PARAM_COLOR3 }
      ],
      [wireframePass]
    );
    let wireframeEffect = new renderer.Effect([wireframeTech], {}, []);
    wireframeEffect.setProperty('color', color3.new(1, 1, 1));

    this._primitives = new LinkedArray(() => {
      return {
        model: (() => {
          let model = new renderer.Model();
          let node = new Node();
          model.setNode(node);
          model.addEffect(wireframeEffect);

          return model;
        })(),
        duration: 0.0,
        depthTest: false,
        timer: 0.0,

        _prev: null,
        _next: null,
      };
    }, 2000);

    let linePass = new renderer.Pass('line');
    linePass.setDepth(true, true);
    let lineTech = new renderer.Technique(
      ['opaque'],
      [],
      [linePass]
    );
    let lineEffect = new renderer.Effect([lineTech], {}, []);

    let linesModel = new renderer.LinesModel();
    linesModel.setDynamicIA(true);
    linesModel.setNode(new Node('debug-lines'));
    linesModel.addEffect(lineEffect);

    // TODO: https://github.com/cocos-creator/engine-3d/issues/108
    // lineModel.addInputAssembler(
    //   new renderer.DynamicInputAssembler(
    //     new gfx.VertexBuffer(
    //       device,
    //       new gfx.VertexFormat([
    //         { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
    //         { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_FLOAT32, num: 3 }
    //       ]),
    //       gfx.USAGE_DYNAMIC,
    //       lineData,
    //       2000
    //     ),
    //     null,
    //     gfx.PT_LINES
    //   )
    // );

    app.scene.addModel(linesModel);
    this._linesModel = linesModel;

    //
    let linesModel2D = new renderer.LinesModel();
    linesModel2D.setDynamicIA(true);
    linesModel2D.setNode(new Node('debug-lines-2d'));
    linesModel2D.addEffect(lineEffect);

    app.scene.addModel(linesModel2D);
    this._linesModel2D = linesModel2D;

    //
    let sphereData = sphere(1.0, {
      segments: 20,
    });
    sphereData.uvs = null;
    sphereData.indices = wireframe(sphereData.indices);
    this._sphereIA = renderer.createIA(app.device, sphereData);
    this._sphereIA._primitiveType = gfx.PT_LINES;
  }

  /**
   * @param {number} dt
   */
  tick(dt, viewID) {
    this._linesModel.clear();
    this._linesModel2D.clear();
    this._linesModel2D._viewID = viewID;

    // lines
    this._lines.forEach(item => {
      if (item.timer > item.duration) {
        this._lines.remove(item);
        return;
      }

      if (item.is2D) {
        this._linesModel2D.addLine(item.start, item.end, item.color);
      } else if (item.depthTest) {
        this._linesModel.addLine(item.start, item.end, item.color);
      } else {
        console.warn('We have not support it yet');
        // this._linesModelNoDepth.addLine(start, end, color, duration);
      }

      item.timer += dt;
    });

    // rects
    this._rects.forEach(item => {
      if (item.timer > item.duration) {
        this._rects.remove(item);
        return;
      }

      this._linesModel2D.addLine(
        vec3.set(_v3_tmp, item.x, item.y, 0.0),
        vec3.set(_v3_tmp2, item.x, item.y + item.h, 0.0),
        item.color
      );
      this._linesModel2D.addLine(
        vec3.set(_v3_tmp, item.x, item.y + item.h, 0.0),
        vec3.set(_v3_tmp2, item.x + item.w, item.y + item.h, 0.0),
        item.color
      );
      this._linesModel2D.addLine(
        vec3.set(_v3_tmp, item.x + item.w, item.y + item.h, 0.0),
        vec3.set(_v3_tmp2, item.x + item.w, item.y, 0.0),
        item.color
      );
      this._linesModel2D.addLine(
        vec3.set(_v3_tmp, item.x + item.w, item.y, 0.0),
        vec3.set(_v3_tmp2, item.x, item.y, 0.0),
        item.color
      );

      item.timer += dt;
    });

    // axes list
    this._axesList.forEach(item => {
      if (item.timer > item.duration) {
        this._axesList.remove(item);
        return;
      }

      if (item.is2D) {
        this._linesModel2D.addLine(item.pos, item.up, color3.set(_c3_tmp, 1, 0, 0));
        this._linesModel2D.addLine(item.pos, item.right, color3.set(_c3_tmp, 0, 1, 0));
        this._linesModel2D.addLine(item.pos, item.forward, color3.set(_c3_tmp, 0, 0, 1));
      } else if (item.depthTest) {
        this._linesModel.addLine(item.pos, item.up, color3.set(_c3_tmp, 1, 0, 0));
        this._linesModel.addLine(item.pos, item.right, color3.set(_c3_tmp, 0, 1, 0));
        this._linesModel.addLine(item.pos, item.forward, color3.set(_c3_tmp, 0, 0, 1));
      } else {
        console.warn('We have not support it yet');
        // this._linesModelNoDepth.addLine(start, end, color, duration);
      }

      item.timer += dt;
    });

    // primitives
    this._primitives.forEach(item => {
      if (item.timer > item.duration) {
        item.model.clearInputAssemblers();
        this._app.scene.removeModel(item.model);

        this._primitives.remove(item);
        return;
      }

      item.timer += dt;
    });
  }

  addLine(start, end, color, duration = 0.0, depthTest = true, is2D = false) {
    let line = this._lines.add();

    vec3.copy(line.start, start);
    vec3.copy(line.end, end);
    color3.copy(line.color, color);
    line.duration = duration;
    line.depthTest = depthTest;
    line.timer = 0.0;
    line.is2D = is2D;

    if (is2D) {
      line.start.z = 0.0;
      line.end.z = 0.0;
    }
  }

  addRect2D(x, y, width, height, color, duration = 0.0) {
    let rect = this._rects.add();

    rect.x = x;
    rect.y = y;
    rect.w = width;
    rect.h = height;
    color3.copy(rect.color, color);
    rect.duration = duration;
    rect.timer = 0.0;
  }

  addAxes(pos, rotation, scale, duration = 0.0, depthTest = true, is2D = false) {
    let axes = this._axesList.add();

    vec3.copy(axes.pos, pos);

    vec3.transformQuat(_v3_tmp, _right, rotation);
    vec3.scaleAndAdd(_v3_tmp, pos, _v3_tmp, scale),
    vec3.copy(axes.right, _v3_tmp);

    vec3.transformQuat(_v3_tmp, _up, rotation);
    vec3.scaleAndAdd(_v3_tmp, pos, _v3_tmp, scale),
    vec3.copy(axes.up, _v3_tmp);

    vec3.transformQuat(_v3_tmp, _forward, rotation);
    vec3.scaleAndAdd(_v3_tmp, pos, _v3_tmp, scale),
    vec3.copy(axes.forward, _v3_tmp);

    axes.duration = duration;
    axes.depthTest = depthTest;
    axes.timer = 0.0;
    axes.is2D = is2D;
  }

  addSphere(pos, radius, color, duration = 0.0, depthTest = true) {
    let primitive = this._primitives.add();
    primitive.model.addInputAssembler(this._sphereIA);
    vec3.copy(primitive.model._node.lpos, pos);
    vec3.set(primitive.model._node.lscale, radius, radius, radius);

    primitive.duration = duration;
    primitive.depthTest = depthTest;
    primitive.timer = 0.0;

    this._app.scene.addModel(primitive.model);
  }
}