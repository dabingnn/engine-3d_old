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
import Skin from './lib/assets/skin';
import Material from './lib/assets/material';
import LevelInfo from './lib/assets/level-info';

// renderer
import SkinningModel from './lib/renderer/skinning-model';

// components
import ScriptComponent from './lib/framework/script-component';
import ModelComponent from './lib/framework/model-component';

// deps
import { Node } from 'scene-graph';
import { Component, System } from 'ecs.js';
import * as math from 'vmath';
import * as primitives from 'primitives.js';
import renderer from 'renderer.js';
import gfx from 'gfx.js';

let cc = {
  // classes
  App,
  Orbit,
  Level,
  Node,
  System,
  Component,

  // components
  ScriptComponent,
  ModelComponent,

  // materials
  ShaderMaterial,
  StandardMaterial,
  PhongMaterial,

  // assets
  Asset,
  Mesh,
  Skin,
  Material,
  LevelInfo,

  // renderer
  SkinningModel,

  // modules
  utils,
  math,
  primitives,
  renderer,
  gfx,

  // DELME: temporary
  resl,
};
Object.assign(cc, enums);

export default cc;