import gfx from 'gfx.js';
import renderer from 'renderer.js';
import Mesh from '../assets/mesh';

const _type2size = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16,
};

export default function (app, gltf, bin, callback) {
  if (!gltf.meshes.length) {
    callback();
    return;
  }

  const gltfMesh = gltf.meshes[0];
  const accessors = gltf.accessors;
  const attributes = gltfMesh.primitives[0].attributes;
  const vbView = gltf.bufferViews[0];

  // create mesh-asset
  let meshAsset = new Mesh();
  meshAsset._meshes = new Array(gltfMesh.primitives.length);

  // create vertex-format
  let vfmt = [];

  if (attributes.POSITION !== undefined) {
    let acc = accessors[attributes.POSITION];
    vfmt.push({ name: gfx.ATTR_POSITION, type: acc.componentType, num: _type2size[acc.type] });
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
    app._device,
    new gfx.VertexFormat(vfmt),
    gfx.USAGE_STATIC,
    vbData,
    accessors[0].count
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
        app._device,
        ibAcc.componentType,
        gfx.USAGE_STATIC,
        ibData,
        ibAcc.count
      );
    }

    meshAsset._meshes[i] = new renderer.Mesh(vb, ib);
  }

  callback(null, meshAsset);
}