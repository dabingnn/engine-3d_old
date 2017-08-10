import renderer from 'renderer.js';

export default class Level {
  constructor() {
    this._scene = new renderer.Scene();
    this._assets = {};
    this._entities = []; // root entities
  }
}