import gltfUtils from './utils/gltf-utils';
import resl from '../misc/resl';

export default function (app, urls, callback) {
  resl({
    manifest: {
      mesh: {
        type: 'text',
        parser: JSON.parse,
        src: urls.mesh,
      },
      bin: {
        type: 'binary',
        src: urls.bin
      }
    },

    onDone(data) {
      const { mesh, bin } = data;

      if (!mesh.meshes.length) {
        callback(new Error('No mesh in the gltf.'));
        return;
      }

      let meshAsset = gltfUtils.createMesh(app.device, mesh, bin, 0);
      callback(null, meshAsset);
    }
  });
}