import renderer from 'renderer.js';
import gfx from 'gfx.js';
import Mesh from '../assets/mesh';
import parseLevel from '../loaders/utils/level-parser';

function createJointsTexture(app, skinning) {
  const jointCount = skinning.jointIndices.length;

  // set jointsTexture
  let size;
  if (jointCount > 256) {
    size = 64;
  } else if (jointCount > 64) {
    size = 32;
  } else if (jointCount > 16) {
    size = 16;
  } else {
    size = 8;
  }

  return new gfx.Texture2D(app.device, {
    width: size,
    height: size,
    format: gfx.TEXTURE_FMT_RGBA32F,
    minFilter: gfx.FILTER_NEAREST,
    magFilter: gfx.FILTER_NEAREST,
    wrapS: gfx.WRAP_CLAMP,
    wrapT: gfx.WRAP_CLAMP,
    mipmap: false,
  });
}

function createMesh(app, data) {
  let ia = renderer.createIA(app.device, data);
  let meshAsset = new Mesh();
  meshAsset._subMeshes = [ia];

  return meshAsset;
}

export default {
  createJointsTexture,
  createMesh,

  parseLevel,
};