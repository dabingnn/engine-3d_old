(() => {
  const app = window.app;
  const cc = window.cc;

  const resl = cc.resl;
  const gfx = cc.gfx;
  const { StandardMaterial, SkinningModel } = cc;
  const { Scene } = cc.renderer;
  const { color4 } = cc.math;

  // scene
  let scene = new Scene();
  let skinningModels = [];

  let src = '../node_modules/assets-3d';

  class AnimTicker extends cc.ScriptComponent {
    constructor() {
      super();

      this._clip = null;
      this._time = 0.0;
      this._skeleton = null;
    }

    update() {
      let clip = this._clip;
      if (clip) {
        clip.sample(this._skeleton, this._time);
        let dt = this._engine.deltaTime;

        this._time += dt;
        this._time %= clip._length;
      }
    }
  }
  app.registerClass('AnimTicker', AnimTicker);

  let ent = app.createEntity();
  let animTicker = ent.addComp('AnimTicker');

  let paladin = {
    gltf: {
      type: 'text',
      parser: JSON.parse,
      src: `${src}/models/Paladin/Paladin_w_Prop_J_Nordstrom_6e101c6123cad4071a9442b6463e7611.gltf`
    },
    bin: {
      type: 'binary',
      src: `${src}/models/Paladin/Paladin_w_Prop_J_Nordstrom_6e101c6123cad4071a9442b6463e7611.bin`
    },
    image: {
      type: 'image',
      src: `${src}/models/Paladin/Paladin_diffuse.png`
    },
    animGltf: {
      type: 'text',
      parser: JSON.parse,
      src: `${src}/anims/Paladin_ctrl_c8c64eecdcc8d43b882f479bf2a936d3.gltf`
    },
    animBin: {
      type: 'binary',
      src: `${src}/anims/Paladin_ctrl_c8c64eecdcc8d43b882f479bf2a936d3.bin`
    },
  };

  let zed = {
    gltf: {
      type: 'text',
      parser: JSON.parse,
      src: `${src}/models/Zed/Zed_cc6b438d631553f468aac60d3bd4d450.gltf`
    },
    bin: {
      type: 'binary',
      src: `${src}/models/Zed/Zed_cc6b438d631553f468aac60d3bd4d450.bin`
    },
    image: {
      type: 'image',
      src: `${src}/models/Zed/Zed_base_TX_CM.png`
    },
    animGltf: {
      type: 'text',
      parser: JSON.parse,
      src: `${src}/anims/Zed_cc6b438d631553f468aac60d3bd4d450.gltf`
    },
    animBin: {
      type: 'binary',
      src: `${src}/anims/Zed_cc6b438d631553f468aac60d3bd4d450.bin`
    },
  };

  resl({
    manifest: paladin,

    onDone (assets) {
      cc.utils.loadSkin(app, assets.gltf, assets.bin, (err, info) => {
        let skeleton = info.skeleton.clone();
        let mainTexture = new gfx.Texture2D(app.device, {
          width: assets.image.width,
          height: assets.image.height,
          wrapS: gfx.WRAP_CLAMP,
          wrapT: gfx.WRAP_CLAMP,
          mipmap: true,
          images: [assets.image]
        });

        for (let i = 0; i < info.nodes.length; ++i) {
          let node = info.nodes[i];
          if (node.mesh && node.skin) {
            let skinningModel = new SkinningModel();
            skinningModel.setNode(node);

            // set mesh
            let mesh = node.mesh;
            for (let i = 0; i < mesh.subMeshCount; ++i) {
              skinningModel.addMesh(mesh.getSubMesh(i));
            }

            // set skin
            let skin = node.skin;
            skinningModel.setSkin(skin);
            skinningModel.setSkeleton(skeleton);
            skinningModel.setJointsTexture(cc.utils.createJointsTexture(app._device, skin));

            // set material
            let material = new StandardMaterial({
              mainTexture,
              color: color4.new(1.0, 1.0, 1.0, 0.6),
            });
            material.useColor = true;
            material.useTexture = true;
            material.blendType = cc.BLEND_NONE;
            skinningModel.addEffect(material._effect);

            skinningModels.push(skinningModel);
            scene.addModel(skinningModel);
          }
        }

        // load animations
        cc.utils.loadAnim(app, assets.animGltf, assets.animBin, (err, animClips) => {
          animTicker._clip = animClips[0];
          animTicker._skeleton = skeleton;

          // // let clip = animClips[15];
          // let clip = animClips[0];
          // let t = 0;

          // setInterval(() => {
          //   t += 0.01;
          //   t %= clip._length;

          //   clip.sample(skeleton, t);
          // }, 10);
        });
      });
    }
  });

  return scene;
})();