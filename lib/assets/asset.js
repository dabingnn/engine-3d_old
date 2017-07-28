export default class Asset {
  constructor() {
    this._name = '';
    this._loaded = false;
  }

  unload() {
    this._loaded = false;
  }

  reload() {
    // TODO
  }

  clone() {
  }
}