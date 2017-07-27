import gfx from 'gfx.js';
import renderer from 'renderer.js';
import { vec3, quat, mat4 } from 'vmath';
import { Node } from 'scene-graph';
import Mesh from '../assets/mesh';
import Skin from '../assets/skin';

const _type2size = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16,
};

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
 * @param {gfx.Device} device
 * @param {Object} gltf
 * @param {ArrayBuffer} bin
 * @param {number} index
 */
function createMesh(device, gltf, bin, index) {
  if ( index >= gltf.meshes.length ) {
    return null;
  }

  const gltfMesh = gltf.meshes[index];
  const accessors = gltf.accessors;
  const attributes = gltfMesh.primitives[0].attributes;
  let vbView = null;

  // create mesh-asset
  let meshAsset = new Mesh();
  meshAsset._meshes = new Array(gltfMesh.primitives.length);

  // create vertex-format
  let vfmt = [];
  let vcount = 0;

  if (attributes.POSITION !== undefined) {
    let acc = accessors[attributes.POSITION];
    vfmt.push({ name: gfx.ATTR_POSITION, type: acc.componentType, num: _type2size[acc.type] });

    vcount = acc.count;
    vbView = gltf.bufferViews[acc.bufferView];
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
    device,
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
        device,
        ibAcc.componentType,
        gfx.USAGE_STATIC,
        ibData,
        ibAcc.count
      );
    }

    meshAsset._meshes[i] = new renderer.Mesh(vb, ib);
  }

  return meshAsset;
}

/**
 * @param {Object} gltf
 * @param {ArrayBuffer} bin
 * @param {number} index
 */
function createSkin(gltf, bin, index) {
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

  let skinAsset = new Skin();

  skinAsset._jointIndices = gltfSkin.joints;
  skinAsset._bindposes = bindposes;

  return skinAsset;
}

export default {
  createNodes,
  createMesh,
  createSkin,
};