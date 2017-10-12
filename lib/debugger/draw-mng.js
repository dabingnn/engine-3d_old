import { Node } from 'scene-graph';
import LineModel from '../renderer/line-model';
import ShaderMaterial from '../materials/shader-material';

export default class DrawMng {
  constructor(app) {
    this._app = app;

    let materialLine = new ShaderMaterial(
      'line', [], []
    );
    materialLine.setDepth(true, true);

    let lineModel = new LineModel();
    lineModel._dynamicIA = true;
    lineModel.setNode(new Node('debug-lines'));
    lineModel.addEffect(materialLine._effect);

    app.scene.addModel(lineModel);

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

    //
    this._materialLine = materialLine;
    this._lineModel = lineModel;
    this._lineCount = 0;
  }

  /**
   * @param {number} dt
   */
  tick(dt) {
    this._lineModel.tick(dt);
  }

  addLine(start, end, color, duration = 0.0, depthTest = true) {
    if (depthTest) {
      this._lineModel.addLine(start, end, color, duration);
    } else {
      console.warn('We have not support it yet');
      // this._lineModelNoDepth.addLine(start, end, color, duration);
    }
  }
}