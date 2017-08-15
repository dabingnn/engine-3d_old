import Asset from './asset';

export default class LevelInfo extends Asset {
  constructor() {
    super();

    this._baseUrl = '';
    this._entities = [];
  }
}