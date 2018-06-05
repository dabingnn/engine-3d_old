import { LoadMode, AudioClip } from '../assets/audio-clip';
var sys = null;

export default function (app, urls, callback) {
  sys = app.system('audio');

  if (sys.__audioSupport.format.length === 0) {
    return new Error(4927);
  }
  var audioID = sys.getIDByURL(urls.bin);
  if (audioID) {
    sys._getClipByID(audioID).once('load', function () {
      callback(null, audioID);
    });
    return;
  }

  var loader;
  if (!sys.__audioSupport.WEB_AUDIO) {
    // If WebAudio is not supported, load using DOM mode
    loader = loadDomAudio;
  }
  else {
    // TODO: urls end with ?useDom=1
    loader = loadWebAudio;
  }
  urls.url = urls.bin;
  loader(urls, callback);
}

// TODO: merge with resl solution
function loadDomAudio (item, callback) {
  var dom = document.createElement('audio');
  dom.src = item.url;

  // if (CC_WECHATGAME) {
  //   callback(null, dom);
  //   return;
  // }

  var clearEvent = function () {
    clearTimeout(timer);
    dom.removeEventListener("canplaythrough", success, false);
    dom.removeEventListener("error", failure, false);
    if(sys.__audioSupport.USE_LOADER_EVENT)
      dom.removeEventListener(sys.__audioSupport.USE_LOADER_EVENT, success, false);
  };
  var timer = setTimeout(function () {
    if (dom.readyState === 0)
      failure();
    else
      success();
  }, 8000);
  var clip = new AudioClip();
  clip.url = item.url;
  var audioID = sys.addClip(item.url, clip);
  var success = function () {
    clearEvent();
    clip._nativeAsset = dom;
    clip.loadMode = LoadMode.DOM_AUDIO;
    clip.emit('load');
    callback(null, audioID);
  };
  var failure = function () {
    clearEvent();
    var message = 'load audio failure - ' + item.url;
    console.log(message);
    sys.removeClip(item.url);
    callback(message);
  };
  dom.addEventListener("canplaythrough", success, false);
  dom.addEventListener("error", failure, false);
  if(sys.__audioSupport.USE_LOADER_EVENT)
    dom.addEventListener(sys.__audioSupport.USE_LOADER_EVENT, success, false);
}

function loadWebAudio (item, callback) {
  if (!sys.__audioSupport.context) callback(new Error(4926));

  var request = getXMLHttpRequest();
  request.open("GET", item.url, true);
  request.responseType = "arraybuffer";

  // fist add reference to audio system
  var clip = new AudioClip();
  clip.url = item.url;
  var audioID = sys.addClip(item.url, clip);
  // Our asynchronous callback
  request.onload = function () {
    sys.__audioSupport.context["decodeAudioData"](request.response, function(buffer){
      clip._nativeAsset = buffer;
      //success
      clip.emit('load');
      callback(null, audioID);
    }, function(){
      //error
      sys.removeClip(item.url);
      callback('decode error', null);
    });
  };

  request.onerror = function(){
    sys.removeClip(item.url);
    callback('request error', null);
  };

  request.send();
}

function getXMLHttpRequest () {
  return window.XMLHttpRequest ? new window.XMLHttpRequest() : new window.ActiveXObject('MSXML2.XMLHTTP');
}
