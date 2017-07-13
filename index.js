// intenral
import App from './lib/app';
import Orbit from './lib/orbit';
import downloader from './lib/downloader';
import utils from './lib/utils';

// deps
import { Node } from 'scene-graph';
import * as math from 'vmath';
import primitives from 'primitives.js';
import renderer from 'renderer.js';
import gfx from 'gfx.js';

let engine = {
  // classes
  App,
  Orbit,
  Node,

  // modules
  utils,
  downloader,
  math,
  primitives,
  renderer,
  gfx,
};

export default engine;