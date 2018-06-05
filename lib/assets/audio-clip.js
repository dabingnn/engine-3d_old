import Asset from './asset';
import { EventEmitter } from '../event-sys';

var LoadMode = {
  WEB_AUDIO: 0,
  DOM_AUDIO: 1,
};

class AudioClip extends Asset {
  constructor() {
    super();
    this.__initEventEmitter();
    this._audio = null;
    this.loaded = false;
    this.loadMode = LoadMode.WEB_AUDIO;
  }

  get _nativeAsset() {
    return this._audio;
  }

  set _nativeAsset(value) {
    this._audio = value;
    if (value) {
      this._loaded = true;
      this.loaded = true;
    }
  }
}

EventEmitter.mixin(AudioClip);
export { LoadMode, AudioClip };