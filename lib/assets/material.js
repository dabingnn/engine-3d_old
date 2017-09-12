import Asset from './asset';

export default class Material extends Asset {
  constructor() {
    super();

    this._effect = null; // renderer.Effect
  }

  unload() {
    if (!this._loaded) {
      return;
    }

    // TODO: what should we do here ???

    super.unload();
  }
}