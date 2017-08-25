import gltfUtils from './utils/gltf-utils';
import resl from '../misc/resl';

export default function (app, urls, callback) {
  resl({
    manifest: {
      gltf: {
        type: 'text',
        parser: JSON.parse,
        src: urls.gltf,
      },
      bin: {
        type: 'binary',
        src: urls.bin
      }
    },

    onDone(data) {
      const { gltf, bin } = data;

      // create skins
      let anims = new Array(gltf.animations.length);
      for (let i = 0; i < gltf.animations.length; ++i) {
        let animClip = gltfUtils.createAnimationClip(gltf, bin, i);
        anims[i] = animClip;
      }

      callback(null, anims);
    }
  });
}