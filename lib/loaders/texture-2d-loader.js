import gfx from 'gfx.js';
import Texture2D from '../assets/texture-2d';
import resl from '../misc/resl';

const _filterMap = {
  linear: gfx.FILTER_LINEAR,
  nearest: gfx.FILTER_NEAREST,
};

const _wrapMap = {
  repeat: gfx.WRAP_REPEAT,
  clamp: gfx.WRAP_CLAMP,
  mirror: gfx.WRAP_MIRROR,
};

function createTexture2D(device, img, json) {
  let asset = new Texture2D();
  let opts = {};

  opts.images = [img];
  opts.mipmap = undefined;
  opts.width = img.width;
  opts.height = img.height;
  opts.format = gfx.TEXTURE_FMT_RGBA8;

  if (json) {
    opts.anisotropy = json.anisotropy;
    opts.minFilter = _filterMap[json.minFilter];
    opts.magFilter = _filterMap[json.magFilter];
    opts.mipFilter = _filterMap[json.mipFilter];
    opts.wrapS = _wrapMap[json.wrapS];
    opts.wrapT = _wrapMap[json.wrapT];
  }

  let texture = new gfx.Texture2D(device, opts);
  asset._texture = texture;
  asset._opts.anisotropy = opts.anisotropy;
  asset._opts.minFilter = opts.minFilter;
  asset._opts.magFilter = opts.magFilter;
  asset._opts.mipFilter = opts.mipFilter;
  asset._opts.wrapS = opts.wrapS;
  asset._opts.wrapT = opts.wrapT;
  return asset;
}

export default function (app, urls, callback) {
  let manifest = {
    image: {
      type: 'image',
      src: urls.image
    }
  };

  if (urls.json) {
    manifest.json = {
      type: 'text',
      parser: JSON.parse,
      src: urls.json,
    };
  }

  resl({
    manifest,
    onDone(data) {
      const { json, image } = data;
      let textureAsset = createTexture2D(app.device, image, json);

      callback(null, textureAsset);
    }
  });
}