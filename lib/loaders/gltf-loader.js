import gltfUtils from './utils/gltf-utils';
import resl from '../misc/resl';
import Gltf from '../assets/gltf';

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
      const {gltf, bin} = data;

      let gltfAsset = new Gltf();

      gltfAsset._nodes = gltf.nodes;

      if (gltf.meshes) {
        gltfAsset._meshes = new Array(gltf.meshes.length);
        for (let i = 0; i < gltf.meshes.length; ++i) {
          gltfAsset._meshes[i] = gltfUtils.createMesh(app, gltf, bin, i);
        }
      }

      if (gltf.joints) {
        gltfAsset._joints = gltfUtils.createJoints(gltf);
      }

      callback(null, gltfAsset);
    }
  });
}