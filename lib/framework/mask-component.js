import { Component } from 'ecs.js';
import MaskRenderHelper from '../renderer/mask-render-data';
import SpriteMaterial from '../materials/sprite-material';


export default class MaskComponent extends Component {
  constructor() {
    super();

    this._materials = new Array(2);
    for (let i = 0; i < 2; ++i) {
      this._materials[i] = new SpriteMaterial();
    }

    this._renderHelper = new MaskRenderHelper();
  }

  onInit() {
    this._renderHelper.setNode(this._entity);
    this._renderHelper.setEffect(this._materials[0]._effect, 0);
    this._renderHelper.setEffect(this._materials[1]._effect, 1);
  }

  destroy() {
    this._renderHelper.destroy();
  }
}