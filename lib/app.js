import gfx from 'gfx.js';
import renderer from 'renderer.js';
import Input from 'input.js';
import { Engine } from 'ecs.js';
import { EventEmitter } from 'event-sys';
import { utils as sceneUtils } from 'scene-graph';

import registry from './misc/registry';
import AssetMng from './assets/asset-mng';
import Debugger from './debugger';

// TODO: chunks and templates should move to renderer
import initBuiltins from './builtin';

// loader
import meshLoader from './loaders/mesh-loader';
import materialLoader from './loaders/material-loader';
import textureLoader from './loaders/texture-loader';
import prefabLoader from './loaders/prefab-loader';
import gltfLoader from './loaders/gltf-loader';
import animationLoader from './loaders/animation-loader';
import bmfontLoader from './loaders/bmfont-loader';
// import effectLoader from './loaders/effect-loader';

// builtin components & systems
import ScriptComponent from './framework/script-component';
import CameraComponent from './framework/camera-component';
import LightComponent from './framework/light-component';
import ModelComponent from './framework/model-component';
import SkinningModelComponent from './framework/skinning-model-component';
import AnimationComponent from './framework/animation-component';
import SkyboxComponent from './framework/skybox-component';
import SpriteComponent from './framework/sprite-component';
import LabelComponent from './framework/label-component';
import ScreenComponent from './framework/screen-component';
import WidgetComponent from './framework/widget-component';
import MaskComponent from './framework/mask-component';

import ScriptSystem from './framework/script-system';
import CameraSystem from './framework/camera-system';
import LightSystem from './framework/light-system';
import ModelSystem from './framework/model-system';
import SkinningModelSystem from './framework/skinning-model-system';
import AnimationSystem from './framework/animation-system';
import SkyboxSystem from './framework/skybox-system';
import SpriteSystem from './framework/sprite-system';
import LabelSystem from './framework/label-system';
import ScreenSystem from './framework/screen-system';
import WidgetSystem from './framework/widget-system';
import MaskSystem from './framework/mask-system';

// register builtin asset loader
registry.registerLoader('mesh', meshLoader);
registry.registerLoader('material', materialLoader);
registry.registerLoader('texture', textureLoader);
registry.registerLoader('prefab', prefabLoader);
registry.registerLoader('gltf', gltfLoader);
registry.registerLoader('animation', animationLoader);
registry.registerLoader('bmfont', bmfontLoader);
// this.registerLoader('effect', effectLoader);

// register builtin components
registry.registerComponent('Script', ScriptComponent);
registry.registerComponent('Camera', CameraComponent);
registry.registerComponent('Light', LightComponent);
registry.registerComponent('Model', ModelComponent);
registry.registerComponent('SkinningModel', SkinningModelComponent);
registry.registerComponent('Animation', AnimationComponent);
registry.registerComponent('Skybox', SkyboxComponent);
registry.registerComponent('Sprite', SpriteComponent);
registry.registerComponent('Label', LabelComponent);
registry.registerComponent('Screen', ScreenComponent);
registry.registerComponent('Widget', WidgetComponent);
registry.registerComponent('Mask', MaskComponent);

// register builtin systems
registry.registerSystem('script', ScriptSystem, 'Script', 0);
registry.registerSystem('camera', CameraSystem, 'Camera', 100);
registry.registerSystem('light', LightSystem, 'Light', 100);
registry.registerSystem('model', ModelSystem, 'Model', 100);
registry.registerSystem('skinning-model', SkinningModelSystem, 'SkinningModel', 100);
registry.registerSystem('skybox', SkyboxSystem, 'Skybox', 100);
registry.registerSystem('sprite', SpriteSystem, 'Sprite', 100);
registry.registerSystem('label', LabelSystem, 'Label', 100);
registry.registerSystem('animation', AnimationSystem, 'Animation', 200);
registry.registerSystem('screen', ScreenSystem, 'Screen', 100);
registry.registerSystem('widget', WidgetSystem, 'Widget', 100);
registry.registerSystem('mask', MaskSystem, 'Mask', 100);

function _makeTick(app_) {
  const app = app_;

  return function (timestamp) {
    app._tickID = requestAnimationFrame(app._tick);

    // update timer
    if (timestamp === undefined) {
      timestamp = 0;
    }
    app.deltaTime = (timestamp - app._lasttime) / 1000;
    app.totalTime = timestamp / 1000;
    app._lasttime = timestamp;

    // tick debugger
    app._debugger.tick();

    // emit tick event
    app.emit('tick');

    // tick systems
    app.tick();

    // commit debugger commands
    app._debugger.commit();

    // render the scene
    app._forward.render(app.scene);

    // TODO
    // app.lstats.tick();

    // reset internal states
    app._input.reset();
    app._scene.reset();
  };
}

export default class App extends Engine {
  constructor(canvas, opts = {}) {
    super({
      poolSize: opts.poolSize || 100,
    });
    this.__initEventEmitter();

    // sub-modules (canvas)
    this._canvas = canvas;
    this._input = new Input(canvas, {
      lock: true,
      invertY: true,
    });
    this._device = new gfx.Device(canvas, opts);
    let builtins = initBuiltins(this._device);

    // sub-modules (renderer)
    renderer.addStage('opaque');
    renderer.addStage('transparent');
    renderer.addStage('ui');
    renderer.addStage('shadowcast');

    this._forward = new renderer.ForwardRenderer(this._device, {
      defaultTexture: builtins.defaultTexture._texture,
      defaultTextureCube: builtins.defaultTextureCube._texture,
    });
    this._scene = new renderer.Scene();

    // sub-modules (engine)
    this._assetMng = new AssetMng(this);
    this._debugger = new Debugger(this);

    // register builtin assets
    for (let name in builtins) {
      let asset = builtins[name];
      this._assetMng.add(asset._uuid, asset);
    }

    // register extensions
    registry._init(this);

    // sort systems
    this._sortSystems();

    // life callback
    this._tick = _makeTick(this);

    // public
    this.deltaTime = 0;
    this.totalTime = 0;

    // internal
    this._tickID = null;
    this._lasttime = 0;
    this._activeCamera = null;

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  get device() {
    return this._device;
  }

  get scene() {
    return this._scene;
  }

  get assets() {
    return this._assetMng;
  }

  get debugger() {
    return this._debugger;
  }

  run() {
    if (!this._activeLevel) {
      console.warn('There is no level to run, please load it first');
      return;
    }

    this._tickID = requestAnimationFrame(this._tick);
  }

  resize() {
    if (!this._canvas) {
      return;
    }

    let bcr = this._canvas.parentElement.getBoundingClientRect();
    this._canvas.width = bcr.width;
    this._canvas.height = bcr.height;

    this._input.resize();
  }

  destroy() {
    this._input.destroy();
    if (this._tickID) {
      cancelAnimationFrame(this._tickID);
    }
  }

  find(path, refNode) {
    refNode = refNode || this._activeLevel;
    return sceneUtils.find(refNode, path);
  }
}
EventEmitter.mixin(App);