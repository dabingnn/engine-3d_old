import { Component } from 'ecs.js';
import renderer from 'renderer.js';
import { box } from 'primitives.js';
import Material from '../assets/material';

export default class SkyboxComponent extends Component {
  constructor() {
    super();

    this._material = null;
    this._model = new renderer.Model();
  }

  onInit() {
    this._model.setNode(this._entity);
    let ia = renderer.createIA(this._engine.device, box(2, 2, 2, {
      widthSegments: 1,
      heightSegments: 1,
      lengthSegments: 1,
    }));
    this._model.setInputAssembler(ia);
    // HACK, TODO
    if (this._material === null) {
      this._material = new Material();
      this._material.effect = this._engine.assets.get('builtin-skybox');
    }
  }

  set material(val) {
    this._material = val;
    this._model.setEffect(val.effectInst);
  }

  set cubeMap(val) {
    this._material.cubeMap = val;
  }
}