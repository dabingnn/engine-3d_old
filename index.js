import App from './lib/app';
import enums from './lib/enums';

// misc
import Orbit from './lib/misc/orbit';
import resl from './lib/misc/resl';
import path from './lib/misc/path';
import async from './lib/misc/async';
import utils from './lib/misc/utils';

// components
import ScriptComponent from './lib/framework/script-component';
import ModelComponent from './lib/framework/model-component';
import SkinningModelComponent from './lib/framework/skinning-model-component';
import AnimationComponent from './lib/framework/animation-component';

// materials
import ShaderMaterial from './lib/materials/shader-material';
import StandardMaterial from './lib/materials/standard-material';
import PhongMaterial from './lib/materials/phong-material';

// assets
import Asset from './lib/assets/asset';
import Mesh from './lib/assets/mesh';
import Joints from './lib/assets/joints';
import Material from './lib/assets/material';
import Prefab from './lib/assets/prefab';
import AnimationClip from './lib/assets/animation-clip';
import Gltf from './lib/assets/gltf';
import Texture from './lib/assets/texture';
import Texture2D from './lib/assets/texture2d';

// renderer
import SkinningModel from './lib/renderer/skinning-model';

// deps
import { Node } from 'scene-graph';
import { Component, System, Level } from 'ecs.js';
import * as math from 'vmath';
import * as primitives from 'primitives.js';
import renderer from 'renderer.js';
import gfx from 'gfx.js';

//
let cc = {
  // misc
  Orbit,
  Node,

  // rendering
  SkinningModel,

  // assets
  Asset,
  Mesh,
  Joints,
  Material,
  Prefab,
  AnimationClip,
  Gltf,
  Texture,
  Texture2D,

  // materials
  ShaderMaterial,
  StandardMaterial,
  PhongMaterial,

  // framework
  App,
  Level,
  System,
  Component,

  // components
  ScriptComponent,
  ModelComponent,
  SkinningModelComponent,
  AnimationComponent,

  // modules
  math,
  primitives,
  renderer,
  gfx,

  // misc
  utils,
  resl,
  path,
  async,
};
Object.assign(cc, enums);

export default cc;