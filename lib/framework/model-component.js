import { Component } from 'ecs.js';
import renderer from '../renderer';

export default class ModelComponent extends Component {
  onInit() {
    this._models = [];
    this._updateModels();
  }

  onEnable() {
    for (let i = 0; i < this._models.length; ++i) {
      this._app.scene.addModel(this._models[i]);
    }
  }

  onDisable() {
    for (let i = 0; i < this._models.length; ++i) {
      this._app.scene.removeModel(this._models[i]);
    }
  }

  getMaterial(idx) {
    if (this._materials.length === 0) {
      return null;
    }

    if (idx < this._materials.length) {
      return this._materials[idx];
    }

    return this._materials[this._materials.length - 1];
  }

  get material() {
    return this.getMaterial(0);
  }
  set material(val) {
    if (this._materials.length === 1 && this._materials[0] === val) {
      return;
    }

    this._materials[0] = val;

    if (this._models.length > 0) {
      this._models[0].setEffect(val.effectInst);
    }
  }

  _updateModels() {
    let meshCount = this._mesh ? this._mesh.subMeshCount : 0;
    let oldModels = this._models;

    this._models = new Array(meshCount);
    for (let i = 0; i < meshCount; ++i) {
      let model = new renderer.Model();
      this._models[i] = model;
    }

    this._updateModelParams();

    if (this.enabled) {
      for (let i = 0; i < oldModels.length; ++i) {
        this._app.scene.removeModel(oldModels[i]);
      }
      for (let i = 0; i < this._models.length; ++i) {
        this._app.scene.addModel(this._models[i]);
      }
    }
  }

  _updateModelParams() {
    for (let i = 0; i < this._models.length; ++i) {
      let model = this._models[i];
      let material = this.getMaterial(i);
      let inputAssembler = this._mesh.getSubMesh(i);

      model.setInputAssembler(inputAssembler);
      model.setEffect(material ? material.effectInst : null);
      model.setNode(this._entity);
    }
  }
}

ModelComponent.schema = {
  materials: {
    type: 'asset',
    default: [],
    array: true,
    set(val) {
      this._materials = val;
      this._updateModelParams();
    }
  },

  mesh: {
    type: 'asset',
    default: null,
    set(val) {
      if (this._mesh === val) {
        return;
      }

      this._mesh = val;
      this._updateModels();
    }
  }
};