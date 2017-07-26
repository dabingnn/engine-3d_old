import gltfUtils from './gltf-utils';

export default function (app, gltf, bin, callback) {
  if (!gltf.meshes.length) {
    callback(new Error('No mesh in the gltf.'));
    return;
  }

  let meshAsset = gltfUtils.createMesh(app._device, gltf, bin, 0);
  callback(null, meshAsset);
}