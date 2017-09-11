(() => {
  const app = window.app;
  const cc = window.cc;

  const resl = cc.resl;
  const gfx = cc.gfx;
  const { SkyboxMaterial } = cc;
  const { vec3, color4, quat, randomRange } = cc.math;
  const { box } = cc.primitives;

  // create mesh
  let meshBox = cc.utils.createMesh(app, box(2, 2, 2, {
    widthSegments: 1,
    heightSegments: 1,
    lengthSegments: 1,
  }));
  const urls = {
    json: './skybox/skybox.json',
    image_posX: './skybox/skybox_px.jpg',
    image_negX: './skybox/skybox_nx.jpg',
    image_posY: './skybox/skybox_py.jpg',
    image_negY: './skybox/skybox_ny.jpg',
    image_posZ: './skybox/skybox_pz.jpg',
    image_negZ: './skybox/skybox_nz.jpg',
  };
  const _filterMap = {
    linear: gfx.FILTER_LINEAR,
    nearest: gfx.FILTER_NEAREST,
  };

  const _wrapMap = {
    repeat: gfx.WRAP_REPEAT,
    clamp: gfx.WRAP_CLAMP,
    mirror: gfx.WRAP_MIRROR,
  };
  
  let ent = app.createEntity(`node_${0}`);
  let skyCmp = ent.addComp('Skybox');

  resl({
    manifest: {
      json: {
        type: 'text',
        parser: JSON.parse,
        src: urls.json,
      },
      image_posX: {
        type: 'image',
        src: urls.image_posX
      },
      image_negX: {
        type: 'image',
        src: urls.image_negX
      },
      image_posY: {
        type: 'image',
        src: urls.image_posY
      },
      image_negY: {
        type: 'image',
        src: urls.image_negY
      },
      image_posZ: {
        type: 'image',
        src: urls.image_posZ
      },
      image_negZ: {
        type: 'image',
        src: urls.image_negZ
      },
    },

    onDone(data) {
      const { json, image_posX, image_negX, image_posY, image_negY, image_posZ, image_negZ } = data;
      let imgs = [image_posX, image_negX, image_posY, image_negY, image_posZ, image_negZ];
      let asset = new cc.TextureCube();
      let opts = {};
      opts.images = [imgs];
      opts.mipmap = true;
      opts.width = imgs[0].width;
      opts.height = imgs[0].height;
      opts.format = gfx.TEXTURE_FMT_RGBA8;
      opts.anisotropy = json.anisotropy;
      opts.minFilter = _filterMap[json.minFilter];
      opts.magFilter = _filterMap[json.magFilter];
      opts.mipFilter = _filterMap[json.mipFilter];
      opts.wrapS = _wrapMap[json.wrapS];
      opts.wrapT = _wrapMap[json.wrapT];

      let texture = new gfx.TextureCube(app.device, opts);
      asset._texture = texture;
      skyCmp.sky = texture;
    }
  });

})();