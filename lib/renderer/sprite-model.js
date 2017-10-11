import renderer from 'renderer.js';

export default class SpriteModel extends renderer.Model {
  constructor() {
    super();
    this._dynamicIA = true;
    this._modelData = null;
    this._sortKey = 0;
  }

  destroy() {
  }

  set sortKey(val) {
    this._sortKey = val;
  }

  get sortKey() {
    return this._sortKey;
  }

}