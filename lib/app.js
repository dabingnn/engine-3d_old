import gfx from 'gfx.js';
import renderer from './renderer';
import Input from './input';
import { App as AppBase } from './ecs';
import { EventEmitter } from './event-sys';
import { utils as sceneUtils } from './scene-graph';

import registry from './misc/registry';
import AssetMng from './assets/asset-mng';
import Debugger from './debugger';

// TODO: chunks and templates should move to renderer
import initBuiltins from './builtin/init';
import types from './builtin/types';

// loader
import meshLoader from './loaders/mesh-loader';
import materialLoader from './loaders/material-loader';
import textureLoader from './loaders/texture-loader';
import prefabLoader from './loaders/prefab-loader';
import gltfLoader from './loaders/gltf-loader';
import animationLoader from './loaders/animation-loader';
import bmfontLoader from './loaders/bmfont-loader';
import otfontLoader from './loaders/otfont-loader';
// import effectLoader from './loaders/effect-loader';

// builtin components & systems
import ScriptComponent from './framework/script-component';
import CameraComponent from './framework/camera-component';
import LightComponent from './framework/light-component';
import ModelComponent from './framework/model-component';
import SkinningModelComponent from './framework/skinning-model-component';
import AnimationComponent from './framework/animation-component';
import SkyboxComponent from './framework/skybox-component';
import ParticleSystemComponent from './framework/particle/particle-system-component';

import ScreenComponent from './framework/ui/screen-component';
import WidgetComponent from './framework/ui/widget-component';
import ImageComponent from './framework/ui/image-component';
import TextComponent from './framework/ui/text-component';
import MaskComponent from './framework/ui/mask-component';

import ScriptSystem from './framework/script-system';
import SkinningModelSystem from './framework/skinning-model-system';
import AnimationSystem from './framework/animation-system';
import WidgetSystem from './framework/ui/widget-system';
import ParticleSystemManager from './framework/particle/particle-system-manager';

// other classes
import ColorKey from './framework/particle/color-key';
import AlphaKey from './framework/particle/alpha-key';
import Gradient from './framework/particle/gradient';
import MinMaxGradient from './framework/particle/min-max-gradient';
import Burst from './framework/particle/burst';

// register builtin asset loader
registry.registerLoader('mesh', meshLoader);
registry.registerLoader('material', materialLoader);
registry.registerLoader('texture', textureLoader);
registry.registerLoader('prefab', prefabLoader);
registry.registerLoader('gltf', gltfLoader);
registry.registerLoader('animation', animationLoader);
registry.registerLoader('bmfont', bmfontLoader);
registry.registerLoader('otfont', otfontLoader);
// this.registerLoader('effect', effectLoader);

// register builtin types
for (let name in types) {
  registry.registerType(name, types[name]);
}

// register builtin components
registry.registerClass('Script', ScriptComponent);
registry.registerClass('Camera', CameraComponent);
registry.registerClass('Light', LightComponent);
registry.registerClass('Model', ModelComponent);
registry.registerClass('SkinningModel', SkinningModelComponent);
registry.registerClass('Animation', AnimationComponent);
registry.registerClass('Skybox', SkyboxComponent);
registry.registerClass('Screen', ScreenComponent);
registry.registerClass('Widget', WidgetComponent);
registry.registerClass('Mask', MaskComponent);
registry.registerClass('Image', ImageComponent);
registry.registerClass('Text', TextComponent);
registry.registerClass('ParticleSystem', ParticleSystemComponent);

// register builtin systems
registry.registerSystem('script', ScriptSystem, 'Script', 0);
registry.registerSystem('skinning-model', SkinningModelSystem, 'SkinningModel', 100);
registry.registerSystem('animation', AnimationSystem, 'Animation', 200);
registry.registerSystem('widget', WidgetSystem, 'Widget', 100);
registry.registerSystem('particle-system', ParticleSystemManager, 'ParticleSystem', 100);

// register other classes
registry.registerClass('ColorKey', ColorKey);
registry.registerClass('AlphaKey', AlphaKey);
registry.registerClass('Gradient', Gradient);
registry.registerClass('MinMaxGradient', MinMaxGradient);
registry.registerClass('Burst', Burst);

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
    app._debugger.postTick();

    // render the scene
    app._forward.render(app.scene);

    // TODO
    // app.lstats.tick();

    // reset internal states
    app._input.reset();
    app._scene.reset();
  };
}

export default class App extends AppBase {
  constructor(canvas, opts = {}) {
    super({
      poolSize: opts.poolSize || 100,
    });
    this.__initEventEmitter();

    // sub-modules (canvas)
    this._canvas = canvas;
    this._input = new Input(canvas, {
      lock: false,
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
      defaultTexture: builtins['default-texture']._texture,
      defaultTextureCube: builtins['default-texture-cube']._texture,
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

  get input() {
    return this._input;
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
    if (!path) {
      return null;
    }

    refNode = refNode || this._activeLevel;
    return sceneUtils.find(refNode, path);
  }
}
EventEmitter.mixin(App);