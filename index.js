// intenral
import App from './lib/app';
import Orbit from './lib/orbit';
import Level from './lib/level';
import resl from './lib/resl';
import utils from './lib/utils';
import enums from './lib/enums';

// materials
import ShaderMaterial from './lib/materials/shader-material';
import StandardMaterial from './lib/materials/standard-material';
import PhongMaterial from './lib/materials/phong-material';

// assets
import Asset from './lib/assets/asset';
import Mesh from './lib/assets/mesh';
import Skinning from './lib/assets/skinning';
import Material from './lib/assets/material';
import LevelInfo from './lib/assets/level-info';

// renderer
import SkinningModel from './lib/renderer/skinning-model';

// components
import ScriptComponent from './lib/framework/script-component';
import ModelComponent from './lib/framework/model-component';
import SkinningModelComponent from './lib/framework/skinning-model-component';
import AnimationComponent from './lib/framework/animation-component';

// deps
import { Node } from 'scene-graph';
import { Component, System } from 'ecs.js';
import * as math from 'vmath';
import * as primitives from 'primitives.js';
import renderer from 'renderer.js';
import gfx from 'gfx.js';

let cc = {
  // engine
  App,
  Orbit,
  Level,
  Node,
  System,
  Component,

  // rendering
  SkinningModel,

  // assets
  Asset,
  Mesh,
  Skinning,
  Material,
  LevelInfo,

  // materials
  ShaderMaterial,
  StandardMaterial,
  PhongMaterial,

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

  // DELME: temporary
  utils,
  resl,
};
Object.assign(cc, enums);

export default cc;