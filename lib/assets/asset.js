export default class Asset {
  constructor() {
    this._uuid = '';
    this._name = '';
    this._loaded = false;

    // TODO
    // this._caches = {}; // downloaded caches (for reload)
  }

  get uuid() {
    return this._uuid;
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