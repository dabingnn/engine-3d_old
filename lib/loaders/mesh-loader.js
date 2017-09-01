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

      if (!gltf.meshes.length) {
        callback(new Error('No mesh in the gltf.'));
        return;
      }

      let meshAsset = gltfUtils.createMesh(app.device, gltf, bin, 0);
      callback(null, meshAsset);
    }
  });
}