import gfx from 'gfx.js';
import Texture from '../assets/texture';
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

      let textureAsset = new Texture();
      let opts = {};
      opts.images = [image];
      opts.mipmap = true;
      opts.width = image.width;
      opts.height = image.height;
      opts.format = gfx.TEXTURE_FMT_RGBA8; // TODO
      opts.anisotropy = json.anisotropy;
      opts.minFilter = _filterMap[json.minFilter];
      opts.magFilter = _filterMap[json.magFilter];
      opts.mipFilter = _filterMap[json.mipFilter];
      opts.wrapS = _wrapMap[json.wrapS];
      opts.wrapT = _wrapMap[json.wrapT];

      let texture = new gfx.Texture2D(app.device, opts);
      textureAsset._texture = texture;

      callback(null, textureAsset);
    }
  });
}