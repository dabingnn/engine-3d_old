import { System } from '../ecs';
import { FixedArray } from '../memop';

export default class AudioSystem extends System {
  constructor() {
    super();
    this.instanceID = 0;
    this.id2audio = {};
    this.url2id = {};

    let sys = {};
    let DEBUG = false;

    let version = sys.browserVersion;

    // check if browser supports Web Audio
    // check Web Audio's context
    let supportWebAudio = !!(window.AudioContext || window.webkitAudioContext || window.mozAudioContext);

    let __audioSupport = { ONLY_ONE: false, WEB_AUDIO: supportWebAudio, DELAY_CREATE_CTX: false };

    if (sys.os === sys.OS_IOS) {
      // IOS no event that used to parse completed callback
      // this time is not complete, can not play
      //
      __audioSupport.USE_LOADER_EVENT = 'loadedmetadata';
    }

    if (sys.browserType === sys.BROWSER_TYPE_FIREFOX) {
      __audioSupport.DELAY_CREATE_CTX = true;
      __audioSupport.USE_LOADER_EVENT = 'canplay';
    }

    if (sys.os === sys.OS_ANDROID) {
      if (sys.browserType === sys.BROWSER_TYPE_UC) {
        __audioSupport.ONE_SOURCE = true;
      }
    }

    if(DEBUG){
      setTimeout(function(){
        console.log('browse type: ' + sys.browserType);
        console.log('browse version: ' + version);
        console.log('MULTI_CHANNEL: ' + __audioSupport.MULTI_CHANNEL);
        console.log('WEB_AUDIO: ' + __audioSupport.WEB_AUDIO);
        console.log('AUTOPLAY: ' + __audioSupport.AUTOPLAY);
      }, 0);
    }

    try {
      if (__audioSupport.WEB_AUDIO) {
        __audioSupport.context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
        if(__audioSupport.DELAY_CREATE_CTX) {
          setTimeout(function(){ __audioSupport.context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)(); }, 0);
        }
      }
    } catch(error) {
      __audioSupport.WEB_AUDIO = false;
      console.log(error);
    }

    function detectAudioFormat () {
      let formatSupport = [];
      let audio = document.createElement('audio');
      if(audio.canPlayType) {
        let ogg = audio.canPlayType('audio/ogg; codecs="vorbis"');
        if (ogg) formatSupport.push('.ogg');
        let mp3 = audio.canPlayType('audio/mpeg');
        if (mp3) formatSupport.push('.mp3');
        let wav = audio.canPlayType('audio/wav; codecs="1"');
        if (wav) formatSupport.push('.wav');
        let mp4 = audio.canPlayType('audio/mp4');
        if (mp4) formatSupport.push('.mp4');
        let m4a = audio.canPlayType('audio/x-m4a');
        if (m4a) formatSupport.push('.m4a');
      }
      return formatSupport;
    }
    __audioSupport.format = detectAudioFormat();
    this.__audioSupport = __audioSupport;
    this._audios = new FixedArray(200);
  }

  add(comp) {
    this._audios.push(comp);
  }

  remove(comp) {
    for (let i = 0; i < this._audios.length; ++i) {
      let c = this._audios.data[i];
      if (c === comp) {
        this._audios.fastRemove(i);
        break;
      }
    }
  }

  addClip(url, clip) {
    this.instanceID++;
    this.url2id[url] = this.instanceID;
    this.id2audio[this.instanceID] = clip;
    return this.instanceID;
  }

  getIDByURL(url) {
    return this.url2id[url];
  }

  removeClip(clip) {
    let url = null;
    if (!clip) {
      return;
    }
    else if (typeof clip === 'string') {
      url = clip;
    }
    else {
      url = clip.url;
    }
    let id = this.url2id[url];
    delete this.url2id[url];
    let audio = this.id2audio[id];
    if (audio) {
      audio.stop();
      audio.destroy();
      delete this.id2audio[id];
    }
  }

  setVolumeForAll(volume) {
    for (let i = 0; i < this._audios.length; i++) {
      this._audios.data[i].setVolume(volume);
    }
  }

  pauseAll() {
    for (let i = 0; i < this._audios.length; i++) {
      this._audios.data[i].pause();
    }
  }

  stopAll() {
    for (let i = 0; i < this._audios.length; i++) {
      this._audios.data[i].stop();
    }
  }

  resumeAll() {
    for (let i = 0; i < this._audios.length; i++) {
      this._audios.data[i].resume();
    }
  }

  _getClipByURL(url) {
    return this.id2audio[this.url2id[url]];
  }

  _getClipByID(clipID) {
    return this.id2audio[clipID];
  }
}