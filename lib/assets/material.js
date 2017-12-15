import Asset from './asset';

export default class Material extends Asset {
  constructor() {
    super();

    this._effect = null; // effectAsset
  }

  set effect(val) {
    this._effect = val;
  }

  setProperty(name, val) {
    this._effect.setValue(name, val);
  }

  setOption(name, val) {
    this._effect.setOption(name, val);
  }

  unload() {
    if (!this._loaded) {
      return;
    }

    // TODO: what should we do here ???

    super.unload();
  }
}