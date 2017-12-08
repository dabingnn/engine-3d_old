import gltfUtils from './utils/gltf-utils';
import resl from '../misc/resl';

export default function (app, urls, callback) {
  resl({
    manifest: {
      // a gltf-like json file
      anim: {
        type: 'text',
        parser: JSON.parse,
        src: urls.anim,
      },
      bin: {
        type: 'binary',
        src: urls.bin
      }
    },

    onDone(data) {
      const { anim, bin } = data;

      if (!anim.animations.length) {
        callback(new Error('No animation in the gltf.'));
        return;
      }

      let animClip = gltfUtils.createAnimationClip(anim, bin, 0);
      callback(null, animClip);
    }
  });
}