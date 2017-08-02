// intenral
import App from './lib/app';
import Orbit from './lib/orbit';
import resl from './lib/resl';
import utils from './lib/utils';
import enums from './lib/enums';

import ShaderMaterial from './lib/materials/shader-material';
import StandardMaterial from './lib/materials/standard-material';
import PhongMaterial from './lib/materials/phong-material';

import Asset from './lib/assets/asset';
import Mesh from './lib/assets/mesh';
import Skin from './lib/assets/skin';
import Material from './lib/assets/material';

import SkinningModel from './lib/renderer/skinning-model';

// deps
import { Node } from 'scene-graph';
import * as math from 'vmath';
import * as primitives from 'primitives.js';
import renderer from 'renderer.js';
import gfx from 'gfx.js';

let cc = {
  // classes
  App,
  Orbit,
  Node,

  // materials
  ShaderMaterial,
  StandardMaterial,
  PhongMaterial,

  // assets
  Asset,
  Mesh,
  Skin,
  Material,

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