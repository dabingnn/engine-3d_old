import { Component } from 'ecs.js';
import renderer from 'renderer.js';

export default class ModelComponent extends Component {
  constructor() {
    super();

    this._materials = []; // [Material]
    this._mesh = null; // Mesh
    this._model = new renderer.Model();
  }

  onInit() {
    this._model.setNode(this._entity);
  }

  onEnable() {
    this._entity.emit('model-changed', this, 'enabled', true);
  }

  onDisable() {
    this._entity.emit('model-changed', this, 'enabled', false);
  }

  set material(val) {
    if (this._materials.length === 1 && this._materials[0] === val) {
      return;
    }

    this._materials.length = 1;
    this._materials[0] = val;
    this._model.clearEffects();
    this._model.addEffect(val.effectAsset.effect);
  }

  set mesh(val) {
    if (this._mesh !== val) {
      if (this._mesh) {
        this._model.clearInputAssemblers();
      }

      this._mesh = val;

      for (let i = 0; i < this._mesh.subMeshCount; ++i) {
        this._model.addInputAssembler(this._mesh.getSubMesh(i));
      }
    }
  }
}