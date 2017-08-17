(() => {
  // var SPECTOR = require("spectorjs");

  // var spector = new SPECTOR.Spector();
  // spector.displayUI();

  const app = window.app;
  const cc = window.cc;

  const resl = cc.resl;
  const gfx = cc.gfx;
  const { Node, PhongMaterial } = cc;
  const { vec2, vec3, color3, color4, quat, randomRange } = cc.math;
  const { Scene, Model, Light } = cc.renderer;
  const { box } = cc.primitives;

  // create mesh
  let meshBox = cc.utils.createMesh(app, box(1, 1, 1, {
    widthSegments: 1,
    heightSegments: 1,
    lengthSegments: 1,
  }));

  // create groundmaterial
  let groundmaterial = new PhongMaterial({
  });
  groundmaterial.blendType = cc.BLEND_NONE;
  let assetsSrc = '../node_modules/assets-3d';

  resl({
    manifest: {
      image: {
        type: 'image',
        src: `${assetsSrc}/textures/uv_checker_02.jpg`
      },
    },
    onDone(assets) {
      let image = assets.image;
      let texture = new gfx.Texture2D(app.device, {
        width: image.width,
        height: image.height,
        wrapS: gfx.WRAP_REPEAT,
        wrapT: gfx.WRAP_REPEAT,
        mipmap: true,
        images: [image]
      });
      groundmaterial.useDiffuseTexture = true;
      groundmaterial.diffuseTexture = texture;
      groundmaterial.diffuseUVTiling = vec2.new(10, 10);
    }
  });

  // scene
  let scene = new Scene();

  // light
  for (let index = 0; index < 1; ++index) {
    let entity = app.createEntity(`light_${index}`);
    let light = entity.addComp('Light');
    quat.fromEuler(entity.lrot,
      randomRange(-10, -70),
      randomRange(0, 0),
      randomRange(0, 0)
    );
    light.setColor(randomRange(0.5, 0.5), randomRange(0.5, 0.5), randomRange(0.5, 0.5));
  }

  // big plane
  let plane = null;
  {
    let entity = app.createEntity(`plane`);
    let com = entity.addComp('Model');
    plane = com;
    vec3.set(entity.lpos, 0, -10, 0);
    vec3.set(entity.lscale, 100, 0.1, 100);
    com.mesh = meshBox;
    com.material = groundmaterial;
  }

  let paladin = {
    gltf: {
      type: 'text',
      parser: JSON.parse,
      src: `${assetsSrc}/models/Paladin/Paladin_w_Prop_J_Nordstrom_6e101c6123cad4071a9442b6463e7611.gltf`
    },
    bin: {
      type: 'binary',
      src: `${assetsSrc}/models/Paladin/Paladin_w_Prop_J_Nordstrom_6e101c6123cad4071a9442b6463e7611.bin`
    },
    image: {
      type: 'image',
      src: `${assetsSrc}/models/Paladin/Paladin_diffuse.png`
    },
    specualarMap: {
      type: 'image',
      src: `${assetsSrc}/models/Paladin/Paladin_specular.png`
    },
    normalMap: {
      type: 'image',
      src: `${assetsSrc}/models/Paladin/Paladin_normal.png`
    },
    animGltf: {
      type: 'text',
      parser: JSON.parse,
      src: `${assetsSrc}/anims/Paladin_ctrl_c8c64eecdcc8d43b882f479bf2a936d3.gltf`
    },
    animBin: {
      type: 'binary',
      src: `${assetsSrc}/anims/Paladin_ctrl_c8c64eecdcc8d43b882f479bf2a936d3.bin`
    },
  };

  resl({
    manifest: paladin,

    onDone(assets) {
      // create material
      let diffuseMap = new gfx.Texture2D(app.device, {
        width: assets.image.width,
        height: assets.image.height,
        wrapS: gfx.WRAP_CLAMP,
        wrapT: gfx.WRAP_CLAMP,
        mipmap: true,
        images: [assets.image]
      });
      let specularMap = new gfx.Texture2D(app.device, {
        width: assets.specualarMap.width,
        height: assets.specualarMap.height,
        wrapS: gfx.WRAP_CLAMP,
        wrapT: gfx.WRAP_CLAMP,
        mipmap: true,
        images: [assets.specualarMap]
      });
      let normalMap = new gfx.Texture2D(app.device, {
        width: assets.normalMap.width,
        height: assets.normalMap.height,
        wrapS: gfx.WRAP_CLAMP,
        wrapT: gfx.WRAP_CLAMP,
        mipmap: true,
        images: [assets.normalMap]
      });

      let mtl = new PhongMaterial({});
      mtl.blendType = cc.BLEND_NONE;
      mtl.useDiffuseTexture = true;
      mtl.useSpecular = true;
      mtl.useSpecularTexture = true;
      mtl.useNormalTexture = true;
      mtl.diffuseTexture = diffuseMap;
      mtl.specularTexture = specularMap;
      mtl.glossiness = 30;
      mtl.normalTexture = normalMap;

      // create mesh
      cc.utils.loadSkin(app, assets.gltf, assets.bin, (err, root) => {

        // assign material to skinning model
        let comps = root.getCompsInChildren('SkinningModel');
        for (let i = 0; i < comps.length; ++i) {
          comps[i].material = mtl;
        }

        // load animations
        cc.utils.loadAnim(app, assets.animGltf, assets.animBin, (err, animClips) => {
          let animComp = root.getComp('Animation');
          for (let i = 0; i < animClips.length; ++i) {
            animComp.addClip(animClips[i]);
          }

          animComp.play('85_03');
        });
      });
    }
  });

  return scene;
})();