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

  /**
   * @param {number} localID
   * Overwrite this if you have sub-assets
   */
  subAsset(/*localID*/) {
    return null;
  }

  unload() {
    this._loaded = false;
  }

  reload() {
  }

  clone() {
  }
}