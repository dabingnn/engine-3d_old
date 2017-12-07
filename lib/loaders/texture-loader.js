import gfx from 'gfx.js';
import resl from '../misc/resl';
import Texture2D from '../assets/texture-2d';
import TextureCube from '../assets/texture-cube';
import TextureSprite from '../assets/texture-sprite';
import Sprite from '../assets/sprite';

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

  opts.images = img;
  opts.mipmap = true;
  opts.width = img[0].width;
  opts.height = img[0].height;
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

function createTextureCube(device, imgs, json) {
  let asset = new TextureCube();
  let opts = {};

  opts.images = imgs;
  opts.mipmap = true;
  opts.width = imgs[0][0].width;
  opts.height = imgs[0][0].height;
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
  asset._opts.anisotropy = opts.anisotropy;
  asset._opts.minFilter = opts.minFilter;
  asset._opts.magFilter = opts.magFilter;
  asset._opts.mipFilter = opts.mipFilter;
  asset._opts.wrapS = opts.wrapS;
  asset._opts.wrapT = opts.wrapT;
  return asset;
}

function createTextureSprite(device, img, json) {
  let asset = new TextureSprite();
  let opts = {};

  opts.images = img;
  opts.mipmap = true;
  opts.width = img[0].width;
  opts.height = img[0].height;
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

  // create & commit sprites (asset)
  if (json && json.sprites) {
    for (let name in json.sprites) {
      let spriteJson = json.sprites[name];
      let sprite = new Sprite();
      sprite._name = name;
      sprite._rotated = spriteJson.rotated;
      sprite._x = spriteJson.x;
      sprite._y = spriteJson.y;
      sprite._width = spriteJson.width;
      sprite._height = spriteJson.height;
      sprite._left = spriteJson.left || 0;
      sprite._right = spriteJson.right || 0;
      sprite._top = spriteJson.top || 0;
      sprite._bottom = spriteJson.bottom || 0;
      sprite._texture = asset;
      sprite.commit();

      asset._sprites[name] = sprite;
    }
  }

  return asset;
}

export default function (app, urls, callback) {
  let manifest = {};
  let maxLevel = 0;

  for (let name in urls) {
    if (name.indexOf('image') === 0) {
      let l = parseInt(name.split('@')[1]);
      if (l > maxLevel) {
        maxLevel = l;
      }

      manifest[name] = {
        type: 'image',
        src: urls[name]
      };
    }
  }
  maxLevel += 1;

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
      let json = data.json;
      let images = [];
      let textureAsset;
      let type = json ? json.type : '2d';

      if (type === '2d' || type === 'sprite') {
        for (let l = 0; l < maxLevel; ++l) {
          if (l === 0) {
            images.push(
              data.image
            );
          } else {
            images.push(
              data[`image@${l}`]
            );
          }
        }

        if (type === '2d') {
          textureAsset = createTexture2D(app.device, images, json);
        } else if (type === 'sprite') {
          textureAsset = createTextureSprite(app.device, images, json);
        }
      } else if (type === 'cube') {
        for (let l = 0; l < maxLevel; ++l) {
          if (l === 0) {
            images.push([
              data.imagePosX,
              data.imageNegX,
              data.imagePosY,
              data.imageNegY,
              data.imagePosZ,
              data.imageNegZ
            ]);
          } else {
            images.push([
              data[`imagePosX@${l}`],
              data[`imageNegX@${l}`],
              data[`imagePosY@${l}`],
              data[`imageNegY@${l}`],
              data[`imagePosZ@${l}`],
              data[`imageNegZ@${l}`]
            ]);
          }
        }

        // const { json, imagePosX, imageNegX, imagePosY, imageNegY, imagePosZ, imageNegZ } = data;
        textureAsset = createTextureCube(app.device, images, json);
      }

      callback(null, textureAsset);
    }
  });
}
