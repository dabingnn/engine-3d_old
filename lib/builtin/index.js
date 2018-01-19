import renderer from 'renderer.js';
import * as primitives from 'primitives.js';

import Mesh from '../assets/mesh';
import Material from '../assets/material';
import Texture2D from '../assets/texture-2d';
import TextureCube from '../assets/texture-cube';
import Effect from '../assets/effect';
import Sprite from '../assets/sprite';

import effectJsons from './effects/index';

export default function (device) {
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');

  // ============================
  // builtin textures
  // ============================

  // default texture canvas fill
  canvas.width = canvas.height = 128;
  context.fillStyle = '#ddd';
  context.fillRect(0, 0, 128, 128);
  context.fillStyle = '#555';
  context.fillRect(0, 0, 64, 64);
  context.fillStyle = '#555';
  context.fillRect(64, 64, 64, 64);

  // default-texture
  let defaultTexture = new Texture2D(device);
  defaultTexture.mipmap = true;
  defaultTexture.wrapS = 'repeat';
  defaultTexture.wrapT = 'repeat';
  defaultTexture.setImage(0, canvas);
  defaultTexture.commit();
  defaultTexture._uuid = 'default-texture';
  defaultTexture._loaded = true;

  // default-texture-cube
  let defaultTextureCube = new TextureCube(device);
  defaultTextureCube.setImages(
    [[canvas, canvas, canvas, canvas, canvas, canvas]]
  );
  defaultTexture.commit();
  defaultTextureCube._uuid = 'default-texture-cube';
  defaultTextureCube._loaded = true;

  // black texture canvas fill
  canvas.width = canvas.height = 2;
  context.fillStyle = '#000';
  context.fillRect(0, 0, 2, 2);

  // black-texture
  let blackTexture = new Texture2D(device);
  blackTexture.mipmap = false;
  blackTexture.wrapS = 'repeat';
  blackTexture.wrapT = 'repeat';
  blackTexture.minFilter = 'nearest';
  blackTexture.magFilter = 'nearest';
  blackTexture.setImage(0, canvas);
  blackTexture.commit();
  blackTexture._uuid = 'black-texture';
  blackTexture._loaded = true;

  // white texture canvas fill
  canvas.width = canvas.height = 2;
  context.fillStyle = '#fff';
  context.fillRect(0, 0, 2, 2);

  // white-texture
  let whiteTexture = new Texture2D(device);
  whiteTexture.mipmap = false;
  whiteTexture.wrapS = 'repeat';
  whiteTexture.wrapT = 'repeat';
  whiteTexture.minFilter = 'nearest';
  whiteTexture.magFilter = 'nearest';
  whiteTexture.setImage(0, canvas);
  whiteTexture.commit();
  whiteTexture._uuid = 'white-texture';
  whiteTexture._loaded = true;

  // ============================
  // builtin sprites
  // ============================

  // default-sprites
  let defaultSprite = new Sprite();
  defaultSprite._texture = whiteTexture;
  defaultSprite.width = whiteTexture.width;
  defaultSprite.height = whiteTexture.height;
  defaultSprite.commit();
  defaultSprite._uuid = 'default-sprite';
  defaultSprite._loaded = true;

  // ============================
  // builtin meshes
  // ============================

  // builtin-cube
  let cube = new Mesh();
  cube._subMeshes = new Array(1);
  cube._subMeshes[0] = renderer.createIA(
    device,
    primitives.box(1, 1, 1, {
      widthSegments: 1,
      heightSegments: 1,
      lengthSegments: 1,
    })
  );
  cube._uuid = 'builtin-cube';
  cube._loaded = true;

  // builtin-sphere
  let sphere = new Mesh();
  sphere._subMeshes = new Array(1);
  sphere._subMeshes[0] = renderer.createIA(
    device,
    primitives.sphere(0.5, {
      segments: 64,
    })
  );
  sphere._uuid = 'builtin-sphere';
  sphere._loaded = true;

  // builtin-cylinder
  let cylinder = new Mesh();
  cylinder._subMeshes = new Array(1);
  cylinder._subMeshes[0] = renderer.createIA(
    device,
    primitives.cylinder(0.5, 0.5, 2, {
      radialSegments: 20,
      capped: true,
    })
  );
  cylinder._uuid = 'builtin-cylinder';
  cylinder._loaded = true;

  // builtin-plane
  let plane = new Mesh();
  plane._subMeshes = new Array(1);
  plane._subMeshes[0] = renderer.createIA(
    device,
    primitives.plane(10, 10, {
      uSegments: 10,
      vSegments: 10,
    })
  );
  plane._uuid = 'builtin-plane';
  plane._loaded = true;

  // builtin-capsule
  let capsule = new Mesh();
  capsule._subMeshes = new Array(1);
  capsule._subMeshes[0] = renderer.createIA(
    device,
    primitives.capsule()
  );
  capsule._uuid = 'builtin-capsule';
  capsule._loaded = true;

  // ============================
  // builtin effects
  // ============================

  let effects = {};
  for (let i = 0; i < effectJsons.length; ++i) {
    let effectJson = effectJsons[i];
    let effect = new Effect();
    effect._name = effectJson.name;
    effect._uuid = `builtin-effect-${effectJson.name}`;
    effect._loaded = true;
    effect.techniques = effectJson.techniques;
    effect.properties = effectJson.properties;
    effect.defines = effectJson.defines;
    effects[effect._uuid] = effect;
  }

  // ============================
  // builtin materials
  // ============================

  let materials = {};
  [
    'sprite'
  ].forEach(name => {
    let mat = new Material();
    mat.effect = effects[`builtin-effect-${name}`];
    mat._uuid = `builtin-material-${name}`;
    mat._loaded = true;
    materials[mat._uuid] = mat;
  });

  //
  return Object.assign({
    [defaultTexture._uuid]: defaultTexture,
    [defaultTextureCube._uuid]: defaultTextureCube,
    [blackTexture._uuid]: blackTexture,
    [whiteTexture._uuid]: whiteTexture,
    [defaultSprite._uuid]: defaultSprite,
    [cube._uuid]: cube,
    [sphere._uuid]: sphere,
    [cylinder._uuid]: cylinder,
    [plane._uuid]: plane,
    [capsule._uuid]: capsule,
  }, effects, materials);
}