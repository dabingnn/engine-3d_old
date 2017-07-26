import Asset from './asset';

export default class Skin extends Asset {
  constructor() {
    super();

    // shared data
    this._jointIndices = null;
    this._bindposes = null;
    this._skeleton = null;
  }

  unload() {
    this._jointIndices = null;
    this._bindposes = null;
    this._skeleton = null;

    super.unload();
  }
}