import Asset from './asset';

export default class Skinning extends Asset {
  constructor() {
    super();

    // shared data
    this._jointIndices = null;
    this._bindposes = null;
  }

  unload() {
    this._jointIndices = null;
    this._bindposes = null;

    super.unload();
  }
}