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

function createTextureCube(device, imgs, json) {
  let asset = new TextureCube();
  let opts = {};

  opts.images = [imgs];
  opts.mipmap = true;
  opts.width = imgs[0].width;
  opts.height = imgs[0].height;
  opts.format = gfx.TEXTURE_FMT_RGBA8;

  if (json) {
    opts.anisotropy = json.anisotropy;
    opts.minFilter = _filterMap[json.minFilter];
    opts.magFilter = _filterMap[json.magFilter];
    opts.mipFilter = _filterMap[json.mipFilter];
    opts.wrapS = _wrapMap[json.wrapS];
    opts.wrapT = _wrapMap[json.wrapT];
  }

  let texture = new gfx.TextureCube(device, opts);
  asset._texture = texture;
  return asset;
}

export default function (app, urls, callback) {
  let manifest = {
    imagePosX: {
      type: 'image',
      src: urls.imagePosX
    },
    imageNegX: {
      type: 'image',
      src: urls.imageNegX
    },
    imagePosY: {
      type: 'image',
      src: urls.imagePosY
    },
    imageNegY: {
      type: 'image',
      src: urls.imageNegY
    },
    imagePosZ: {
      type: 'image',
      src: urls.imagePosZ
    },
    imageNegZ: {
      type: 'image',
      src: urls.imageNegZ
    },
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
      const { json, imagePosX, imageNegX, imagePosY, imageNegY, imagePosZ, imageNegZ } = data;
      let textureAsset = createTextureCube(app.device, [imagePosX, imageNegX, imagePosY, imageNegY, imagePosZ, imageNegZ], json);

      callback(null, textureAsset);
    }
  });
}