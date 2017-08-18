import gltfUtils from './gltf-utils';

export default function (app, gltf, bin, callback) {
  // create skins
  let anims = new Array(gltf.animations.length);
  for (let i = 0; i < gltf.animations.length; ++i) {
    let animClip = gltfUtils.createAnimationClip(gltf, bin, i);
    anims[i] = animClip;
  }

  callback(null, anims);
}