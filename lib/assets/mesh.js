import Asset from './asset';

export default class Mesh extends Asset {
  constructor() {
    super();

    this._meshes = null; // [renderer.Mesh]
  }

  unload() {
    if (!this._loaded) {
      return;
    }

    // destroy vertex buffer
    this._meshes[0]._vertexBuffer.destroy();

    // destroy index buffers
    for (let i = 0; i < this._meshes.length; ++i) {
      let mesh = this._meshes[i];
      mesh._indexBuffer.destroy();
    }

    this._meshes = null;

    super.unload();
  }

  get meshCount() {
    return this._meshes.length;
  }

  getMesh(idx) {
    return this._meshes[idx];
  }

  // TODO
  // updateData () {
  //   // store the data
  //   if (this._persist) {
  //     if (this._data) {
  //       this._data.set(data, offset);
  //     } else {
  //       this._data = data;
  //     }
  //   }
  // }
}