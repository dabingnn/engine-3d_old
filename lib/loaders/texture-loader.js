import resl from '../misc/resl';
import Texture2D from '../assets/texture-2d';
import TextureCube from '../assets/texture-cube';
import TextureSprite from '../assets/texture-sprite';
import Sprite from '../assets/sprite';

function createTexture2D(device, imgs, json) {
  let texture = new Texture2D(device);

  if (json) {
    texture.mipmap = json.mipmap;
    texture.anisotropy = json.anisotropy;
    texture.minFilter = json.minFilter;
    texture.magFilter = json.magFilter;
    texture.mipFilter = json.mipFilter;
    texture.wrapS = json.wrapS;
    texture.wrapT = json.wrapT;
  }

  texture.setImages(imgs);
  texture.commit();

  return texture;
}

function createTextureCube(device, imgs, json) {
  let texture = new TextureCube(device);

  if (json) {
    texture.mipmap = json.mipmap;
    texture.anisotropy = json.anisotropy;
    texture.minFilter = json.minFilter;
    texture.magFilter = json.magFilter;
    texture.mipFilter = json.mipFilter;
    texture.wrapS = json.wrapS;
    texture.wrapT = json.wrapT;
  }

  texture.setImages(imgs);
  texture.commit();

  return texture;
}

function createTextureSprite(device, imgs, json) {
  let texture = new TextureSprite(device);

  if (json) {
    texture.mipmap = json.mipmap;
    texture.anisotropy = json.anisotropy;
    texture.minFilter = json.minFilter;
    texture.magFilter = json.magFilter;
    texture.mipFilter = json.mipFilter;
    texture.wrapS = json.wrapS;
    texture.wrapT = json.wrapT;
  }

  texture.setImages(imgs);
  // NOTE: we need to commit texture first to get width & height so that sprites can commit correctly
  texture.commit();

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
      sprite._texture = texture;
      sprite.commit();

      texture._sprites[name] = sprite;
    }
  }

  return texture;
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
