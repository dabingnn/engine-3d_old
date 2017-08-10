export default class Asset {
  constructor() {
    this._name = '';
    this._loaded = false;
  }

  get name() {
    return this._name;
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