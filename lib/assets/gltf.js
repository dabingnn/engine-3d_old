import Asset from './asset';

export default class Gltf extends Asset {
  constructor() {
    super();

    this._nodes = null;
    this._meshes = null;
    this._skins = null;
  }

  subAsset(localID) {
    let id = parseInt(localID.substring(1));
    if (localID[0] === 'm') {
      return this._meshes[id];
    }

    return null;
  }
}