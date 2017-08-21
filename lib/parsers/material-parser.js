import gfx from 'gfx.js';
import renderer from 'renderer.js';
const { Pass, Technique } = renderer;

const _stageMap = {
  opaque: renderer.STAGE_OPAQUE,
  transparent: renderer.STAGE_TRANSPARENT,
  shadowcast: renderer.STAGE_SHADOWCAST
};

const _paramTypeMap = {
  int: renderer.PARAM_INT,
  int2: renderer.PARAM_INT2,
  int3: renderer.PARAM_INT3,
  int4: renderer.PARAM_INT4,
  float: renderer.PARAM_FLOAT,
  float2: renderer.PARAM_FLOAT2,
  float3: renderer.PARAM_FLOAT3,
  float4: renderer.PARAM_FLOAT4,
  color3: renderer.PARAM_COLOR3,
  color4: renderer.PARAM_COLOR4,
  mat2: renderer.PARAM_MAT2,
  mat3: renderer.PARAM_MAT3,
  mat4: renderer.PARAM_MAT4,
  tex2d: renderer.PARAM_TEXTURE_2D,
  texcube: renderer.PARAM_TEXTURE_CUBE
};

const _cullMap = {
  none: gfx.CULL_NONE,
  front: gfx.CULL_FRONT,
  back: gfx.CULL_BACK,
  front_and_back: gfx.CULL_FRONT_AND_BACK
};

const _blendFuncMap = {
  add: gfx.BLEND_FUNC_ADD,
  sub: gfx.BLEND_FUNC_SUBTRACT,
  reverse_sub: gfx.BLEND_FUNC_REVERSE_SUBTRACT
};

const _blendFactorMap = {
  zero: gfx.BLEND_ZERO,
  one: gfx.BLEND_ONE,
  src_color: gfx.BLEND_SRC_COLOR,
  one_minus_src_color: gfx.BLEND_ONE_MINUS_SRC_COLOR,
  dst_color: gfx.BLEND_DST_COLOR,
  one_minus_dst_color: gfx.BLEND_ONE_MINUS_DST_COLOR,
  src_alpha: gfx.BLEND_SRC_ALPHA,
  one_minus_src_alpha: gfx.BLEND_ONE_MINUS_SRC_ALPHA,
  dst_alpha: gfx.BLEND_DST_ALPHA,
  one_minus_dst_alpha: gfx.BLEND_ONE_MINUS_DST_ALPHA,
  constant_color: gfx.BLEND_CONSTANT_COLOR,
  one_minus_constant_color: gfx.BLEND_ONE_MINUS_CONSTANT_COLOR,
  constant_alpha: gfx.BLEND_CONSTANT_ALPHA,
  one_minus_constant_alpha: gfx.BLEND_ONE_MINUS_CONSTANT_ALPHA,
  src_alpha_saturate: gfx.BLEND_SRC_ALPHA_SATURATE
};

const _dsFuncMap = {
  never: gfx.DS_FUNC_NEVER,
  less: gfx.DS_FUNC_LESS,
  equal: gfx.DS_FUNC_EQUAL,
  lequal: gfx.DS_FUNC_LEQUAL,
  greater: gfx.DS_FUNC_GREATER,
  notequal: gfx.DS_FUNC_NOTEQUAL,
  gequal: gfx.DS_FUNC_GEQUAL,
  always: gfx.DS_FUNC_ALWAYS
};

const _stencilOpMap = {
  keep: gfx.STENCIL_OP_KEEP,
  zero: gfx.STENCIL_OP_ZERO,
  replace: gfx.STENCIL_OP_REPLACE,
  incr: gfx.STENCIL_OP_INCR,
  incr_wrap: gfx.STENCIL_OP_INCR_WRAP,
  decr: gfx.STENCIL_OP_DECR,
  decr_wrap: gfx.STENCIL_OP_DECR_WRAP,
  inver: gfx.STENCIL_OP_INVERT
};

// blend packing 'func src dst'
function _parseBlend(data, callback) {
  let words = data.split(' ');
  callback && callback(_blendFuncMap[words[0]], _blendFactorMap[words[1]], _blendFactorMap[words[2]]);
}

// stencil packing 'func ref mask failOP zfailOp passOp writeMask'
function _parseStencil(data, callback) {
  let words = data.split(' ');
  callback && callback(_dsFuncMap[words[0]], parseInt(words[1]), parseInt(words[2]),
    _stencilOpMap[words[3]], _stencilOpMap[words[4]], _stencilOpMap[words[5]], parseInt(words[6]));
}

// depth packing 'func write'
function _parseDepth(data, callback) {
  let words = data.split(' ');
  callback && callback(_dsFuncMap[words[0]], (words[1] === 'true'));
}

export default function(app, jsonObj, callback) {
  let techniques = [];
  let mtl = jsonObj;

  mtl.techniques.forEach(techInfo => {
    // construct passes
    let passes = [];
    techInfo.passes.forEach(passInfo => {
      let pass = new Pass(passInfo.program);
      // blend
      if (passInfo.blend) {
        pass._blend = true;
        _parseBlend(passInfo.blend, (func, src, dst) => {
          pass._blendEq = func;
          pass._blendSrc = src;
          pass._blendDst = dst;
        });
        if (passInfo.blendAlpha) {
          _parseBlend(passInfo.blendAlpha, (func, src, dst) => {
            pass._blendAlphaEq = func;
            pass._blendSrcAlpha = src;
            pass._blendDstAlpha = dst;
          });
        } else {
          pass._blendAlphaEq = pass._blendEq;
          pass._blendSrcAlpha = pass._blendSrc;
          pass._blendDstAlpha = pass._blendDst;
        }
        if (passInfo.blendColor) {
          pass._blendColor = parseInt(passInfo.blendColor);
        }
      }
      // cull
      if (passInfo.cull) {
        pass._cullMode = _cullMap[passInfo.cull];
      }
      // depth
      if (passInfo.depth) {
        pass._depthTest = true;
        _parseDepth(passInfo.depth, (func, write) => {
          pass._depthFunc = func;
          pass._depthWrite = write;
        })
      }
      // stencil
      if (passInfo.stencil) {
        pass._stencilTest = true;
        // "func ref mask failOp zFailOp zPassOp writeMask"
        _parseStencil(passInfo.stencil, (func, ref, mask, failOp, zFailOp, zPassOp, writeMask) => {
          pass._stencilFuncFront = func;
          pass._stencilRefFront = func;
          pass._stencilMaskFront = mask;
          pass._stencilFailOpFront = failOp;
          pass._stencilZFailOpFront = zFailOp;
          pass._stencilZPassOpFront = zPassOp;
          pass._stencilWriteMaskFront = writeMask;
        });

        if (passInfo.stencilBack) {
          _parseStencil(passInfo.stencilBack, (func, ref, mask, failOp, zFailOp, zPassOp, writeMask) => {
            pass._stencilFuncBack = func;
            pass._stencilRefBack = func;
            pass._stencilMaskBack = mask;
            pass._stencilFailOpBack = failOp;
            pass._stencilZFailOpBack = zFailOp;
            pass._stencilZPassOpBack = zPassOp;
            pass._stencilWriteMaskBack = writeMask;
          });
        } else {
          pass._stencilFuncBack = pass._stencilFuncFront;
          pass._stencilRefBack = pass._stencilRefFront;
          pass._stencilMaskBack = pass._stencilMaskFront;
          pass._stencilFailOpBack = pass._stencilFailOpFront;
          pass._stencilZFailOpBack = pass._stencilZFailOpFront;
          pass._stencilZPassOpBack = pass._stencilZPassOpFront;
          pass._stencilWriteMaskBack = pass._stencilWriteMaskFront;
        }
      }
      passes.push(pass);
    });
    let stage = 0;
    techInfo.stages.split(' ').forEach(stageInfo => {
      stage = stage | _stageMap[stageInfo];
    });
    let params = [];
    for (let paramKey in techInfo.parameters) {
      params.push({
        name: paramKey,
        type: _paramTypeMap[techInfo.parameters[paramKey].type],
        size: techInfo.parameters.size
      });
    }
    let tech = new Technique(
      stage,
      params,
      passes
    );
    techniques.push(tech);
  });

  return techniques;
}