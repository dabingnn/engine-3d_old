import renderer from 'renderer.js';
import { Entity } from 'ecs.js';

export default class Level extends Entity {
  constructor(name) {
    super(name);

    this._scene = new renderer.Scene();
    this._assets = {};
    this._entities = []; // root entities
  }
}