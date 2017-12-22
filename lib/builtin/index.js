import gfx from 'gfx.js';
import renderer from 'renderer.js';
import * as primitives from 'primitives.js';

import Mesh from '../assets/mesh';
import Texture2D from '../assets/texture-2d';
import TextureCube from '../assets/texture-cube';
import Effect from '../assets/effect';
import effectJsons from './effects/index';

export default function (device) {
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');

  // default texture canvas fill
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

  // black texture canvas fill
  canvas.width = canvas.height = 2;
  context.fillStyle = '#000';
  context.fillRect(0, 0, 2, 2);

  // black-texture
  let blackTexture = new Texture2D();
  blackTexture._texture = new gfx.Texture2D(device, {
    images: [canvas],
    width: 2,
    height: 2,
    wrapS: gfx.WRAP_REPEAT,
    wrapT: gfx.WRAP_REPEAT,
    format: gfx.TEXTURE_FMT_RGB8,
    mipmap: true,
  });
  blackTexture._opts.wrapS = gfx.WRAP_REPEAT;
  blackTexture._opts.wrapT = gfx.WRAP_REPEAT;
  blackTexture._uuid = 'black-texture';
  blackTexture._loaded = true;

  // default-texture-cube
  let defaultTextureCube = new TextureCube();
  defaultTextureCube._texture = new gfx.TextureCube(device, {
    width: 128,
    height: 128,
    images: [[canvas, canvas, canvas, canvas, canvas, canvas]]
  });
  defaultTextureCube._uuid = 'default-texture-cube';
  defaultTextureCube._loaded = true;

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

  // builtin-effects
  let effects = new Array(effectJsons.length);
  for (let i = 0; i < effectJsons.length; ++i) {
    let effectJson = effectJsons[i];
    effects[i] = new Effect();
    effects[i]._name = effectJson.name;
    effects[i]._uuid = `builtin-${effectJson.name}`;
    effects[i]._loaded = true;
    effects[i].techniques = effectJson.techniques;
    effects[i].properties = effectJson.properties;
    effects[i].defines = effectJson.defines;
  }

  //
  return Object.assign({
    defaultTexture,
    defaultTextureCube,
    blackTexture,
    cube,
    sphere,
    cylinder,
    plane,
  }, effects);
}