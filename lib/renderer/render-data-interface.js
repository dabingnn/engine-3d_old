const _doNotBatchKey = -1;
export default class RenderDataInterface {
  constructor() {
    // mutable value for rendering
    this._multiplyTransform = false;
    this._ia = null;
    // default do not support batch at all, it could be a value or a string(uuid)
    this._batchKey = _doNotBatchKey;
  }

  // test batch with another renderdata
  batchTest(another) {
    return another && (this._batchKey !== _doNotBatchKey) && (this._batchKey === another._batchKey);
  }

  // reset batch key to _doNotBatchKey
  resetBatchKey() {
    this._batchKey = _doNotBatchKey;
  }

  setBatchKey(key) {
    this._batchKey = key;
  }
  // should return a graph node
  getNode() {
    return null;
  }

  // should return an effect
  getEffect() {
    return null;
  }

  // should return an array
  getPositions() {
    return null;
  }

  // should return an array
  getUVs() {
    return null;
  }

  // should return an array
  getIndices() {
    return null;
  }

  // should return a color4
  getColor() {
    return null;
  }

  // return vertex count here
  getVertexCount() {
    return 0;
  }

  // return index count here
  getIndexCount() {
    return 0;
  }

}
