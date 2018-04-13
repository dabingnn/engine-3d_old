import renderer from '../renderer';
import { utils as sceneUtils } from 'scene-graph';
import Mesh from '../assets/mesh';
import Texture2D from '../assets/texture-2d';
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

  let texture = new Texture2D(app.device, size, size, 'rgba32f');
  texture.minFilter = 'nearest';
  texture.magFilter = 'nearest';
  texture.wrapS = 'clamp';
  texture.wrapT = 'clamp';
  texture.mipmap = false;
  texture.writable = true;
  texture.commit();

  return texture;
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

  walk: sceneUtils.walk,
  flat: sceneUtils.flat,
  find: sceneUtils.find,
};