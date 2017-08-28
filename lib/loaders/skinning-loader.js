import gltfUtils from './utils/gltf-utils';
import Skeleton from '../renderer/skeleton';
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

      let joints = gltfUtils.createNodes(gltf.joints);
      let entities = gltfUtils.createEntities(app, gltf.nodes);

      // create skeleton
      let skeleton = new Skeleton();
      skeleton.setRoot(joints[0]);

      // create skins
      let skinnings = new Array(gltf.skins.length);
      for (let i = 0; i < gltf.skins.length; ++i) {
        let skinning = gltfUtils.createSkinning(gltf, bin, i);
        skinnings[i] = skinning;
      }

      // create meshes
      let meshes = new Array(gltf.meshes.length);
      for (let i = 0; i < gltf.meshes.length; ++i) {
        let mesh = gltfUtils.createMesh(app._device, gltf, bin, i);
        meshes[i] = mesh;
      }

      // setup skeleton
      let rootEnt = entities[0];
      let animComp = rootEnt.addComp('Animation');
      animComp.skeleton = skeleton;

      // setup mesh & skinning for node
      for (let i = 0; i < gltf.nodes.length; ++i) {
        let gltfNode = gltf.nodes[i];
        if (gltfNode.mesh !== undefined && gltfNode.skin !== undefined) {
          let skinningComp = entities[i].addComp('SkinningModel');
          skinningComp.mesh = meshes[gltfNode.mesh];
          skinningComp.skinning = skinnings[gltfNode.skin];
        }
      }

      callback(null, rootEnt);
    }
  });
}