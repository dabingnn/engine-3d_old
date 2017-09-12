import { Component } from 'ecs.js';
import renderer from 'renderer.js';
import { box } from 'primitives.js';
import SkyboxMaterial from '../materials/skybox-material';

export default class SkyboxComponent extends Component {
  constructor() {
    super();

    this._material = new SkyboxMaterial();
    this._model = new renderer.Model();
    this._model.addEffect(this._material._effect);
  }

  onInit() {
    this._model.setNode(this._entity);
    let ia = renderer.createIA(this._engine.device, box(2, 2, 2, {
      widthSegments: 1,
      heightSegments: 1,
      lengthSegments: 1,
    }));
    this._model.addInputAssembler(ia);
  }

  set cubeMap(val) {
    this._material.cubeMap = val;
  }
}