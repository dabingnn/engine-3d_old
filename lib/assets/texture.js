import Asset from './asset';

export default class Texture extends Asset {
  constructor() {
    super();

    this._texture = null; // gfx.Texture2D|gfx.TextureCube
  }
}