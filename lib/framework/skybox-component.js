import { Component } from '../ecs';
import renderer from '../renderer';
import { box } from '../primitives';
import Material from '../assets/material';

export default class SkyboxComponent extends Component {
  constructor() {
    super();

    this._model = new renderer.Model();
  }
  onInit() {
    this._model.setNode(this._entity);

    let ia = renderer.createIA(this._app.device, box(2, 2, 2, {
      widthSegments: 1,
      heightSegments: 1,
      lengthSegments: 1,
    }));
    this._model.setInputAssembler(ia);

    if (this._material === null) {
      this._material = new Material();
      this._material.effect = this._app.assets.get('builtin-effect-skybox');
    }

    this._updateMaterialParams();
    this._model.setEffect(this._material.effectInst);
  }

  onEnable() {
    this._app.scene.addModel(this._model);
  }

  onDisable() {
    this._app.scene.removeModel(this._model);
  }

  _updateMaterialParams() {
    if (this._material === null || this._material === undefined) {
      return;
    }
    if (this._cubeMap !== null && this._cubeMap !== undefined) {
      this._material.setProperty('cubeMap', this._cubeMap);
    }
  }
}

SkyboxComponent.schema = {
  material: {
    type: 'asset',
    default: null,
    set(val) {
      if (this._material === val) {
        return;
      }

      this._material = val;
      this._updateMaterialParams();
      this._model.setEffect(val.effectInst);
    }
  },

  cubeMap: {
    type: 'asset',
    default: null,
    set(val) {
      if (this._cubeMap === val) {
        return;
      }

      this._cubeMap = val;
      this._updateMaterialParams();
    }
  }
};