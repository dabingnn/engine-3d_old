import gltfUtils from './gltf-utils';
import Skeleton from '../renderer/skeleton';

export default function (app, gltf, bin, callback) {
  let joints = gltfUtils.createNodes(gltf.joints);
  let entities = gltfUtils.createEntities(app, gltf.nodes);

  // create skeleton
  let skeleton = new Skeleton();
  skeleton.setRoot(joints[0]);

  // create skins
  let skins = new Array(gltf.skins.length);
  for (let i = 0; i < gltf.skins.length; ++i) {
    let skin = gltfUtils.createSkin(gltf, bin, i);
    skins[i] = skin;
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

  // setup mesh & skin for node
  for (let i = 0; i < gltf.nodes.length; ++i) {
    let gltfNode = gltf.nodes[i];
    if (gltfNode.mesh !== undefined && gltfNode.skin !== undefined) {
      let skinningComp = entities[i].addComp('SkinningModel');
      skinningComp.mesh = meshes[gltfNode.mesh];
      skinningComp.skin = skins[gltfNode.skin];
    }
  }

  callback(null, rootEnt);
}