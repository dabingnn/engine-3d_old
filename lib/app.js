import gfx from 'gfx.js';
import Input from 'input.js';
import { Engine } from 'ecs.js';
import { EventEmitter, EventDispatcher } from 'event-sys';
import ForwardRenderer from './renderer/forward-renderer';
import AssetMng from './assets/asset-mng';
import chunks from './shaders/chunks/index';
import templates from './shaders/templates/index';
import renderer from 'renderer.js';
import * as primitives from 'primitives.js';
import Mesh from './assets/mesh';
import Texture2D from './assets/texture-2d';
import TextureCube from './assets/texture-cube';
import Debugger from './debugger';

// loader
import meshLoader from './loaders/mesh-loader';
import materialLoader from './loaders/material-loader';
import texture2DLoader from './loaders/texture-2d-loader';
import textureCubeLoader from './loaders/texture-cube-loader';
import prefabLoader from './loaders/prefab-loader';
import gltfLoader from './loaders/gltf-loader';
import animationLoader from './loaders/animation-loader';
import spriteLoader from './loaders/sprite-loader';

// builtin components & systems
import ScriptComponent from './framework/script-component';
import CameraComponent from './framework/camera-component';
import LightComponent from './framework/light-component';
import ModelComponent from './framework/model-component';
import SkinningModelComponent from './framework/skinning-model-component';
import AnimationComponent from './framework/animation-component';
import SkyboxComponent from './framework/skybox-component';
import SpriteComponent from './framework/sprite-component';
import ScreenComponent from './framework/screen-component';

import ScriptSystem from './framework/script-system';
import CameraSystem from './framework/camera-system';
import LightSystem from './framework/light-system';
import ModelSystem from './framework/model-system';
import SkinningModelSystem from './framework/skinning-model-system';
import AnimationSystem from './framework/animation-system';
import SkyboxSystem from './framework/skybox-system';
import SpriteSystem from './framework/sprite-system';
import ScreenSystem from './framework/screen-system';

function _initBuiltins(device) {
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');

  // default texture
  canvas.width = canvas.height = 128;
  context.fillStyle = '#ddd';
  context.fillRect(0, 0, 128, 128);
  context.fillStyle = '#555';
  context.fillRect(0, 0, 64, 64);
  context.fillStyle = '#555';
  context.fillRect(64, 64, 64, 64);

  // default-texture
  let defaultTexture = new Texture2D();
  defaultTexture._texture = new gfx.Texture2D(device, {
    images: [canvas],
    width: 128,
    height: 128,
    wrapS: gfx.WRAP_REPEAT,
    wrapT: gfx.WRAP_REPEAT,
    format: gfx.TEXTURE_FMT_RGB8,
    mipmap: true,
  });
  defaultTexture._opts.wrapS = gfx.WRAP_REPEAT;
  defaultTexture._opts.wrapT = gfx.WRAP_REPEAT;
  defaultTexture._uuid = 'default-texture';
  defaultTexture._loaded = true;

  // default-texture-cube
  let defaultTextureCube = new TextureCube();
  defaultTextureCube._texture = new gfx.TextureCube(device, {
    width : 128,
    height : 128,
    images: [[canvas, canvas, canvas, canvas, canvas, canvas]]
  });
  defaultTexture._uuid = 'default-texture-cube';
  defaultTexture._loaded = true;

  // builtin-cube
  let cube = new Mesh();
  cube._subMeshes = new Array(1);
  cube._subMeshes[0] = renderer.createIA(
    device,
    primitives.box(1, 1, 1, {
      widthSegments: 1,
      heightSegments: 1,
      lengthSegments: 1,
    })
  );
  cube._uuid = 'builtin-cube';
  cube._loaded = true;

  // builtin-sphere
  let sphere = new Mesh();
  sphere._subMeshes = new Array(1);
  sphere._subMeshes[0] = renderer.createIA(
    device,
    primitives.sphere(0.5, {
      segments: 64,
    })
  );
  sphere._uuid = 'builtin-sphere';
  sphere._loaded = true;

  // builtin-cylinder
  let cylinder = new Mesh();
  cylinder._subMeshes = new Array(1);
  cylinder._subMeshes[0] = renderer.createIA(
    device,
    primitives.cylinder(0.5, 0.5, 2, {
      radialSegments: 20,
      capped: true,
    })
  );
  cylinder._uuid = 'builtin-cylinder';
  cylinder._loaded = true;

  // builtin-plane
  let plane = new Mesh();
  plane._subMeshes = new Array(1);
  plane._subMeshes[0] = renderer.createIA(
    device,
    primitives.plane(10, 10, {
      uSegments: 10,
      vSegments: 10,
    })
  );
  plane._uuid = 'builtin-plane';
  plane._loaded = true;

  return {
    defaultTexture,
    defaultTextureCube,
    cube,
    sphere,
    cylinder,
    plane,
  };
}

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

    // emit tick event
    app.emit('tick');

    // tick systems
    app.tick();

    // tick debugger
    app._debugger.tick(app.deltaTime);

    // dispatch events
    app._eventDispatcher.tick();

    // render the scene
    app._forward.render(app.scene);

    // TODO
    // app.lstats.tick();

    // reset input states
    app._input.reset();
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
      lock: true
    });
    this._device = new gfx.Device(canvas, opts);
    let builtins = _initBuiltins(this._device);

    // sub-modules (renderer)
    this._forward = new ForwardRenderer(this._device, {
      defaultTexture: builtins.defaultTexture._texture,
      defaultTextureCube: builtins.defaultTextureCube._texture,
      programTemplates: templates,
      programChunks: chunks,
    });
    this._scene = new renderer.Scene();

    // sub-modules (engine)
    this._assetMng = new AssetMng(this);
    this._eventDispatcher = new EventDispatcher();
    this._debugger = new Debugger(this);

    // register builtin assets
    for (let name in builtins) {
      let asset = builtins[name];
      this._assetMng.add(asset._uuid, asset);
    }

    // register builtin asset loader
    this.registerLoader('mesh', meshLoader);
    this.registerLoader('material', materialLoader);
    this.registerLoader('texture-2d', texture2DLoader);
    this.registerLoader('texture-cube', textureCubeLoader);
    this.registerLoader('prefab', prefabLoader);
    this.registerLoader('gltf', gltfLoader);
    this.registerLoader('animation', animationLoader);
    this.registerLoader('sprite', spriteLoader);

    // register builtin components
    this.registerClass('Script', ScriptComponent);
    this.registerClass('Camera', CameraComponent);
    this.registerClass('Light', LightComponent);
    this.registerClass('Model', ModelComponent);
    this.registerClass('SkinningModel', SkinningModelComponent);
    this.registerClass('Animation', AnimationComponent);
    this.registerClass('Skybox', SkyboxComponent);
    this.registerClass('Sprite', SpriteComponent);
    this.registerClass('Screen', ScreenComponent);

    // register builtin systems
    this.registerSystem('script', ScriptSystem, 'Script', 0);
    this.registerSystem('camera', CameraSystem, 'Camera', 100);
    this.registerSystem('light', LightSystem, 'Light', 100);
    this.registerSystem('model', ModelSystem, 'Model', 100);
    this.registerSystem('skinning-model', SkinningModelSystem, 'SkinningModel', 100);
    this.registerSystem('skybox', SkyboxSystem, 'Skybox', 100);
    this.registerSystem('sprite', SpriteSystem, 'Sprite', 100);
    this.registerSystem('animation', AnimationSystem, 'Animation', 200);
    this.registerSystem('screen', ScreenSystem, 'Screen', 100);

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

  registerLoader(type, loader) {
    this._assetMng.registerLoader(type, loader);
  }
}
EventEmitter.mixin(App);