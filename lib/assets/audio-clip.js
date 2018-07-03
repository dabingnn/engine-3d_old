import Asset from './asset';
import { EventEmitter } from '../event-sys';

/**
 * Enums indicating the load mode of an audio clip
 * @property {number} WEB_AUDIO load through Web Audio API interface
 * @property {number} DOM_AUDIO load through an audio DOM element
 */
let LoadMode = {
  WEB_AUDIO: 0,
  DOM_AUDIO: 1,
};

/**
 * The wrapper class holding the clip resource
 */
class AudioClip extends Asset {
  /**
   * Create an empty clip
   */
  constructor() {
    super();
    this.__initEventEmitter();
    this._audio = null;
    /**
     * Current load mode, using Web Audio API by default
     * @type {number}
     */
    this.loadMode = LoadMode.WEB_AUDIO;
  }

  /**
   * Get the actual audio asset, is either
   * the AudioBuffer from Web Audio API in WEB_MODE, 
   * or the audio DOM element in DOM_MODE
   * @return {AudioBuffer|audio}
   */
  get nativeAsset() {
    return this._audio;
  }

  /**
   * Set the actual audio asset
   * @param {AudioBuffer|audio}
   */
  set nativeAsset(value) {
    this._audio = value;
    if (value) {
      this._loaded = true;
    }
  }
}

EventEmitter.mixin(AudioClip);
export { LoadMode, AudioClip };