import gfx from '../../gfx';
import renderer from '../../renderer';
import { vec3, quat, mat4 } from '../../vmath';
import { Node } from '../../scene-graph';
import Mesh from '../../assets/mesh';
import AnimationClip from '../../assets/animation-clip';
import Joints from '../../assets/joints';

const _type2size = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16,
};

const _compType2Array = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5124: Int32Array,
  5125: Uint32Array,
  5126: Float32Array,
};

/**
 * @param {object} gltf
 * @param {ArrayBuffer} bin
 * @param {number} accessorID
 */
function createArray(gltf, bin, accessorID) {
  let acc = gltf.accessors[accessorID];
  let bufView = gltf.bufferViews[acc.bufferView];

  let num = _type2size[acc.type];
  let typedArray = _compType2Array[acc.componentType];
  let result = new typedArray(bin, bufView.byteOffset + acc.byteOffset, acc.count * num);

  return result;
}

/**
 * @param {Array} gltfNodes
 */
function createNodes(gltfNodes) {
  let nodes = new Array(gltfNodes.length);

  for (let i = 0; i < gltfNodes.length; ++i) {
    let gltfNode = gltfNodes[i];
    let node = new Node(gltfNode.name);

    if (gltfNode.translation) {
      vec3.set(
        node.lpos,
        gltfNode.translation[0],
        gltfNode.translation[1],
        gltfNode.translation[2]
      );
    }

    if (gltfNode.rotation) {
      quat.set(
        node.lrot,
        gltfNode.rotation[0],
        gltfNode.rotation[1],
        gltfNode.rotation[2],
        gltfNode.rotation[3]
      );
    }

    if (gltfNode.scale) {
      vec3.set(
        node.lscale,
        gltfNode.scale[0],
        gltfNode.scale[1],
        gltfNode.scale[2]
      );
    }

    nodes[i] = node;
  }

  for (let i = 0; i < gltfNodes.length; ++i) {
    let gltfNode = gltfNodes[i];
    let node = nodes[i];

    if ( gltfNode.children ) {
      for (let j = 0; j < gltfNode.children.length; ++j) {
        let index = gltfNode.children[j];
        node.append(nodes[index]);
      }
    }
  }

  return nodes;
}

/**
 * @param {App} app
 * @param {Array} gltfNodes
 */
function createEntities(app, gltfNodes) {
  let nodes = new Array(gltfNodes.length);

  for (let i = 0; i < gltfNodes.length; ++i) {
    let gltfNode = gltfNodes[i];
    let node = app.createEntity(gltfNode.name);

    if (gltfNode.translation) {
      vec3.set(
        node.lpos,
        gltfNode.translation[0],
        gltfNode.translation[1],
        gltfNode.translation[2]
      );
    }

    if (gltfNode.rotation) {
      quat.set(
        node.lrot,
        gltfNode.rotation[0],
        gltfNode.rotation[1],
        gltfNode.rotation[2],
        gltfNode.rotation[3]
      );
    }

    if (gltfNode.scale) {
      vec3.set(
        node.lscale,
        gltfNode.scale[0],
        gltfNode.scale[1],
        gltfNode.scale[2]
      );
    }

    nodes[i] = node;
  }

  for (let i = 0; i < gltfNodes.length; ++i) {
    let gltfNode = gltfNodes[i];
    let node = nodes[i];

    if ( gltfNode.children ) {
      for (let j = 0; j < gltfNode.children.length; ++j) {
        let index = gltfNode.children[j];
        node.append(nodes[index]);
      }
    }
  }

  return nodes;
}

/**
 * @param {App} app
 * @param {Object} gltf
 * @param {ArrayBuffer} bin
 * @param {number} index
 */
function createMesh(app, gltf, bin, index) {
  if ( index >= gltf.meshes.length ) {
    return null;
  }

  const gltfMesh = gltf.meshes[index];
  const accessors = gltf.accessors;
  const attributes = gltfMesh.primitives[0].attributes;
  let vbView = null;

  // create mesh-asset
  let meshAsset = new Mesh();
  meshAsset._name = gltfMesh.name;
  meshAsset._subMeshes = new Array(gltfMesh.primitives.length);

  // create vertex-format
  let vfmt = [];
  let vcount = 0;

  if (attributes.POSITION !== undefined) {
    let acc = accessors[attributes.POSITION];
    vfmt.push({ name: gfx.ATTR_POSITION, type: acc.componentType, num: _type2size[acc.type] });

    vcount = acc.count;
    vbView = gltf.bufferViews[acc.bufferView];

    meshAsset._minPos = vec3.new(acc.min[0], acc.min[1], acc.min[2]);
    meshAsset._maxPos = vec3.new(acc.max[0], acc.max[1], acc.max[2]);
  }

  if (attributes.NORMAL !== undefined) {
    let acc = accessors[attributes.NORMAL];
    vfmt.push({ name: gfx.ATTR_NORMAL, type: acc.componentType, num: _type2size[acc.type] });
  }

  if (attributes.TANGENT !== undefined) {
    let acc = accessors[attributes.TANGENT];
    vfmt.push({ name: gfx.ATTR_TANGENT, type: acc.componentType, num: _type2size[acc.type] });
  }

  if (attributes.TEXCOORD_0 !== undefined) {
    let acc = accessors[attributes.TEXCOORD_0];
    vfmt.push({ name: gfx.ATTR_UV0, type: acc.componentType, num: _type2size[acc.type] });
  }

  if (attributes.TEXCOORD_1 !== undefined) {
    let acc = accessors[attributes.TEXCOORD_1];
    vfmt.push({ name: gfx.ATTR_UV1, type: acc.componentType, num: _type2size[acc.type] });
  }

  if (attributes.TEXCOORD_2 !== undefined) {
    let acc = accessors[attributes.TEXCOORD_2];
    vfmt.push({ name: gfx.ATTR_UV2, type: acc.componentType, num: _type2size[acc.type] });
  }

  if (attributes.TEXCOORD_3 !== undefined) {
    let acc = accessors[attributes.TEXCOORD_3];
    vfmt.push({ name: gfx.ATTR_UV3, type: acc.componentType, num: _type2size[acc.type] });
  }

  if (attributes.COLOR_0 !== undefined) {
    let acc = accessors[attributes.COLOR_0];
    vfmt.push({ name: gfx.ATTR_COLOR0, type: acc.componentType, num: _type2size[acc.type] });
  }

  if (attributes.JOINTS_0 !== undefined) {
    let acc = accessors[attributes.JOINTS_0];
    vfmt.push({ name: gfx.ATTR_JOINTS, type: acc.componentType, num: _type2size[acc.type] });
  }

  if (attributes.WEIGHTS_0 !== undefined) {
    let acc = accessors[attributes.WEIGHTS_0];
    vfmt.push({ name: gfx.ATTR_WEIGHTS, type: acc.componentType, num: _type2size[acc.type] });
  }

  // create vertex-buffer
  let vbData = new Uint8Array(bin, vbView.byteOffset, vbView.byteLength);
  let vb = new gfx.VertexBuffer(
    app.device,
    new gfx.VertexFormat(vfmt),
    gfx.USAGE_STATIC,
    vbData,
    vcount
  );

  // create index-buffer
  for (let i = 0; i < gltfMesh.primitives.length; ++i) {
    let primitive = gltfMesh.primitives[i];
    let ib = null;

    if (primitive.indices !== undefined) {
      let ibAcc = accessors[primitive.indices];
      let ibView = gltf.bufferViews[ibAcc.bufferView];
      let ibData = new Uint8Array(bin, ibView.byteOffset, ibView.byteLength);

      ib = new gfx.IndexBuffer(
        app.device,
        ibAcc.componentType,
        gfx.USAGE_STATIC,
        ibData,
        ibAcc.count
      );
    }

    meshAsset._subMeshes[i] = new renderer.InputAssembler(vb, ib);
  }

  // create skinning if we found
  if (gltf.skins) {
    for (let i = 0; i < gltf.skins.length; ++i) {
      if (gltf.skins[i].name === gltfMesh.name) {
        meshAsset._skinning = createSkinning(gltf, bin, i);
      }
    }
  }

  return meshAsset;
}

/**
 * @param {Object} gltf
 * @param {ArrayBuffer} bin
 * @param {number} index
 */
function createSkinning(gltf, bin, index) {
  if ( index >= gltf.skins.length ) {
    return null;
  }

  let gltfSkin = gltf.skins[index];

  // extract bindposes mat4 data
  let accessor = gltf.accessors[gltfSkin.inverseBindMatrices];
  let bufView = gltf.bufferViews[accessor.bufferView];
  let data = new Float32Array(bin, bufView.byteOffset + accessor.byteOffset, accessor.count * 16);
  let bindposes = new Array(accessor.count);

  for (let i = 0; i < accessor.count; ++i) {
    bindposes[i] = mat4.new(
      data[16 * i + 0 ], data[16 * i + 1 ], data[16 * i + 2 ], data[16 * i + 3 ],
      data[16 * i + 4 ], data[16 * i + 5 ], data[16 * i + 6 ], data[16 * i + 7 ],
      data[16 * i + 8 ], data[16 * i + 9 ], data[16 * i + 10], data[16 * i + 11],
      data[16 * i + 12], data[16 * i + 13], data[16 * i + 14], data[16 * i + 15]
    );
  }

  return {
    jointIndices: gltfSkin.joints,
    bindposes,
  };
}

/**
 * @param {Object} gltf
 * @param {ArrayBuffer} bin
 * @param {number} index
 */
function createAnimationClip(gltf, bin, index) {
  if ( index >= gltf.animations.length ) {
    return null;
  }

  let gltfAnimation = gltf.animations[index];
  let framesList = [];
  let maxLength = -1;

  for (let i = 0; i < gltfAnimation.channels.length; ++i) {
    let gltfChannel = gltfAnimation.channels[i];
    let inputAcc = gltf.accessors[gltfChannel.input];

    // find frames by input name
    let frames;
    for (let j = 0; j < framesList.length; ++j) {
      if (framesList[j].name === inputAcc.name) {
        frames = framesList[j];
        break;
      }
    }

    // if not found, create one
    if (!frames) {
      let inArray = createArray(gltf, bin, gltfChannel.input);
      let inputs = new Array(inArray.length);
      for (let i = 0; i < inArray.length; ++i) {
        let t = inArray[i];
        inputs[i] = t;

        if (maxLength < t) {
          maxLength = t;
        }
      }

      frames = {
        name: inputAcc.name,
        times: inputs,
        joints: [],
      };
      framesList.push(frames);
    }

    // find output frames by node id
    let jointFrames;
    for (let j = 0; j < frames.joints.length; ++j) {
      if (frames.joints[j].id === gltfChannel.node) {
        jointFrames = frames.joints[j];
        break;
      }
    }

    // if not found, create one
    if (!jointFrames) {
      jointFrames = {
        id: gltfChannel.node
      };
      frames.joints.push(jointFrames);
    }

    let outArray = createArray(gltf, bin, gltfChannel.output);
    if (gltfChannel.path === 'translation') {
      let cnt = outArray.length / 3;
      jointFrames.translations = new Array(cnt);
      for (let i = 0; i < cnt; ++i) {
        jointFrames.translations[i] = vec3.new(
          outArray[3 * i + 0],
          outArray[3 * i + 1],
          outArray[3 * i + 2]
        );
      }
    } else if (gltfChannel.path === 'rotation') {
      let cnt = outArray.length / 4;
      jointFrames.rotations = new Array(cnt);
      for (let i = 0; i < cnt; ++i) {
        jointFrames.rotations[i] = quat.new(
          outArray[4 * i + 0],
          outArray[4 * i + 1],
          outArray[4 * i + 2],
          outArray[4 * i + 3]
        );
      }
    } else if (gltfChannel.path === 'scale') {
      let cnt = outArray.length / 3;
      jointFrames.scales = new Array(cnt);
      for (let i = 0; i < cnt; ++i) {
        jointFrames.scales[i] = vec3.new(
          outArray[3 * i + 0],
          outArray[3 * i + 1],
          outArray[3 * i + 2]
        );
      }
    }
  }

  let animClip = new AnimationClip();
  animClip._name = gltfAnimation.name;
  animClip._framesList = framesList;
  animClip._length = maxLength;

  return animClip;
}

/**
 * @param {object} gltf
 */
function createJoints (gltf) {
  let joints = new Joints();
  joints._name = gltf.joints[0].name;
  joints._nodes = gltf.joints;

  return joints;
}

export default {
  createArray,
  createNodes,
  createEntities,
  createMesh,
  createSkinning,
  createAnimationClip,
  createJoints,
};