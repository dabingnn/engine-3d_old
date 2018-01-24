import { Component } from 'ecs.js';
import renderer from 'renderer.js';

export default class ModelComponent extends Component {
  constructor() {
    super();

    this._mesh = null; // Mesh
    this._materials = [];
    this._models = [];
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

  get mesh () {
    return this._mesh;
  }
  set mesh(val) {
    if (this._mesh !== val) {
      this._mesh = val;

      let meshCount = this._mesh ? this._mesh.subMeshCount : 0;
      let oldModels = this._models;

      this._models = new Array(meshCount);

      for (let i = 0; i < meshCount; ++i) {
        let model = new renderer.Model();
        let material = this.getMaterial(i);

        model.setInputAssembler(this._mesh.getSubMesh(i));
        model.setEffect(material ? material.effectInst : null);
        model.setNode(this._entity);
        this._models[i] = model;
      }

      if (this.enabledInHierarchy) {
        for (let i = 0; i < oldModels.length; ++i) {
          this._app.scene.removeModel(oldModels[i]);
        }
        for (let i = 0; i < this._models.length; ++i) {
          this._app.scene.addModel(this._models[i]);
        }
      }
    }
  }
}