import { Component } from 'ecs.js';
import MaskRenderHelper from '../renderer/mask-render-data';


export default class MaskComponent extends Component {
  constructor() {
    super();

    this._materials = new Array(2);
    this._renderHelper = new MaskRenderHelper();
  }

  onInit() {
    this._renderHelper.setNode(this._entity);
  }

  set materials(val) {
    for (let i = 0; i < 2; ++i) {
      this._materials[i] = val[i];
      this._renderHelper.setEffect(this._materials[i].effectAsset.effect, i);
    }
  }

  destroy() {
    this._renderHelper.destroy();
  }
}