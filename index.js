// intenral
import App from './lib/app';
import Orbit from './lib/orbit';
import resl from './lib/resl';
import utils from './lib/utils';
import enums from './lib/enums';
import StandardMaterial from './lib/materials/standard-material';

// deps
import { Node } from 'scene-graph';
import * as math from 'vmath';
import * as primitives from 'primitives.js';
import renderer from 'renderer.js';
import gfx from 'gfx.js';

let engine = {
  // classes
  App,
  Orbit,
  Node,
  StandardMaterial,

  // modules
  utils,
  math,
  primitives,
  renderer,
  gfx,

  // DELME: temporary
  resl,
};
Object.assign(engine, enums);

export default engine;