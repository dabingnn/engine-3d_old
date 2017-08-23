import Texture from '../assets/texture';
import gfx from 'gfx.js';

const _filterMap = {
  linear: gfx.FILTER_LINEAR,
  nearest: gfx.FILTER_NEAREST,
};
const _wrapMap = {
  repeat: gfx.WRAP_REPEAT,
  clamp: gfx.WRAP_CLAMP,
  mirror: gfx.WRAP_MIRROR,
};

function createTexture(device, gltf, img) {
  // can not generate cube map texture now
  if(gltf.type !== '2d') return null;
  let textureAsset = new Texture();
  let textureOpts = {};
  textureOpts.images = [img];
  textureOpts.mipmap = true;
  textureOpts.width = img.width;
  textureOpts.height = img.height;
  textureOpts.format = gfx.TEXTURE_FMT_RGBA8;
  textureOpts.anisotropy = gltf.anisotropy;
  textureOpts.minFilter = _filterMap[gltf.minFilter];
  textureOpts.magFilter = _filterMap[gltf.magFilter];
  textureOpts.mipFilter = _filterMap[gltf.mipFilter];
  textureOpts.wrapS = _wrapMap[gltf.wrapS];
  textureOpts.wrapT = _wrapMap[gltf.wrapT];

  let texture = new gfx.Texture2D(device, textureOpts);
  textureAsset._texture = texture;
  return textureAsset;
}

export default function (app, gltf, img, callback) {
  if (!img) {
    callback(new Error('No img exsists.'));
    return;
  }

  let textureAsset = createTexture(app._device, gltf, img);
  callback(null, textureAsset);
}