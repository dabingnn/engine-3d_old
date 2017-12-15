import Asset from './asset';

export default class Effect extends Asset {
  constructor() {
    super();

    this._effect = null; // renderer.effect
  }

  unload() {
    if (!this._loaded) {
      return;
    }

    // TODO: what should we do here ???

    super.unload();
  }
}