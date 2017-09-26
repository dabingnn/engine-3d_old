import renderer from 'renderer.js';



export default class ScreenModel extends renderer.Model {
  constructor() {
    super();
    this._isDynamic = true;
    this._spriteItems = [];
  }

  destroy() {
  }

  get inputAssemblerCount() {
    return this._spriteItems.length;
  }

  getDrawItem(out, index) {
    if (index >= this._spriteItems.length) {
      out.model = null;
      out.node = null;
      out.ia = null;
      out.effect = null;
      out.options = null;

      return;
    }

    let item = this._spriteItems[index];

    out.model = this;
    out.node = item.node;
    out.ia = item;
    out.effect = item.effect;
    out.options = {};
  }

  addModelData(item) {
    this._spriteItems.push(item);
  }

  clearModelDatas() {
    this._spriteItems.length = 0;
  }

}