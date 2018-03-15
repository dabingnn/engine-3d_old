import { Component } from 'ecs.js';
import renderer from 'renderer.js';
import Material from '../../assets/material';

let _userData2RendererVertAttrs = {
  'Position': renderer.PARTICLE_POSITION,
  'UV': renderer.PARTICLE_UV,
  'Color': renderer.PARTICLE_COLOR,
  'Normal': renderer.PARTICLE_NORMAL,
  'Tangent': renderer.PARTICLE_TANGENT,
  'Custom1': renderer.PARTICLE_CUSTOM1,
  'Custom2': renderer.PARTICLE_CUSTOM2,
};

export default class ParticleSystemComponent extends Component {
  constructor() {
    super();

    this._material = null;
    this._model = new renderer.ParticleBatchModel();
  }

  onInit() {
    this._model.setNode(this._entity);
    // HACK, TODO
    if (this._material === null) {
      this._material = new Material();
      this._material.effect = this._app.assets.get('builtin-effect-particle-premultiply-blend');
    }
  }

  onEnable() {
    this._app.scene.addModel(this._model);
  }

  onDisable() {
    this._app.scene.removeModel(this._model);
  }

  set material(val) {
    this._material = val;
    this._model.setEffect(val.effectInst);
  }

  setCustomVertexAtrributes(attrs) {
    let vertAttrs = [];
    for (let i = 0; i < attrs.length; ++i) {
      let attr = _userData2RendererVertAttrs(attrs[i]);
      if (attr !== undefined) {
        vertAttrs.push(attr);
      }
    }
    this._model.setVertexAttributes(vertAttrs);
  }
}