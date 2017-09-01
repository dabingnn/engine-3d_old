import gfx from 'gfx.js';
import TextureCube from '../assets/texture-cube';
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

function createTexture(device, json, imgs) {
  if (json.type !== 'cube') {
    return null;
  }

  let asset = new TextureCube();
  let opts = {};
  opts.images = [imgs];
  opts.mipmap = true;
  opts.width = imgs[0].width;
  opts.height = imgs[0].height;
  opts.format = gfx.TEXTURE_FMT_RGBA8;
  opts.anisotropy = json.anisotropy;
  opts.minFilter = _filterMap[json.minFilter];
  opts.magFilter = _filterMap[json.magFilter];
  opts.mipFilter = _filterMap[json.mipFilter];
  opts.wrapS = _wrapMap[json.wrapS];
  opts.wrapT = _wrapMap[json.wrapT];

  let texture = new gfx.TextureCube(device, opts);
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
      image_posX: {
        type: 'image',
        src: urls.image_posX
      },
      image_negX: {
        type: 'image',
        src: urls.image_negX
      },
      image_posY: {
        type: 'image',
        src: urls.image_posY
      },
      image_negY: {
        type: 'image',
        src: urls.image_negY
      },
      image_posZ: {
        type: 'image',
        src: urls.image_posZ
      },
      image_negZ: {
        type: 'image',
        src: urls.image_negZ
      },
    },

    onDone(data) {
      const { json, image_posX, image_negX, image_posY, image_negY, image_posZ, image_negZ } = data;
      let textureAsset = createTexture(app.device, json, [image_posX, image_negX, image_posY, image_negY, image_posZ, image_negZ]);

      callback(null, textureAsset);
    }
  });
}