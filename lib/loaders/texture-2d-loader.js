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

function createTexture(device, json, img) {
  if (json.type !== '2d') {
    return null;
  }

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

export default function (app, urls, callback) {
  resl({
    manifest: {
      json: {
        type: 'text',
        parser: JSON.parse,
        src: urls.json,
      },
      image: {
        type: 'image',
        src: urls.image
      }
    },

    onDone(data) {
      const { json, image } = data;
      let textureAsset = createTexture(app.device, json, image);

      callback(null, textureAsset);
    }
  });
}