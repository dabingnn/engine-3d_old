import Texture2D from '../assets/texture2d';
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

function createTexture(device, json, img) {
  // can not generate cube map texture now
  if(json.type !== '2d') return null;
  let asset = new Texture2D();
  let opts = {};
  opts.images = [img];
  opts.mipmap = true;
  opts.width = img.width;
  opts.height = img.height;
  opts.format = gfx.TEXTURE_FMT_RGBA8;
  opts.anisotropy = json.anisotropy;
  opts.minFilter = _filterMap[json.minFilter];
  opts.magFilter = _filterMap[json.magFilter];
  opts.mipFilter = _filterMap[json.mipFilter];
  opts.wrapS = _wrapMap[json.wrapS];
  opts.wrapT = _wrapMap[json.wrapT];

  let texture = new gfx.Texture2D(device, opts);
  asset._texture = texture;
  return asset;
}

export default function (app, json, img, callback) {
  if (!img) {
    callback(new Error('No img exsists.'));
    return;
  }

  let textureAsset = createTexture(app._device, json, img);
  callback(null, textureAsset);
}