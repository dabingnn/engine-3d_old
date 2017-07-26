import Asset from './asset';

export default class Material extends Asset {
  constructor() {
    super();

    this._effect = null; // renderer.Effect
  }
}