
/*
 * engine-3d.js v0.5.0
 * (c) 2017 @Johnny Wu
 * Released under the MIT License.
 */

'use strict';

var GL_NEAREST = 9728;                // gl.NEAREST
var GL_LINEAR = 9729;                 // gl.LINEAR
var GL_NEAREST_MIPMAP_NEAREST = 9984; // gl.NEAREST_MIPMAP_NEAREST
var GL_LINEAR_MIPMAP_NEAREST = 9985;  // gl.LINEAR_MIPMAP_NEAREST
var GL_NEAREST_MIPMAP_LINEAR = 9986;  // gl.NEAREST_MIPMAP_LINEAR
var GL_LINEAR_MIPMAP_LINEAR = 9987;   // gl.LINEAR_MIPMAP_LINEAR

// const GL_BYTE = 5120;                  // gl.BYTE
var GL_UNSIGNED_BYTE = 5121;            // gl.UNSIGNED_BYTE
// const GL_SHORT = 5122;                 // gl.SHORT
var GL_UNSIGNED_SHORT = 5123;           // gl.UNSIGNED_SHORT
var GL_UNSIGNED_INT = 5125;             // gl.UNSIGNED_INT
var GL_FLOAT = 5126;                    // gl.FLOAT
var GL_UNSIGNED_SHORT_5_6_5 = 33635;    // gl.UNSIGNED_SHORT_5_6_5
var GL_UNSIGNED_SHORT_4_4_4_4 = 32819;  // gl.UNSIGNED_SHORT_4_4_4_4
var GL_UNSIGNED_SHORT_5_5_5_1 = 32820;  // gl.UNSIGNED_SHORT_5_5_5_1
var GL_HALF_FLOAT_OES = 36193;          // gl.HALF_FLOAT_OES

var GL_DEPTH_COMPONENT = 6402; // gl.DEPTH_COMPONENT

var GL_ALPHA = 6406;            // gl.ALPHA
var GL_RGB = 6407;              // gl.RGB
var GL_RGBA = 6408;             // gl.RGBA
var GL_LUMINANCE = 6409;        // gl.LUMINANCE
var GL_LUMINANCE_ALPHA = 6410;  // gl.LUMINANCE_ALPHA

var GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0;   // ext.COMPRESSED_RGB_S3TC_DXT1_EXT
var GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1;  // ext.COMPRESSED_RGBA_S3TC_DXT1_EXT
var GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2;  // ext.COMPRESSED_RGBA_S3TC_DXT3_EXT
var GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3;  // ext.COMPRESSED_RGBA_S3TC_DXT5_EXT

var GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;  // ext.COMPRESSED_RGB_PVRTC_4BPPV1_IMG
var GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;  // ext.COMPRESSED_RGB_PVRTC_2BPPV1_IMG
var GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02; // ext.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG
var GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03; // ext.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG

var GL_COMPRESSED_RGB_ETC1_WEBGL = 0x8D64; // ext.COMPRESSED_RGB_ETC1_WEBGL

var _filterGL = [
  [ GL_NEAREST,  GL_NEAREST_MIPMAP_NEAREST, GL_NEAREST_MIPMAP_LINEAR ],
  [ GL_LINEAR,  GL_LINEAR_MIPMAP_NEAREST, GL_LINEAR_MIPMAP_LINEAR ] ];

var _textureFmtGL = [
  // TEXTURE_FMT_RGB_DXT1: 0
  { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB_S3TC_DXT1_EXT, pixelType: null },

  // TEXTURE_FMT_RGBA_DXT1: 1
  { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_S3TC_DXT1_EXT, pixelType: null },

  // TEXTURE_FMT_RGBA_DXT3: 2
  { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_S3TC_DXT3_EXT, pixelType: null },

  // TEXTURE_FMT_RGBA_DXT5: 3
  { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_S3TC_DXT5_EXT, pixelType: null },

  // TEXTURE_FMT_RGB_ETC1: 4
  { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB_ETC1_WEBGL, pixelType: null },

  // TEXTURE_FMT_RGB_PVRTC_2BPPV1: 5
  { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG, pixelType: null },

  // TEXTURE_FMT_RGBA_PVRTC_2BPPV1: 6
  { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG, pixelType: null },

  // TEXTURE_FMT_RGB_PVRTC_4BPPV1: 7
  { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG, pixelType: null },

  // TEXTURE_FMT_RGBA_PVRTC_4BPPV1: 8
  { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG, pixelType: null },

  // TEXTURE_FMT_A8: 9
  { format: GL_ALPHA, internalFormat: GL_ALPHA, pixelType: GL_UNSIGNED_BYTE },

  // TEXTURE_FMT_L8: 10
  { format: GL_LUMINANCE, internalFormat: GL_LUMINANCE, pixelType: GL_UNSIGNED_BYTE },

  // TEXTURE_FMT_L8_A8: 11
  { format: GL_LUMINANCE_ALPHA, internalFormat: GL_LUMINANCE_ALPHA, pixelType: GL_UNSIGNED_BYTE },

  // TEXTURE_FMT_R5_G6_B5: 12
  { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_UNSIGNED_SHORT_5_6_5 },

  // TEXTURE_FMT_R5_G5_B5_A1: 13
  { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_UNSIGNED_SHORT_5_5_5_1 },

  // TEXTURE_FMT_R4_G4_B4_A4: 14
  { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_UNSIGNED_SHORT_4_4_4_4 },

  // TEXTURE_FMT_RGB8: 15
  { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_UNSIGNED_BYTE },

  // TEXTURE_FMT_RGBA8: 16
  { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_UNSIGNED_BYTE },

  // TEXTURE_FMT_RGB16F: 17
  { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_HALF_FLOAT_OES },

  // TEXTURE_FMT_RGBA16F: 18
  { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_HALF_FLOAT_OES },

  // TEXTURE_FMT_RGB32F: 19
  { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_FLOAT },

  // TEXTURE_FMT_RGBA32F: 20
  { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_FLOAT },

  // TEXTURE_FMT_R32F: 21
  { format: null, internalFormat: null, pixelType: null },

  // TEXTURE_FMT_111110F: 22
  { format: null, internalFormat: null, pixelType: null },

  // TEXTURE_FMT_SRGB: 23
  { format: null, internalFormat: null, pixelType: null },

  // TEXTURE_FMT_SRGBA: 24
  { format: null, internalFormat: null, pixelType: null },

  // TEXTURE_FMT_D16: 25
  { format: GL_DEPTH_COMPONENT, internalFormat: GL_DEPTH_COMPONENT, pixelType: GL_UNSIGNED_SHORT },

  // TEXTURE_FMT_D24: 26
  { format: GL_DEPTH_COMPONENT, internalFormat: GL_DEPTH_COMPONENT, pixelType: GL_UNSIGNED_INT },

  // TEXTURE_FMT_D24S8: 27
  { format: null, internalFormat: null, pixelType: null } ];

/**
 * enums
 */
var enums = {
  // buffer usage
  USAGE_STATIC: 35044,  // gl.STATIC_DRAW
  USAGE_DYNAMIC: 35048, // gl.DYNAMIC_DRAW
  USAGE_STREAM: 35040,  // gl.STREAM_DRAW

  // index buffer format
  INDEX_FMT_UINT8: 5121,  // gl.UNSIGNED_BYTE
  INDEX_FMT_UINT16: 5123, // gl.UNSIGNED_SHORT
  INDEX_FMT_UINT32: 5125, // gl.UNSIGNED_INT (OES_element_index_uint)

  // vertex attribute semantic
  ATTR_POSITION: 'a_position',
  ATTR_NORMAL: 'a_normal',
  ATTR_TANGENT: 'a_tangent',
  ATTR_BITANGENT: 'a_bitangent',
  ATTR_WEIGHTS: 'a_weights',
  ATTR_JOINTS: 'a_joints',
  ATTR_COLOR: 'a_color',
  ATTR_COLOR0: 'a_color0',
  ATTR_COLOR1: 'a_color1',
  ATTR_UV: 'a_uv',
  ATTR_UV0: 'a_uv0',
  ATTR_UV1: 'a_uv1',
  ATTR_UV2: 'a_uv2',
  ATTR_UV3: 'a_uv3',
  ATTR_UV4: 'a_uv4',
  ATTR_UV5: 'a_uv5',
  ATTR_UV6: 'a_uv6',
  ATTR_UV7: 'a_uv7',

  // vertex attribute type
  ATTR_TYPE_INT8: 5120,    // gl.BYTE
  ATTR_TYPE_UINT8: 5121,   // gl.UNSIGNED_BYTE
  ATTR_TYPE_INT16: 5122,   // gl.SHORT
  ATTR_TYPE_UINT16: 5123,  // gl.UNSIGNED_SHORT
  ATTR_TYPE_INT32: 5124,   // gl.INT
  ATTR_TYPE_UINT32: 5125,  // gl.UNSIGNED_INT
  ATTR_TYPE_FLOAT32: 5126, // gl.FLOAT

  // texture filter
  FILTER_NEAREST: 0,
  FILTER_LINEAR: 1,

  // texture wrap mode
  WRAP_REPEAT: 10497, // gl.REPEAT
  WRAP_CLAMP: 33071,  // gl.CLAMP_TO_EDGE
  WRAP_MIRROR: 33648, // gl.MIRRORED_REPEAT

  // texture format
  // compress formats
  TEXTURE_FMT_RGB_DXT1: 0,
  TEXTURE_FMT_RGBA_DXT1: 1,
  TEXTURE_FMT_RGBA_DXT3: 2,
  TEXTURE_FMT_RGBA_DXT5: 3,
  TEXTURE_FMT_RGB_ETC1: 4,
  TEXTURE_FMT_RGB_PVRTC_2BPPV1: 5,
  TEXTURE_FMT_RGBA_PVRTC_2BPPV1: 6,
  TEXTURE_FMT_RGB_PVRTC_4BPPV1: 7,
  TEXTURE_FMT_RGBA_PVRTC_4BPPV1: 8,

  // normal formats
  TEXTURE_FMT_A8: 9,
  TEXTURE_FMT_L8: 10,
  TEXTURE_FMT_L8_A8: 11,
  TEXTURE_FMT_R5_G6_B5: 12,
  TEXTURE_FMT_R5_G5_B5_A1: 13,
  TEXTURE_FMT_R4_G4_B4_A4: 14,
  TEXTURE_FMT_RGB8: 15,
  TEXTURE_FMT_RGBA8: 16,
  TEXTURE_FMT_RGB16F: 17,
  TEXTURE_FMT_RGBA16F: 18,
  TEXTURE_FMT_RGB32F: 19,
  TEXTURE_FMT_RGBA32F: 20,
  TEXTURE_FMT_R32F: 21,
  TEXTURE_FMT_111110F: 22,
  TEXTURE_FMT_SRGB: 23,
  TEXTURE_FMT_SRGBA: 24,

  // depth formats
  TEXTURE_FMT_D16: 25,
  TEXTURE_FMT_D32: 26,
  TEXTURE_FMT_D24S8: 27,

  // depth and stencil function
  DS_FUNC_NEVER: 512,    // gl.NEVER
  DS_FUNC_LESS: 513,     // gl.LESS
  DS_FUNC_EQUAL: 514,    // gl.EQUAL
  DS_FUNC_LEQUAL: 515,   // gl.LEQUAL
  DS_FUNC_GREATER: 516,  // gl.GREATER
  DS_FUNC_NOTEQUAL: 517, // gl.NOTEQUAL
  DS_FUNC_GEQUAL: 518,   // gl.GEQUAL
  DS_FUNC_ALWAYS: 519,   // gl.ALWAYS

  // render-buffer format
  RB_FMT_RGBA4: 32854,    // gl.RGBA4
  RB_FMT_RGB5_A1: 32855,  // gl.RGB5_A1
  RB_FMT_RGB565: 36194,   // gl.RGB565
  RB_FMT_D16: 33189,      // gl.DEPTH_COMPONENT16
  RB_FMT_S8: 36168,       // gl.STENCIL_INDEX8
  RB_FMT_D24S8: 34041,    // gl.DEPTH_STENCIL

  // blend-equation
  BLEND_FUNC_ADD: 32774,              // gl.FUNC_ADD
  BLEND_FUNC_SUBTRACT: 32778,         // gl.FUNC_SUBTRACT
  BLEND_FUNC_REVERSE_SUBTRACT: 32779, // gl.FUNC_REVERSE_SUBTRACT

  // blend
  BLEND_ZERO: 0,                          // gl.ZERO
  BLEND_ONE: 1,                           // gl.ONE
  BLEND_SRC_COLOR: 768,                   // gl.SRC_COLOR
  BLEND_ONE_MINUS_SRC_COLOR: 769,         // gl.ONE_MINUS_SRC_COLOR
  BLEND_DST_COLOR: 774,                   // gl.DST_COLOR
  BLEND_ONE_MINUS_DST_COLOR: 775,         // gl.ONE_MINUS_DST_COLOR
  BLEND_SRC_ALPHA: 770,                   // gl.SRC_ALPHA
  BLEND_ONE_MINUS_SRC_ALPHA: 771,         // gl.ONE_MINUS_SRC_ALPHA
  BLEND_DST_ALPHA: 772,                   // gl.DST_ALPHA
  BLEND_ONE_MINUS_DST_ALPHA: 773,         // gl.ONE_MINUS_DST_ALPHA
  BLEND_CONSTANT_COLOR: 32769,            // gl.CONSTANT_COLOR
  BLEND_ONE_MINUS_CONSTANT_COLOR: 32770,  // gl.ONE_MINUS_CONSTANT_COLOR
  BLEND_CONSTANT_ALPHA: 32771,            // gl.CONSTANT_ALPHA
  BLEND_ONE_MINUS_CONSTANT_ALPHA: 32772,  // gl.ONE_MINUS_CONSTANT_ALPHA
  BLEND_SRC_ALPHA_SATURATE: 776,          // gl.SRC_ALPHA_SATURATE

  // stencil operation
  STENCIL_OP_KEEP: 7680,          // gl.KEEP
  STENCIL_OP_ZERO: 0,             // gl.ZERO
  STENCIL_OP_REPLACE: 7681,       // gl.REPLACE
  STENCIL_OP_INCR: 7682,          // gl.INCR
  STENCIL_OP_INCR_WRAP: 34055,    // gl.INCR_WRAP
  STENCIL_OP_DECR: 7683,          // gl.DECR
  STENCIL_OP_DECR_WRAP: 34056,    // gl.DECR_WRAP
  STENCIL_OP_INVERT: 5386,        // gl.INVERT

  // cull
  CULL_NONE: 0,
  CULL_FRONT: 1028,
  CULL_BACK: 1029,
  CULL_FRONT_AND_BACK: 1032,

  // primitive type
  PT_POINTS: 0,         // gl.POINTS
  PT_LINES: 1,          // gl.LINES
  PT_LINE_LOOP: 2,      // gl.LINE_LOOP
  PT_LINE_STRIP: 3,     // gl.LINE_STRIP
  PT_TRIANGLES: 4,      // gl.TRIANGLES
  PT_TRIANGLE_STRIP: 5, // gl.TRIANGLE_STRIP
  PT_TRIANGLE_FAN: 6,   // gl.TRIANGLE_FAN
};

/**
 * @method attrTypeBytes
 * @param {ATTR_TYPE_*} attrType
 */
function attrTypeBytes(attrType) {
  if (attrType === enums.ATTR_TYPE_INT8) {
    return 1;
  } else if (attrType === enums.ATTR_TYPE_UINT8) {
    return 1;
  } else if (attrType === enums.ATTR_TYPE_INT16) {
    return 2;
  } else if (attrType === enums.ATTR_TYPE_UINT16) {
    return 2;
  } else if (attrType === enums.ATTR_TYPE_INT32) {
    return 4;
  } else if (attrType === enums.ATTR_TYPE_UINT32) {
    return 4;
  } else if (attrType === enums.ATTR_TYPE_FLOAT32) {
    return 4;
  }

  console.warn(("Unknown ATTR_TYPE: " + attrType));
  return 0;
}

/**
 * @method glFilter
 * @param {WebGLContext} gl
 * @param {FILTER_*} filter
 * @param {FILTER_*} mipFilter
 */
function glFilter(gl, filter, mipFilter) {
  if ( mipFilter === void 0 ) mipFilter = -1;

  var result = _filterGL[filter][mipFilter+1];
  if (result === undefined) {
    console.warn(("Unknown FILTER: " + filter));
    return mipFilter === -1 ? gl.LINEAR : gl.LINEAR_MIPMAP_LINEAR;
  }

  return result;
}

/**
 * @method glTextureFmt
 * @param {TEXTURE_FMT_*} fmt
 */
function glTextureFmt(fmt) {
  var result = _textureFmtGL[fmt];
  if (result === undefined) {
    console.warn(("Unknown TEXTURE_FMT: " + fmt));
    return _textureFmtGL[enums.TEXTURE_FMT_RGBA8];
  }

  return result;
}

// ====================
// exports
// ====================

var VertexFormat = function VertexFormat(infos) {
  var this$1 = this;

  this._attr2el = {};
  this._elements = [];
  this._bytes = 0;

  var offset = 0;
  for (var i = 0, len = infos.length; i < len; ++i) {
    var info = infos[i];
    var el = {
      name: info.name,
      offset: offset,
      stride: 0,
      stream: -1,
      type: info.type,
      num: info.num,
      normalize: (info.normalize === undefined) ? false : info.normalize,
      bytes: info.num * attrTypeBytes(info.type),
    };

    this$1._attr2el[el.name] = el;
    this$1._elements.push(el);

    this$1._bytes += el.bytes;
    offset += el.bytes;
  }

  for (var i$1 = 0, len$1 = this._elements.length; i$1 < len$1; ++i$1) {
    var el$1 = this$1._elements[i$1];
    el$1.stride = this$1._bytes;
  }
};

/**
 * @method element
 * @param {string} attrName
 */
VertexFormat.prototype.element = function element (attrName) {
  return this._attr2el[attrName];
};

var IndexBuffer = function IndexBuffer(device, format, usage, data, numIndices) {
  this._device = device;
  this._format = format;
  this._usage = usage;
  this._numIndices = numIndices;
  this._bytesPerIndex = 0;
  // calculate bytes
  var bytes = 0;
  if (format === enums.INDEX_FMT_UINT8) {
    this._bytesPerIndex = 1;
  } else if (format === enums.INDEX_FMT_UINT16) {
    this._bytesPerIndex = 2;
  } else if (format === enums.INDEX_FMT_UINT32) {
    this._bytesPerIndex = 4;
  }
  this._bytes = this._bytesPerIndex * numIndices;

  // update
  this._glID = device._gl.createBuffer();
  this.update(0, data);

  // stats
  device._stats.ib += bytes;
};

var prototypeAccessors = { count: { configurable: true } };

/**
 * @method destroy
 */
IndexBuffer.prototype.destroy = function destroy () {
  if (this._glID === -1) {
    console.error('The buffer already destroyed');
    return;
  }

  var gl = this._device._gl;
  gl.deleteBuffer(this._glID);
  this._device._stats.ib -= this.bytes;

  this._glID = -1;
};

/**
 * @method update
 * @param {Number} offset
 * @param {ArrayBuffer} data
 */
IndexBuffer.prototype.update = function update (offset, data) {
  if (this._glID === -1) {
    console.error('The buffer is destroyed');
    return;
  }

  if (data && data.byteLength + offset > this._bytes) {
    console.error('Failed to update data, bytes exceed.');
    return;
  }

  var gl = this._device._gl;
  var glUsage = this._usage;

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glID);
  if (!data) {
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._bytes, glUsage);
  } else {
    if (offset) {
      gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, data, glUsage);
    } else {
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, glUsage);
    }
  }
  this._device._restoreIndexBuffer();
};

prototypeAccessors.count.get = function () {
  return this._numIndices;
};

Object.defineProperties( IndexBuffer.prototype, prototypeAccessors );

var VertexBuffer = function VertexBuffer(device, format, usage, data, numVertices) {
  this._device = device;
  this._format = format;
  this._usage = usage;
  this._numVertices = numVertices;

  // calculate bytes
  this._bytes = this._format._bytes * numVertices;

  // update
  this._glID = device._gl.createBuffer();
  this.update(0, data);

  // stats
  device._stats.vb += this._bytes;
};

var prototypeAccessors$1 = { count: { configurable: true } };

/**
 * @method destroy
 */
VertexBuffer.prototype.destroy = function destroy () {
  if (this._glID === -1) {
    console.error('The buffer already destroyed');
    return;
  }

  var gl = this._device._gl;
  gl.deleteBuffer(this._glID);
  this._device._stats.vb -= this.bytes;

  this._glID = -1;
};

/**
 * @method update
 * @param {Number} offset
 * @param {ArrayBuffer} data
 */
VertexBuffer.prototype.update = function update (offset, data) {
  if (this._glID === -1) {
    console.error('The buffer is destroyed');
    return;
  }

  if (data && data.byteLength + offset > this._bytes) {
    console.error('Failed to update data, bytes exceed.');
    return;
  }

  var gl = this._device._gl;
  var glUsage = this._usage;

  gl.bindBuffer(gl.ARRAY_BUFFER, this._glID);
  if (!data) {
    gl.bufferData(gl.ARRAY_BUFFER, this._bytes, glUsage);
  } else {
    if (offset) {
      gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
    } else {
      gl.bufferData(gl.ARRAY_BUFFER, data, glUsage);
    }
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

prototypeAccessors$1.count.get = function () {
  return this._numVertices;
};

Object.defineProperties( VertexBuffer.prototype, prototypeAccessors$1 );

var _genID = 0;

function _parseError(out, type, errorLog) {
  errorLog.split('\n').forEach(function (msg) {
    if (msg.length < 5) {
      return;
    }

    var parts = /^ERROR\:\s+(\d+)\:(\d+)\:\s*(.*)$/.exec(msg);
    if (parts) {
      out.push({
        type: type,
        fileID: parts[1] | 0,
        line: parts[2] | 0,
        message: parts[3].trim()
      });
    } else if (msg.length > 0) {
      out.push({
        type: type,
        fileID: -1,
        line: 0,
        message: msg
      });
    }
  });
}

var Program = function Program(device, options) {
  this._device = device;

  // stores gl information: { location, type }
  this._attributes = [];
  this._uniforms = [];
  this._samplers = [];
  this._errors = [];
  this._linked = false;
  this._vertSource = options.vert;
  this._fragSource = options.frag;
  this._glID = null;
  this._id = _genID++;
};

var prototypeAccessors$2 = { id: { configurable: true } };

prototypeAccessors$2.id.get = function () {
  return this._id;
};

Program.prototype.link = function link () {
    var this$1 = this;

  if (this._linked) {
    return;
  }

  var gl = this._device._gl;

  var vertShader = _createShader(gl, gl.VERTEX_SHADER, this._vertSource);
  var fragShader = _createShader(gl, gl.FRAGMENT_SHADER, this._fragSource);

  var program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  var failed = false;
  var errors = this._errors;

  if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
    _parseError(errors, 'vs', gl.getShaderInfoLog(vertShader));
    failed = true;
  }

  if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
    _parseError(errors, 'fs', gl.getShaderInfoLog(fragShader));
    failed = true;
  }

  gl.deleteShader(vertShader);
  gl.deleteShader(fragShader);

  if (failed) {
    errors.forEach(function (err) {
      console.error(("Failed to compile " + (err.type) + " " + (err.fileID) + " (ln " + (err.line) + "): " + (err.message)));
    });
    return;
  }

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(("Failed to link shader program: " + (gl.getProgramInfoLog(program))));
    failed = true;
  }

  if (failed) {
    return;
  }

  this._glID = program;

  // parse attribute
  var numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (var i = 0; i < numAttributes; ++i) {
    var info = gl.getActiveAttrib(program, i);
    var location = gl.getAttribLocation(program, info.name);

    this$1._attributes.push({
      name: info.name,
      location: location,
      type: info.type,
    });
  }

  // parse uniform
  var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (var i$1 = 0; i$1 < numUniforms; ++i$1) {
    var info$1 = gl.getActiveUniform(program, i$1);
    var name = info$1.name;
    var location$1 = gl.getUniformLocation(program, name);
    var isArray = name.substr(name.length - 3) === '[0]';
    if (isArray) {
      name = name.substr(0, name.length - 3);
    }

    this$1._uniforms.push({
      name: name,
      location: location$1,
      type: info$1.type,
      size: isArray ? info$1.size : undefined, // used when uniform is an array
    });
  }

  this._linked = true;
};

Program.prototype.destroy = function destroy () {
  var gl = this._device._gl;
  gl.deleteProgram(this._glID);

  this._linked = false;
  this._glID = null;
  this._attributes = [];
  this._uniforms = [];
  this._samplers = [];
};

Object.defineProperties( Program.prototype, prototypeAccessors$2 );

// ====================
// internal
// ====================

function _createShader(gl, type, src) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  return shader;
}

var Texture = function Texture(device) {
  this._device = device;

  this._width = 4;
  this._height = 4;
  this._hasMipmap = false;
  this._compressed = false;

  this._anisotropy = 1;
  this._minFilter = enums.FILTER_LINEAR;
  this._magFilter = enums.FILTER_LINEAR;
  this._mipFilter = enums.FILTER_LINEAR;
  this._wrapS = enums.WRAP_REPEAT;
  this._wrapT = enums.WRAP_REPEAT;
  // wrapR available in webgl2
  // this._wrapR = enums.WRAP_REPEAT;
  this._format = enums.TEXTURE_FMT_RGBA8;

  this._target = -1;
};

/**
 * @method destroy
 */
Texture.prototype.destroy = function destroy () {
  if (this._glID === -1) {
    console.error('The texture already destroyed');
    return;
  }

  var gl = this._device._gl;
  gl.deleteTexture(this._glID);

  this._device._stats.tex -= this.bytes;
  this._glID = -1;
};

function isPow2(v) {
  return !(v & (v - 1)) && (!!v);
}

var Texture2D = (function (Texture$$1) {
  function Texture2D(device, options) {
    Texture$$1.call(this, device);

    var gl = this._device._gl;
    this._target = gl.TEXTURE_2D;
    this._glID = gl.createTexture();

    // always alloc texture in GPU when we create it.
    options.images = options.images || [null];
    this.update(options);
  }

  if ( Texture$$1 ) Texture2D.__proto__ = Texture$$1;
  Texture2D.prototype = Object.create( Texture$$1 && Texture$$1.prototype );
  Texture2D.prototype.constructor = Texture2D;

  /**
   * @method update
   * @param {Object} options
   * @param {Array} options.images
   * @param {Boolean} options.mipmap
   * @param {Number} options.width
   * @param {Number} options.height
   * @param {TEXTURE_FMT_*} options.format
   * @param {Number} options.anisotropy
   * @param {FILTER_*} options.minFilter
   * @param {FILTER_*} options.magFilter
   * @param {FILTER_*} options.mipFilter
   * @param {WRAP_*} options.wrapS
   * @param {WRAP_*} options.wrapT
   * @param {Boolean} options.flipY
   * @param {Boolean} options.premultiplyAlpha
   */
  Texture2D.prototype.update = function update (options) {
    var gl = this._device._gl;
    var genMipmap = this._hasMipmap;

    if (options) {
      if (options.width !== undefined) {
        this._width = options.width;
      }
      if (options.height !== undefined) {
        this._height = options.height;
      }
      if (options.anisotropy !== undefined) {
        this._anisotropy = options.anisotropy;
      }
      if (options.minFilter !== undefined) {
        this._minFilter = options.minFilter;
      }
      if (options.magFilter !== undefined) {
        this._magFilter = options.magFilter;
      }
      if (options.mipFilter !== undefined) {
        this._mipFilter = options.mipFilter;
      }
      if (options.wrapS !== undefined) {
        this._wrapS = options.wrapS;
      }
      if (options.wrapT !== undefined) {
        this._wrapT = options.wrapT;
      }
      if (options.format !== undefined) {
        this._format = options.format;
        this._compressed = (
          this._format >= enums.TEXTURE_FMT_RGB_DXT1 &&
          this._format <= enums.TEXTURE_FMT_RGBA_PVRTC_4BPPV1
        );
      }

      // check if generate mipmap
      if (options.mipmap !== undefined) {
        this._hasMipmap = options.mipmap;
        genMipmap = options.mipmap;
      }

      if (options.images !== undefined) {
        if (options.images.length > 1) {
          genMipmap = false;
          var maxLength = options.width > options.height ? options.width : options.height;
          if (maxLength >> (options.images.length - 1) !== 1) {
            console.error('texture-2d mipmap is invalid, should have a 1x1 mipmap.');
          }
        }
      }
    }

    // NOTE: get pot after this._width, this._height has been assigned.
    var pot = isPow2(this._width) && isPow2(this._height);
    if (!pot) {
      genMipmap = false;
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._glID);
    if (options.images !== undefined) {
      this._setMipmap(options.images, options.flipY, options.premultiplyAlpha);
    }

    this._setTexInfo();

    if (genMipmap) {
      gl.hint(gl.GENERATE_MIPMAP_HINT, gl.NICEST);
      gl.generateMipmap(gl.TEXTURE_2D);
    }
    this._device._restoreTexture(0);
  };

  /**
   * @method updateSubImage
   * @param {Object} options
   * @param {Number} options.x
   * @param {Number} options.y
   * @param {Number} options.width
   * @param {Number} options.height
   * @param {Number} options.level
   * @param {HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ArrayBufferView} options.image
   * @param {Boolean} options.flipY
   * @param {Boolean} options.premultiplyAlpha
   */
  Texture2D.prototype.updateSubImage = function updateSubImage (options) {
    var gl = this._device._gl;
    var glFmt = glTextureFmt(this._format);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._glID);
    this._setSubImage(glFmt, options);
    this._device._restoreTexture(0);
  };

  /**
   * @method updateImage
   * @param {Object} options
   * @param {Number} options.width
   * @param {Number} options.height
   * @param {Number} options.level
   * @param {HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ArrayBufferView} options.image
   * @param {Boolean} options.flipY
   * @param {Boolean} options.premultiplyAlpha
   */
  Texture2D.prototype.updateImage = function updateImage (options) {
    var gl = this._device._gl;
    var glFmt = glTextureFmt(this._format);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._glID);
    this._setImage(glFmt, options);
    this._device._restoreTexture(0);
  };

  Texture2D.prototype._setSubImage = function _setSubImage (glFmt, options) {
    var gl = this._device._gl;
    var flipY = options.flipY;
    var premultiplyAlpha = options.premultiplyAlpha;
    var img = options.image;

    if (
      img instanceof HTMLCanvasElement ||
      img instanceof HTMLImageElement ||
      img instanceof HTMLVideoElement
    ) {
      if (flipY === undefined) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      } else {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
      }

      if (premultiplyAlpha === undefined) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      } else {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
      }

      gl.texSubImage2D(gl.TEXTURE_2D, options.level, options.x, options.y, glFmt.format, glFmt.pixelType, img);
    } else {
      if (flipY === undefined) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      } else {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
      }

      if (premultiplyAlpha === undefined) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      } else {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
      }

      if (this._compressed) {
        gl.compressedTexSubImage2D(gl.TEXTURE_2D,
          options.level,
          options.x,
          options.y,
          options.width,
          options.height,
          glFmt.format,
          img
        );
      } else {
        gl.texSubImage2D(
          gl.TEXTURE_2D,
          options.level,
          options.x,
          options.y,
          options.width,
          options.height,
          glFmt.format,
          glFmt.pixelType,
          img
        );
      }
    }
  };

  Texture2D.prototype._setImage = function _setImage (glFmt, options) {
    var gl = this._device._gl;
    var flipY = options.flipY;
    var premultiplyAlpha = options.premultiplyAlpha;
    var img = options.image;

    if (
      img instanceof HTMLCanvasElement ||
      img instanceof HTMLImageElement ||
      img instanceof HTMLVideoElement
    ) {
      if (flipY === undefined) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      } else {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
      }

      if (premultiplyAlpha === undefined) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      } else {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
      }

      gl.texImage2D(
        gl.TEXTURE_2D,
        options.level,
        glFmt.internalFormat,
        glFmt.format,
        glFmt.pixelType,
        img
      );
    } else {
      if (flipY === undefined) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      } else {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
      }

      if (premultiplyAlpha === undefined) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      } else {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
      }

      if (this._compressed) {
        gl.compressedTexImage2D(
          gl.TEXTURE_2D,
          options.level,
          glFmt.internalFormat,
          options.width,
          options.height,
          0,
          img
        );
      } else {
        gl.texImage2D(
          gl.TEXTURE_2D,
          options.level,
          glFmt.internalFormat,
          options.width,
          options.height,
          0,
          glFmt.format,
          glFmt.pixelType,
          img
        );
      }
    }
  };

  Texture2D.prototype._setMipmap = function _setMipmap (images, flipY, premultiplyAlpha) {
    var this$1 = this;

    var glFmt = glTextureFmt(this._format);
    var options = {
      width: this._width,
      height: this._height,
      flipY: flipY,
      premultiplyAlpha: premultiplyAlpha,
      level: 0,
      image: null
    };

    for (var i = 0; i < images.length; ++i) {
      options.level = i;
      options.width = this$1._width >> i;
      options.height = this$1._height >> i;
      options.image = images[i];
      this$1._setImage(glFmt, options);
    }
  };

  Texture2D.prototype._setTexInfo = function _setTexInfo () {
    var gl = this._device._gl;
    var pot = isPow2(this._width) && isPow2(this._height);

    // WebGL1 doesn't support all wrap modes with NPOT textures
    if (!pot && (this._wrapS !== enums.WRAP_CLAMP || this._wrapT !== enums.WRAP_CLAMP)) {
      console.warn('WebGL1 doesn\'t support all wrap modes with NPOT textures');
      this._wrapS = enums.WRAP_CLAMP;
      this._wrapT = enums.WRAP_CLAMP;
    }

    var mipFilter = this._hasMipmap ? this._mipFilter : -1;
    if (!pot && mipFilter !== -1) {
      console.warn('NPOT textures do not support mipmap filter');
      mipFilter = -1;
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glFilter(gl, this._minFilter, mipFilter));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glFilter(gl, this._magFilter, -1));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._wrapT);

    var ext = this._device.ext('EXT_texture_filter_anisotropic');
    if (ext) {
      gl.texParameteri(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, this._anisotropy);
    }
  };

  return Texture2D;
}(Texture));

var TextureCube = (function (Texture$$1) {
  function TextureCube(device, options) {
    Texture$$1.call(this, device);
    var gl = this._device._gl;
    this._target = gl.TEXTURE_CUBE_MAP;
    this._glID = gl.createTexture();
    this.update(options);
  }

  if ( Texture$$1 ) TextureCube.__proto__ = Texture$$1;
  TextureCube.prototype = Object.create( Texture$$1 && Texture$$1.prototype );
  TextureCube.prototype.constructor = TextureCube;

  /**
   * @method update
   * @param {Object} options
   * @param {Array} options.images
   * @param {Boolean} options.mipmap
   * @param {Number} options.width
   * @param {Number} options.height
   * @param {TEXTURE_FMT_*} options.format
   * @param {Number} options.anisotropy
   * @param {FILTER_*} options.minFilter
   * @param {FILTER_*} options.magFilter
   * @param {FILTER_*} options.mipFilter
   * @param {WRAP_*} options.wrapS
   * @param {WRAP_*} options.wrapT
   * @param {WRAP_*} options.wrapR
   * @param {Boolean} options.flipY
   * @param {Boolean} options.premultiplyAlpha
   */
  TextureCube.prototype.update = function update (options) {
    var gl = this._device._gl;
    var genMipmap = this._hasMipmap;

    if (options) {
      if (options.width !== undefined) {
        this._width = options.width;
      }
      if (options.height !== undefined) {
        this._height = options.height;
      }
      if (options.anisotropy !== undefined) {
        this._anisotropy = options.anisotropy;
      }
      if (options.minFilter !== undefined) {
        this._minFilter = options.minFilter;
      }
      if (options.magFilter !== undefined) {
        this._magFilter = options.magFilter;
      }
      if (options.mipFilter !== undefined) {
        this._mipFilter = options.mipFilter;
      }
      if (options.wrapS !== undefined) {
        this._wrapS = options.wrapS;
      }
      if (options.wrapT !== undefined) {
        this._wrapT = options.wrapT;
      }
      // wrapR available in webgl2
      // if (options.wrapR !== undefined) {
      //   this._wrapR = options.wrapR;
      // }
      if (options.format !== undefined) {
        this._format = options.format;
        this._compressed = (
          this._format >= enums.TEXTURE_FMT_RGB_DXT1 &&
          this._format <= enums.TEXTURE_FMT_RGBA_PVRTC_4BPPV1
        );
      }

      // check if generate mipmap
      if (options.mipmap !== undefined) {
        this._hasMipmap = options.mipmap;
        genMipmap = options.mipmap;
      }

      if (options.images !== undefined) {
        if (options.images.length > 1) {
          genMipmap = false;
          if (options.width !== options.height) {
            console.warn('texture-cube width and height should be identical.');
          }
          if (options.width >> (options.images.length - 1) !== 1) {
            console.error('texture-cube mipmap is invalid. please set mipmap as 1x1, 2x2, 4x4 ... nxn');
          }
        }
      }
    }

    // NOTE: get pot after this._width, this._height has been assigned.
    var pot = isPow2(this._width) && isPow2(this._height);
    if (!pot) {
      genMipmap = false;
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._glID);
    if (options.images !== undefined) {
      this._setMipmap(options.images, options.flipY, options.premultiplyAlpha);
    }

    this._setTexInfo();

    if (genMipmap) {
      gl.hint(gl.GENERATE_MIPMAP_HINT, gl.NICEST);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    }
    this._device._restoreTexture(0);
  };

  /**
   * @method updateSubImage
   * @param {Object} options
   * @param {Number} options.x
   * @param {Number} options.y
   * @param {Number} options.width
   * @param {Number} options.height
   * @param {Number} options.level
   * @param {Number} options.faceIndex
   * @param {HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ArrayBufferView} options.image
   * @param {Boolean} options.flipY
   * @param {Boolean} options.premultiplyAlpha
   */
  TextureCube.prototype.updateSubImage = function updateSubImage (options) {
    var gl = this._device._gl;
    var glFmt = glTextureFmt(this._format);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._glID);
    this._setSubImage(glFmt, options);

    this._device._restoreTexture(0);
  };

  /**
   * @method updateImage
   * @param {Object} options
   * @param {Number} options.width
   * @param {Number} options.height
   * @param {Number} options.level
   * @param {Number} options.faceIndex
   * @param {HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ArrayBufferView} options.image
   * @param {Boolean} options.flipY
   * @param {Boolean} options.premultiplyAlpha
   */
  TextureCube.prototype.updateImage = function updateImage (options) {
    var gl = this._device._gl;
    var glFmt = glTextureFmt(this._format);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._glID);
    this._setImage(glFmt, options);
    this._device._restoreTexture(0);
  };

  TextureCube.prototype._setSubImage = function _setSubImage (glFmt, options) {
    var gl = this._device._gl;
    var flipY = options.flipY;
    var premultiplyAlpha = options.premultiplyAlpha;
    var faceIndex = options.faceIndex;
    var img = options.image;

    if (flipY === undefined) {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    } else {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
    }

    if (premultiplyAlpha === undefined) {
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    } else {
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
    }

    if (
      img instanceof HTMLCanvasElement ||
      img instanceof HTMLImageElement ||
      img instanceof HTMLVideoElement
    ) {
      gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex, options.level, options.x, options.y, glFmt.format, glFmt.pixelType, img);
    } else {
      if (this._compressed) {
        gl.compressedTexSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex,
          options.level,
          options.x,
          options.y,
          options.width,
          options.height,
          glFmt.format,
          img
        );
      } else {
        gl.texSubImage2D(
          gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex,
          options.level,
          options.x,
          options.y,
          options.width,
          options.height,
          glFmt.format,
          glFmt.pixelType,
          img
        );
      }
    }
  };

  TextureCube.prototype._setImage = function _setImage (glFmt, options) {
    var gl = this._device._gl;
    var flipY = options.flipY;
    var premultiplyAlpha = options.premultiplyAlpha;
    var faceIndex = options.faceIndex;
    var img = options.image;

    if (flipY === undefined) {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    } else {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
    }

    if (premultiplyAlpha === undefined) {
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    } else {
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
    }
    if (
      img instanceof HTMLCanvasElement ||
      img instanceof HTMLImageElement ||
      img instanceof HTMLVideoElement
    ) {
      gl.texImage2D(
        gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex,
        options.level,
        glFmt.internalFormat,
        glFmt.format,
        glFmt.pixelType,
        img
      );
    } else {
      if (this._compressed) {
        gl.compressedTexImage2D(
          gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex,
          options.level,
          glFmt.internalFormat,
          options.width,
          options.height,
          0,
          img
        );
      } else {
        gl.texImage2D(
          gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex,
          options.level,
          glFmt.internalFormat,
          options.width,
          options.height,
          0,
          glFmt.format,
          glFmt.pixelType,
          img
        );
      }
    }
  };

  // levelImages = [imagePosX, imageNegX, imagePosY, imageNegY, imagePosZ, imageNegz]
  // images = [levelImages0, levelImages1, ...]
  TextureCube.prototype._setMipmap = function _setMipmap (images, flipY, premultiplyAlpha) {
    var this$1 = this;

    var glFmt = glTextureFmt(this._format);
    var options = {
      width: this._width,
      height: this._height,
      faceIndex: 0,
      flipY: flipY,
      premultiplyAlpha: premultiplyAlpha,
      level: 0,
      image: null
    };

    for (var i = 0; i < images.length; ++i) {
      var levelImages = images[i];
      options.level = i;
      options.width = this$1._width >> i;
      options.height = this$1._height >> i;

      for (var face = 0; face < 6; ++face) {
        options.faceIndex = face;
        options.image = levelImages[face];
        this$1._setImage(glFmt, options);
      }
    }
  };

  TextureCube.prototype._setTexInfo = function _setTexInfo () {
    var gl = this._device._gl;
    var pot = isPow2(this._width) && isPow2(this._height);

    // WebGL1 doesn't support all wrap modes with NPOT textures
    if (!pot && (this._wrapS !== enums.WRAP_CLAMP || this._wrapT !== enums.WRAP_CLAMP)) {
      console.warn('WebGL1 doesn\'t support all wrap modes with NPOT textures');
      this._wrapS = enums.WRAP_CLAMP;
      this._wrapT = enums.WRAP_CLAMP;
    }

    var mipFilter = this._hasMipmap ? this._mipFilter : -1;
    if (!pot && mipFilter !== -1) {
      console.warn('NPOT textures do not support mipmap filter');
      mipFilter = -1;
    }

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, glFilter(gl, this._minFilter, mipFilter));
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, glFilter(gl, this._magFilter, -1));
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this._wrapS);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this._wrapT);
    // wrapR available in webgl2
    // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, this._wrapR);

    var ext = this._device.ext('EXT_texture_filter_anisotropic');
    if (ext) {
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, ext.TEXTURE_MAX_ANISOTROPY_EXT, this._anisotropy);
    }
  };

  return TextureCube;
}(Texture));

var RenderBuffer = function RenderBuffer(device, format, width, height) {
  this._device = device;
  this._format = format;
  this._width = width;
  this._height = height;

  var gl = device._gl;
  this._glID = gl.createRenderbuffer();

  gl.bindRenderbuffer(gl.RENDERBUFFER, this._glID);
  gl.renderbufferStorage(gl.RENDERBUFFER, format, width, height);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
};

/**
 * @method destroy
 */
RenderBuffer.prototype.destroy = function destroy () {
  if (this._glID === null) {
    console.error('The render-buffer already destroyed');
    return;
  }

  var gl = this._device._gl;

  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.deleteRenderbuffer(this._glID);

  this._glID = null;
};

var FrameBuffer = function FrameBuffer(device, width, height, options) {
  this._device = device;
  this._width = width;
  this._height = height;

  this._colors = options.colors || [];
  this._depth = options.depth || null;
  this._stencil = options.stencil || null;
  this._depthStencil = options.depthStencil || null;

  this._glID = device._gl.createFramebuffer();
};

/**
 * @method destroy
 */
FrameBuffer.prototype.destroy = function destroy () {
  if (this._glID === null) {
    console.error('The frame-buffer already destroyed');
    return;
  }

  var gl = this._device._gl;

  gl.deleteFramebuffer(this._glID);

  this._glID = null;
};

var _default = {
  // blend
  blend: false,
  blendSep: false,
  blendColor: 0xffffffff,
  blendEq: enums.BLEND_FUNC_ADD,
  blendAlphaEq: enums.BLEND_FUNC_ADD,
  blendSrc: enums.BLEND_ONE,
  blendDst: enums.BLEND_ZERO,
  blendSrcAlpha: enums.BLEND_ONE,
  blendDstAlpha: enums.BLEND_ZERO,

  // depth
  depthTest: false,
  depthWrite: false,
  depthFunc: enums.DS_FUNC_LESS,

  // stencil
  stencilTest: false,
  stencilSep: false,
  stencilFuncFront: enums.DS_FUNC_ALWAYS,
  stencilRefFront: 0,
  stencilMaskFront: 0xff,
  stencilFailOpFront: enums.STENCIL_OP_KEEP,
  stencilZFailOpFront: enums.STENCIL_OP_KEEP,
  stencilZPassOpFront: enums.STENCIL_OP_KEEP,
  stencilWriteMaskFront: 0xff,
  stencilFuncBack: enums.DS_FUNC_ALWAYS,
  stencilRefBack: 0,
  stencilMaskBack: 0xff,
  stencilFailOpBack: enums.STENCIL_OP_KEEP,
  stencilZFailOpBack: enums.STENCIL_OP_KEEP,
  stencilZPassOpBack: enums.STENCIL_OP_KEEP,
  stencilWriteMaskBack: 0xff,

  // cull-mode
  cullMode: enums.CULL_BACK,

  // primitive-type
  primitiveType: enums.PT_TRIANGLES,

  // bindings
  maxStream: -1,
  vertexBuffers: [],
  vertexBufferOffsets: [],
  indexBuffer: null,
  textureUnits: [],
  program: null,
};

var State = function State() {
  // bindings
  this.vertexBuffers = [];
  this.vertexBufferOffsets = [];
  this.textureUnits = [];

  this.set(_default);
};

State.prototype.reset = function reset () {
  this.set(_default);
};

State.prototype.set = function set (cpy) {
    var this$1 = this;

  // blending
  this.blend = cpy.blend;
  this.blendSep = cpy.blendSep;
  this.blendColor = cpy.blendColor;
  this.blendEq = cpy.blendEq;
  this.blendAlphaEq = cpy.blendAlphaEq;
  this.blendSrc = cpy.blendSrc;
  this.blendDst = cpy.blendDst;
  this.blendSrcAlpha = cpy.blendSrcAlpha;
  this.blendDstAlpha = cpy.blendDstAlpha;

  // depth
  this.depthTest = cpy.depthTest;
  this.depthWrite = cpy.depthWrite;
  this.depthFunc = cpy.depthFunc;

  // stencil
  this.stencilTest = cpy.stencilTest;
  this.stencilSep = cpy.stencilSep;
  this.stencilFuncFront = cpy.stencilFuncFront;
  this.stencilRefFront = cpy.stencilRefFront;
  this.stencilMaskFront = cpy.stencilMaskFront;
  this.stencilFailOpFront = cpy.stencilFailOpFront;
  this.stencilZFailOpFront = cpy.stencilZFailOpFront;
  this.stencilZPassOpFront = cpy.stencilZPassOpFront;
  this.stencilWriteMaskFront = cpy.stencilWriteMaskFront;
  this.stencilFuncBack = cpy.stencilFuncBack;
  this.stencilRefBack = cpy.stencilRefBack;
  this.stencilMaskBack = cpy.stencilMaskBack;
  this.stencilFailOpBack = cpy.stencilFailOpBack;
  this.stencilZFailOpBack = cpy.stencilZFailOpBack;
  this.stencilZPassOpBack = cpy.stencilZPassOpBack;
  this.stencilWriteMaskBack = cpy.stencilWriteMaskBack;

  // cull-mode
  this.cullMode = cpy.cullMode;

  // primitive-type
  this.primitiveType = cpy.primitiveType;

  // bindings
  this.maxStream = cpy.maxStream;
  for (var i = 0; i < cpy.vertexBuffers.length; ++i) {
    this$1.vertexBuffers[i] = cpy.vertexBuffers[i];
  }
  for (var i$1 = 0; i$1 < cpy.vertexBufferOffsets.length; ++i$1) {
    this$1.vertexBufferOffsets[i$1] = cpy.vertexBufferOffsets[i$1];
  }
  this.indexBuffer = cpy.indexBuffer;
  for (var i$2 = 0; i$2 < cpy.textureUnits.length; ++i$2) {
    this$1.textureUnits[i$2] = cpy.textureUnits[i$2];
  }
  this.program = cpy.program;
};

var GL_INT = 5124;
var GL_FLOAT$1 = 5126;
var GL_FLOAT_VEC2 = 35664;
var GL_FLOAT_VEC3 = 35665;
var GL_FLOAT_VEC4 = 35666;
var GL_INT_VEC2 = 35667;
var GL_INT_VEC3 = 35668;
var GL_INT_VEC4 = 35669;
var GL_BOOL = 35670;
var GL_BOOL_VEC2 = 35671;
var GL_BOOL_VEC3 = 35672;
var GL_BOOL_VEC4 = 35673;
var GL_FLOAT_MAT2 = 35674;
var GL_FLOAT_MAT3 = 35675;
var GL_FLOAT_MAT4 = 35676;
var GL_SAMPLER_2D = 35678;
var GL_SAMPLER_CUBE = 35680;

/**
 * _type2uniformCommit
 */
var _type2uniformCommit = {};
_type2uniformCommit[GL_INT] = function (gl, id, value) {
    gl.uniform1i(id, value);
  };
_type2uniformCommit[GL_FLOAT$1] = function (gl, id, value) {
    gl.uniform1f(id, value);
  };
_type2uniformCommit[GL_FLOAT_VEC2] = function (gl, id, value) {
    gl.uniform2fv(id, value);
  };
_type2uniformCommit[GL_FLOAT_VEC3] = function (gl, id, value) {
    gl.uniform3fv(id, value);
  };
_type2uniformCommit[GL_FLOAT_VEC4] = function (gl, id, value) {
    gl.uniform4fv(id, value);
  };
_type2uniformCommit[GL_INT_VEC2] = function (gl, id, value) {
    gl.uniform2iv(id, value);
  };
_type2uniformCommit[GL_INT_VEC3] = function (gl, id, value) {
    gl.uniform3iv(id, value);
  };
_type2uniformCommit[GL_INT_VEC4] = function (gl, id, value) {
    gl.uniform4iv(id, value);
  };
_type2uniformCommit[GL_BOOL] = function (gl, id, value) {
    gl.uniform1i(id, value);
  };
_type2uniformCommit[GL_BOOL_VEC2] = function (gl, id, value) {
    gl.uniform2iv(id, value);
  };
_type2uniformCommit[GL_BOOL_VEC3] = function (gl, id, value) {
    gl.uniform3iv(id, value);
  };
_type2uniformCommit[GL_BOOL_VEC4] = function (gl, id, value) {
    gl.uniform4iv(id, value);
  };
_type2uniformCommit[GL_FLOAT_MAT2] = function (gl, id, value) {
    gl.uniformMatrix2fv(id, false, value);
  };
_type2uniformCommit[GL_FLOAT_MAT3] = function (gl, id, value) {
    gl.uniformMatrix3fv(id, false, value);
  };
_type2uniformCommit[GL_FLOAT_MAT4] = function (gl, id, value) {
    gl.uniformMatrix4fv(id, false, value);
  };
_type2uniformCommit[GL_SAMPLER_2D] = function (gl, id, value) {
    gl.uniform1i(id, value);
  };
_type2uniformCommit[GL_SAMPLER_CUBE] = function (gl, id, value) {
    gl.uniform1i(id, value);
  };

/**
 * _type2uniformArrayCommit
 */
var _type2uniformArrayCommit = {};
_type2uniformArrayCommit[GL_INT] = function (gl, id, value) {
    gl.uniform1iv(id, value);
  };
_type2uniformArrayCommit[GL_FLOAT$1] = function (gl, id, value) {
    gl.uniform1fv(id, value);
  };
_type2uniformArrayCommit[GL_FLOAT_VEC2] = function (gl, id, value) {
    gl.uniform2fv(id, value);
  };
_type2uniformArrayCommit[GL_FLOAT_VEC3] = function (gl, id, value) {
    gl.uniform3fv(id, value);
  };
_type2uniformArrayCommit[GL_FLOAT_VEC4] = function (gl, id, value) {
    gl.uniform4fv(id, value);
  };
_type2uniformArrayCommit[GL_INT_VEC2] = function (gl, id, value) {
    gl.uniform2iv(id, value);
  };
_type2uniformArrayCommit[GL_INT_VEC3] = function (gl, id, value) {
    gl.uniform3iv(id, value);
  };
_type2uniformArrayCommit[GL_INT_VEC4] = function (gl, id, value) {
    gl.uniform4iv(id, value);
  };
_type2uniformArrayCommit[GL_BOOL] = function (gl, id, value) {
    gl.uniform1iv(id, value);
  };
_type2uniformArrayCommit[GL_BOOL_VEC2] = function (gl, id, value) {
    gl.uniform2iv(id, value);
  };
_type2uniformArrayCommit[GL_BOOL_VEC3] = function (gl, id, value) {
    gl.uniform3iv(id, value);
  };
_type2uniformArrayCommit[GL_BOOL_VEC4] = function (gl, id, value) {
    gl.uniform4iv(id, value);
  };
_type2uniformArrayCommit[GL_FLOAT_MAT2] = function (gl, id, value) {
    gl.uniformMatrix2fv(id, false, value);
  };
_type2uniformArrayCommit[GL_FLOAT_MAT3] = function (gl, id, value) {
    gl.uniformMatrix3fv(id, false, value);
  };
_type2uniformArrayCommit[GL_FLOAT_MAT4] = function (gl, id, value) {
    gl.uniformMatrix4fv(id, false, value);
  };
_type2uniformArrayCommit[GL_SAMPLER_2D] = function (gl, id, value) {
    gl.uniform1iv(id, value);
  };
_type2uniformArrayCommit[GL_SAMPLER_CUBE] = function (gl, id, value) {
    gl.uniform1iv(id, value);
  };

/**
 * _commitBlendStates
 */
function _commitBlendStates(gl, cur, next) {
  // enable/disable blend
  if (cur.blend !== next.blend) {
    if (!next.blend) {
      gl.disable(gl.BLEND);
      return;
    }

    gl.enable(gl.BLEND);

    if (
      next.blendSrc === enums.BLEND_CONSTANT_COLOR ||
      next.blendSrc === enums.BLEND_ONE_MINUS_CONSTANT_COLOR ||
      next.blendDst === enums.BLEND_CONSTANT_COLOR ||
      next.blendDst === enums.BLEND_ONE_MINUS_CONSTANT_COLOR
    ) {
      gl.blendColor(
        (next.blendColor >> 24) / 255,
        (next.blendColor >> 16 & 0xff) / 255,
        (next.blendColor >> 8 & 0xff) / 255,
        (next.blendColor & 0xff) / 255
      );
    }

    if (next.blendSep) {
      gl.blendFuncSeparate(next.blendSrc, next.blendDst, next.blendSrcAlpha, next.blendDstAlpha);
      gl.blendEquationSeparate(next.blendEq, next.blendAlphaEq);
    } else {
      gl.blendFunc(next.blendSrc, next.blendDst);
      gl.blendEquation(next.blendEq);
    }

    return;
  }

  // nothing to update
  if (next.blend === false) {
    return;
  }

  // blend-color
  if (cur.blendColor !== next.blendColor) {
    gl.blendColor(
      (next.blendColor >> 24) / 255,
      (next.blendColor >> 16 & 0xff) / 255,
      (next.blendColor >> 8 & 0xff) / 255,
      (next.blendColor & 0xff) / 255
    );
  }

  // separate diff, reset all
  if (cur.blendSep !== next.blendSep) {
    if (next.blendSep) {
      gl.blendFuncSeparate(next.blendSrc, next.blendDst, next.blendSrcAlpha, next.blendDstAlpha);
      gl.blendEquationSeparate(next.blendEq, next.blendAlphaEq);
    } else {
      gl.blendFunc(next.blendSrc, next.blendDst);
      gl.blendEquation(next.blendEq);
    }

    return;
  }

  if (next.blendSep) {
    // blend-func-separate
    if (
      cur.blendSrc !== next.blendSrc ||
      cur.blendDst !== next.blendDst ||
      cur.blendSrcAlpha !== next.blendSrcAlpha ||
      cur.blendDstAlpha !== next.blendDstAlpha
    ) {
      gl.blendFuncSeparate(next.blendSrc, next.blendDst, next.blendSrcAlpha, next.blendDstAlpha);
    }

    // blend-equation-separate
    if (
      cur.blendEq !== next.blendEq ||
      cur.blendAlphaEq !== next.blendAlphaEq
    ) {
      gl.blendEquationSeparate(next.blendEq, next.blendAlphaEq);
    }
  } else {
    // blend-func
    if (
      cur.blendSrc !== next.blendSrc ||
      cur.blendDst !== next.blendDst
    ) {
      gl.blendFunc(next.blendSrc, next.blendDst);
    }

    // blend-equation
    if (cur.blendEq !== next.blendEq) {
      gl.blendEquation(next.blendEq);
    }
  }
}

/**
 * _commitDepthStates
 */
function _commitDepthStates(gl, cur, next) {
  // enable/disable depth-test
  if (cur.depthTest !== next.depthTest) {
    if (!next.depthTest) {
      gl.disable(gl.DEPTH_TEST);
      return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(next.depthFunc);
    gl.depthMask(next.depthWrite);

    return;
  }

  // commit depth-write
  if (cur.depthWrite !== next.depthWrite) {
    gl.depthMask(next.depthWrite);
  }

  // check if depth-write enabled
  if (next.depthTest === false) {
    if (next.depthWrite) {
      next.depthTest = true;
      next.depthFunc = enums.DS_FUNC_ALWAYS;

      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(next.depthFunc);
    }

    return;
  }

  // depth-func
  if (cur.depthFunc !== next.depthFunc) {
    gl.depthFunc(next.depthFunc);
  }
}

/**
 * _commitStencilStates
 */
function _commitStencilStates(gl, cur, next) {
  if (next.stencilTest !== cur.stencilTest) {
    if (!next.stencilTest) {
      gl.disable(gl.STENCIL_TEST);
      return;
    }

    gl.enable(gl.STENCIL_TEST);

    if (next.stencilSep) {
      gl.stencilFuncSeparate(gl.FRONT, next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
      gl.stencilMaskSeparate(gl.FRONT, next.stencilWriteMaskFront);
      gl.stencilOpSeparate(gl.FRONT, next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
      gl.stencilFuncSeparate(gl.BACK, next.stencilFuncBack, next.stencilRefBack, next.stencilMaskBack);
      gl.stencilMaskSeparate(gl.BACK, next.stencilWriteMaskBack);
      gl.stencilOpSeparate(gl.BACK, next.stencilFailOpBack, next.stencilZFailOpBack, next.stencilZPassOpBack);
    } else {
      gl.stencilFunc(next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
      gl.stencilMask(next.stencilWriteMaskFront);
      gl.stencilOp(next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
    }

    return;
  }

  // fast return
  if (!next.stencilTest) {
    return;
  }

  if (cur.stencilSep !== next.stencilSep) {
    if (next.stencilSep) {
      gl.stencilFuncSeparate(gl.FRONT, next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
      gl.stencilMaskSeparate(gl.FRONT, next.stencilWriteMaskFront);
      gl.stencilOpSeparate(gl.FRONT, next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
      gl.stencilFuncSeparate(gl.BACK, next.stencilFuncBack, next.stencilRefBack, next.stencilMaskBack);
      gl.stencilMaskSeparate(gl.BACK, next.stencilWriteMaskBack);
      gl.stencilOpSeparate(gl.BACK, next.stencilFailOpBack, next.stencilZFailOpBack, next.stencilZPassOpBack);
    } else {
      gl.stencilFunc(next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
      gl.stencilMask(next.stencilWriteMaskFront);
      gl.stencilOp(next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
    }
    return;
  }

  if (next.stencilSep) {
    // front
    if (
      cur.stencilFuncFront !== next.stencilFuncFront ||
      cur.stencilRefFront !== next.stencilRefFront ||
      cur.stencilMaskFront !== next.stencilMaskFront
    ) {
      gl.stencilFuncSeparate(gl.FRONT, next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
    }
    if (cur.stencilWriteMaskFront !== next.stencilWriteMaskFront) {
      gl.stencilMaskSeparate(gl.FRONT, next.stencilWriteMaskFront);
    }
    if (
      cur.stencilFailOpFront !== next.stencilFailOpFront ||
      cur.stencilZFailOpFront !== next.stencilZFailOpFront ||
      cur.stencilZPassOpFront !== next.stencilZPassOpFront
    ) {
      gl.stencilOpSeparate(gl.FRONT, next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
    }

    // back
    if (
      cur.stencilFuncBack !== next.stencilFuncBack ||
      cur.stencilRefBack !== next.stencilRefBack ||
      cur.stencilMaskBack !== next.stencilMaskBack
    ) {
      gl.stencilFuncSeparate(gl.BACK, next.stencilFuncBack, next.stencilRefBack, next.stencilMaskBack);
    }
    if (cur.stencilWriteMaskBack !== next.stencilWriteMaskBack) {
      gl.stencilMaskSeparate(gl.BACK, next.stencilWriteMaskBack);
    }
    if (
      cur.stencilFailOpBack !== next.stencilFailOpBack ||
      cur.stencilZFailOpBack !== next.stencilZFailOpBack ||
      cur.stencilZPassOpBack !== next.stencilZPassOpBack
    ) {
      gl.stencilOpSeparate(gl.BACK, next.stencilFailOpBack, next.stencilZFailOpBack, next.stencilZPassOpBack);
    }
  } else {
    if (
      cur.stencilFuncFront !== next.stencilFuncFront ||
      cur.stencilRefFront !== next.stencilRefFront ||
      cur.stencilMaskFront !== next.stencilMaskFront
    ) {
      gl.stencilFunc(next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
    }
    if (cur.stencilWriteMaskFront !== next.stencilWriteMaskFront) {
      gl.stencilMask(next.stencilWriteMaskFront);
    }
    if (
      cur.stencilFailOpFront !== next.stencilFailOpFront ||
      cur.stencilZFailOpFront !== next.stencilZFailOpFront ||
      cur.stencilZPassOpFront !== next.stencilZPassOpFront
    ) {
      gl.stencilOp(next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
    }
  }

}

/**
 * _commitCullMode
 */
function _commitCullMode(gl, cur, next) {
  if (cur.cullMode === next.cullMode) {
    return;
  }

  if (next.cullMode === enums.CULL_NONE) {
    gl.disable(gl.CULL_FACE);
    return;
  }

  gl.enable(gl.CULL_FACE);
  gl.cullFace(next.cullMode);
}

/**
 * _commitVertexBuffers
 */
function _commitVertexBuffers(device, gl, cur, next) {
  var attrsDirty = false;

  // nothing changed for vertex buffer
  if (next.maxStream === -1) {
    console.warn('VertexBuffer not assigned, please call setVertexBuffer before every draw.');
    return;
  }

  if (cur.maxStream !== next.maxStream) {
    attrsDirty = true;
  } else if (cur.program !== next.program) {
    attrsDirty = true;
  } else {
    for (var i = 0; i < next.maxStream + 1; ++i) {
      if (
        cur.vertexBuffers[i] !== next.vertexBuffers[i] ||
        cur.vertexBufferOffsets[i] !== next.vertexBufferOffsets[i]
      ) {
        attrsDirty = true;
        break;
      }
    }
  }

  if (attrsDirty) {
    for (var i$1 = 0; i$1 < device._caps.maxVertexAttribs; ++i$1) {
      device._newAttributes[i$1] = 0;
    }

    for (var i$2 = 0; i$2 < next.maxStream + 1; ++i$2) {
      var vb = next.vertexBuffers[i$2];
      var vbOffset = next.vertexBufferOffsets[i$2];
      if (!vb) {
        continue;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, vb._glID);

      for (var j = 0; j < next.program._attributes.length; ++j) {
        var attr = next.program._attributes[j];

        var el = vb._format.element(attr.name);
        if (!el) {
          console.warn(("Can not find vertex attribute: " + (attr.name)));
          continue;
        }

        if (device._enabledAttributes[attr.location] === 0) {
          gl.enableVertexAttribArray(attr.location);
          device._enabledAttributes[attr.location] = 1;
        }
        device._newAttributes[attr.location] = 1;

        gl.vertexAttribPointer(
          attr.location,
          el.num,
          el.type,
          el.normalize,
          el.stride,
          el.offset + vbOffset * el.stride
        );
      }
    }

    // disable unused attributes
    for (var i$3 = 0; i$3 < device._caps.maxVertexAttribs; ++i$3) {
      if (device._enabledAttributes[i$3] !== device._newAttributes[i$3]) {
        gl.disableVertexAttribArray(i$3);
        device._enabledAttributes[i$3] = 0;
      }
    }
  }
}

/**
 * _commitTextures
 */
function _commitTextures(gl, cur, next) {
  for (var i = 0; i < next.textureUnits.length; ++i) {
    if (cur.textureUnits[i] !== next.textureUnits[i]) {
      var texture = next.textureUnits[i];
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(texture._target, texture._glID);
    }
  }
}

/**
 * _attach
 */
function _attach(gl, location, attachment, face) {
  if ( face === void 0 ) face = 0;

  if (attachment instanceof Texture2D) {
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      location,
      gl.TEXTURE_2D,
      attachment._glID,
      0
    );
  } else if (attachment instanceof TextureCube) {
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      location,
      gl.TEXTURE_CUBE_MAP_POSITIVE_X + face,
      attachment._glID,
      0
    );
  } else {
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      location,
      gl.RENDERBUFFER,
      attachment._glID
    );
  }
}

var Device = function Device(canvasEL, opts) {
  var this$1 = this;

  var gl;

  // default options
  opts = opts || {};
  if (opts.alpha === undefined) {
    opts.alpha = false;
  }
  if (opts.stencil === undefined) {
    opts.stencil = true;
  }
  if (opts.depth === undefined) {
    opts.depth = true;
  }
  if (opts.antialias === undefined) {
    opts.antialias = false;
  }
  // NOTE: it is said the performance improved in mobile device with this flag off.
  if (opts.preserveDrawingBuffer === undefined) {
    opts.preserveDrawingBuffer = false;
  }

  try {
    gl = canvasEL.getContext('webgl', opts);
  } catch (err) {
    console.error(err);
    return;
  }

  // statics
  this._gl = gl;
  this._extensions = {};
  this._caps = {}; // capability
  this._stats = {
    texture: 0,
    vb: 0,
    ib: 0,
    drawcalls: 0,
  };

  // runtime
  this._current = new State();
  this._next = new State();
  this._uniforms = {}; // name: { value, num, dirty }
  this._vx = this._vy = this._vw = this._vh = 0;
  this._sx = this._sy = this._sw = this._sh = 0;
  this._framebuffer = null;

  this._initExtensions([
    'EXT_texture_filter_anisotropic',
    'EXT_shader_texture_lod',
    'OES_standard_derivatives',
    'OES_texture_float',
    'OES_texture_float_linear',
    'OES_texture_half_float',
    'OES_texture_half_float_linear',
    'OES_vertex_array_object',
    'WEBGL_compressed_texture_atc',
    'WEBGL_compressed_texture_etc1',
    'WEBGL_compressed_texture_pvrtc',
    'WEBGL_compressed_texture_s3tc',
    'WEBGL_depth_texture',
    'WEBGL_draw_buffers' ]);
  this._initCaps();
  this._initStates();

  //
  this._enabledAttributes = new Array(this._caps.maxVertexAttribs);
  this._newAttributes = new Array(this._caps.maxVertexAttribs);

  for (var i = 0; i < this._caps.maxVertexAttribs; ++i) {
    this$1._enabledAttributes[i] = 0;
    this$1._newAttributes[i] = 0;
  }
};

Device.prototype._initExtensions = function _initExtensions (extensions) {
    var this$1 = this;

  var gl = this._gl;

  for (var i = 0; i < extensions.length; ++i) {
    var name = extensions[i];

    try {
      var ext = gl.getExtension(name);
      if (ext) {
        this$1._extensions[name] = ext;
      }
    } catch (e) {
      console.error(e);
    }
  }
};

Device.prototype._initCaps = function _initCaps () {
  var gl = this._gl;
  var extDrawBuffers = this.ext('WEBGL_draw_buffers');

  this._caps.maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
  this._caps.maxFragUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
  this._caps.maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
  this._caps.maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);

  this._caps.maxDrawBuffers = extDrawBuffers ? gl.getParameter(extDrawBuffers.MAX_DRAW_BUFFERS_WEBGL) : 1;
  this._caps.maxColorAttachments = extDrawBuffers ? gl.getParameter(extDrawBuffers.MAX_COLOR_ATTACHMENTS_WEBGL) : 1;
};

Device.prototype._initStates = function _initStates () {
  var gl = this._gl;

  // gl.frontFace(gl.CCW);
  gl.disable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ZERO);
  gl.blendEquation(gl.FUNC_ADD);
  gl.blendColor(1,1,1,1);

  gl.colorMask(true, true, true, true);

  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  gl.disable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  gl.depthMask(false);
  gl.disable(gl.POLYGON_OFFSET_FILL);
  gl.depthRange(0,1);

  gl.disable(gl.STENCIL_TEST);
  gl.stencilFunc(gl.ALWAYS, 0, 0xFF);
  gl.stencilMask(0xFF);
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

  // TODO:
  // this.setAlphaToCoverage(false);
  // this.setTransformFeedbackBuffer(null);
  // this.setRaster(true);
  // this.setDepthBias(false);

  gl.clearDepth(1);
  gl.clearColor(0, 0, 0, 0);
  gl.clearStencil(0);

  gl.disable(gl.SCISSOR_TEST);
};

Device.prototype._restoreTexture = function _restoreTexture (unit) {
  var gl = this._gl;

  var texture = this._current.textureUnits[unit];
  if (texture) {
    gl.bindTexture(texture._target, texture._glID);
  } else {
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
};

Device.prototype._restoreIndexBuffer = function _restoreIndexBuffer () {
  var gl = this._gl;

  var ib = this._current.indexBuffer;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib ? ib._glID : null);
};

/**
 * @method ext
 * @param {string} name
 */
Device.prototype.ext = function ext (name) {
  return this._extensions[name];
};

// ===============================
// Immediate Settings
// ===============================

/**
 * @method setFrameBuffer
 * @param {FrameBuffer} fb - null means use the backbuffer
 */
Device.prototype.setFrameBuffer = function setFrameBuffer (fb) {
    var this$1 = this;

  if (this._framebuffer === fb) {
    return;
  }

  this._framebuffer = fb;
  var gl = this._gl;

  if (fb === null) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return;
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, fb._glID);

  var numColors = this._framebuffer._colors.length;
  for (var i = 0; i < numColors; ++i) {
    var colorBuffer = this$1._framebuffer._colors[i];
    _attach(gl, gl.COLOR_ATTACHMENT0 + i, colorBuffer);

    // TODO: what about cubemap face??? should be the target parameter for colorBuffer
  }
  for (var i$1 = numColors; i$1 < this._caps.maxColorAttachments; ++i$1) {
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0 + i$1,
      gl.TEXTURE_2D,
      null,
      0
    );
  }

  if (this._framebuffer._depth) {
    _attach(gl, gl.DEPTH_ATTACHMENT, this._framebuffer._depth);
  }

  if (this._framebuffer._stencil) {
    _attach(gl, gl.STENCIL_ATTACHMENT, fb._stencil);
  }

  if (this._framebuffer._depthStencil) {
    _attach(gl, gl.DEPTH_STENCIL_ATTACHMENT, fb._depthStencil);
  }
};

/**
 * @method setViewport
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 */
Device.prototype.setViewport = function setViewport (x, y, w, h) {
  if (
    this._vx !== x ||
    this._vy !== y ||
    this._vw !== w ||
    this._vh !== h
  ) {
    this._gl.viewport(x, y, w, h);
    this._vx = x;
    this._vy = y;
    this._vw = w;
    this._vh = h;
  }
};

/**
 * @method setScissor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 */
Device.prototype.setScissor = function setScissor (x, y, w, h) {
  if (
    this._sx !== x ||
    this._sy !== y ||
    this._sw !== w ||
    this._sh !== h
  ) {
    this._gl.scissor(x, y, w, h);
    this._sx = x;
    this._sy = y;
    this._sw = w;
    this._sh = h;
  }
};

/**
 * @method clear
 * @param {Object} opts
 * @param {Array} opts.color
 * @param {Number} opts.depth
 * @param {Number} opts.stencil
 */
Device.prototype.clear = function clear (opts) {
  var gl = this._gl;
  var flags = 0;

  if (opts.color !== undefined) {
    flags |= gl.COLOR_BUFFER_BIT;
    gl.clearColor(opts.color[0], opts.color[1], opts.color[2], opts.color[3]);
  }

  if (opts.depth !== undefined) {
    flags |= gl.DEPTH_BUFFER_BIT;
    gl.clearDepth(opts.depth);

    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true);
    gl.depthFunc(gl.ALWAYS);
  }

  if (opts.stencil !== undefined) {
    flags |= gl.STENCIL_BUFFER_BIT;
    gl.clearStencil(opts.stencil);
  }

  gl.clear(flags);

  // restore depth-write
  if (opts.depth !== undefined) {
    if (this._current.depthTest === false) {
      gl.disable(gl.DEPTH_TEST);
    } else {
      if (this._current.depthWrite === false) {
        gl.depthMask(false);
      }
      if (this._current.depthFunc !== enums.DS_FUNC_ALWAYS) {
        gl.depthFunc(this._current.depthFunc);
      }
    }
  }
};

// ===============================
// Deferred States
// ===============================

/**
 * @method enableBlend
 */
Device.prototype.enableBlend = function enableBlend () {
  this._next.blend = true;
};

/**
 * @method enableDepthTest
 */
Device.prototype.enableDepthTest = function enableDepthTest () {
  this._next.depthTest = true;
};

/**
 * @method enableDepthWrite
 */
Device.prototype.enableDepthWrite = function enableDepthWrite () {
  this._next.depthWrite = true;
};

/**
 * @method enableStencilTest
 */
Device.prototype.enableStencilTest = function enableStencilTest () {
  this._next.stencilTest = true;
};

/**
 * @method setStencilFunc
 * @param {DS_FUNC_*} func
 * @param {Number} ref
 * @param {Number} mask
 */
Device.prototype.setStencilFunc = function setStencilFunc (func, ref, mask) {
  this._next.stencilSep = false;
  this._next.stencilFuncFront = this._next.stencilFuncBack = func;
  this._next.stencilRefFront = this._next.stencilRefBack = ref;
  this._next.stencilMaskFront = this._next.stencilMaskBack = mask;
};

/**
 * @method setStencilFuncFront
 * @param {DS_FUNC_*} func
 * @param {Number} ref
 * @param {Number} mask
 */
Device.prototype.setStencilFuncFront = function setStencilFuncFront (func, ref, mask) {
  this._next.stencilSep = true;
  this._next.stencilFuncFront = func;
  this._next.stencilRefFront = ref;
  this._next.stencilMaskFront = mask;
};

/**
 * @method setStencilFuncBack
 * @param {DS_FUNC_*} func
 * @param {Number} ref
 * @param {Number} mask
 */
Device.prototype.setStencilFuncBack = function setStencilFuncBack (func, ref, mask) {
  this._next.stencilSep = true;
  this._next.stencilFuncBack = func;
  this._next.stencilRefBack = ref;
  this._next.stencilMaskBack = mask;
};

/**
 * @method setStencilOp
 * @param {STENCIL_OP_*} failOp
 * @param {STENCIL_OP_*} zFailOp
 * @param {STENCIL_OP_*} zPassOp
 * @param {Number} writeMask
 */
Device.prototype.setStencilOp = function setStencilOp (failOp, zFailOp, zPassOp, writeMask) {
  this._next.stencilFailOpFront = this._next.stencilFailOpBack = failOp;
  this._next.stencilZFailOpFront = this._next.stencilZFailOpBack = zFailOp;
  this._next.stencilZPassOpFront = this._next.stencilZPassOpBack = zPassOp;
  this._next.stencilWriteMaskFront = this._next.stencilWriteMaskBack = writeMask;
};

/**
 * @method setStencilOpFront
 * @param {STENCIL_OP_*} failOp
 * @param {STENCIL_OP_*} zFailOp
 * @param {STENCIL_OP_*} zPassOp
 * @param {Number} writeMask
 */
Device.prototype.setStencilOpFront = function setStencilOpFront (failOp, zFailOp, zPassOp, writeMask) {
  this._next.stencilSep = true;
  this._next.stencilFailOpFront = failOp;
  this._next.stencilZFailOpFront = zFailOp;
  this._next.stencilZPassOpFront = zPassOp;
  this._next.stencilWriteMaskFront = writeMask;
};

/**
 * @method setStencilOpBack
 * @param {STENCIL_OP_*} failOp
 * @param {STENCIL_OP_*} zFailOp
 * @param {STENCIL_OP_*} zPassOp
 * @param {Number} writeMask
 */
Device.prototype.setStencilOpBack = function setStencilOpBack (failOp, zFailOp, zPassOp, writeMask) {
  this._next.stencilSep = true;
  this._next.stencilFailOpBack = failOp;
  this._next.stencilZFailOpBack = zFailOp;
  this._next.stencilZPassOpBack = zPassOp;
  this._next.stencilWriteMaskBack = writeMask;
};

/**
 * @method setDepthFunc
 * @param {DS_FUNC_*} depthFunc
 */
Device.prototype.setDepthFunc = function setDepthFunc (depthFunc) {
  this._next.depthFunc = depthFunc;
};

/**
 * @method setBlendColor32
 * @param {Number} rgba
 */
Device.prototype.setBlendColor32 = function setBlendColor32 (rgba) {
  this._next.blendColor = rgba;
};

/**
 * @method setBlendColor
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 * @param {Number} a
 */
Device.prototype.setBlendColor = function setBlendColor (r, g, b, a) {
  this._next.blendColor = ((r * 255) << 24 | (g * 255) << 16 | (b * 255) << 8 | a * 255) >>> 0;
};

/**
 * @method setBlendFunc
 * @param {BELND_*} src
 * @param {BELND_*} dst
 */
Device.prototype.setBlendFunc = function setBlendFunc (src, dst) {
  this._next.blendSep = false;
  this._next.blendSrc = src;
  this._next.blendDst = dst;
};

/**
 * @method setBlendFuncSep
 * @param {BELND_*} src
 * @param {BELND_*} dst
 * @param {BELND_*} srcAlpha
 * @param {BELND_*} dstAlpha
 */
Device.prototype.setBlendFuncSep = function setBlendFuncSep (src, dst, srcAlpha, dstAlpha) {
  this._next.blendSep = true;
  this._next.blendSrc = src;
  this._next.blendDst = dst;
  this._next.blendSrcAlpha = srcAlpha;
  this._next.blendDstAlpha = dstAlpha;
};

/**
 * @method setBlendEq
 * @param {BELND_FUNC_*} eq
 */
Device.prototype.setBlendEq = function setBlendEq (eq) {
  this._next.blendSep = false;
  this._next.blendEq = eq;
};

/**
 * @method setBlendEqSep
 * @param {BELND_FUNC_*} eq
 * @param {BELND_FUNC_*} alphaEq
 */
Device.prototype.setBlendEqSep = function setBlendEqSep (eq, alphaEq) {
  this._next.blendSep = true;
  this._next.blendEq = eq;
  this._next.blendAlphaEq = alphaEq;
};

/**
 * @method setCullMode
 * @param {CULL_*} mode
 */
Device.prototype.setCullMode = function setCullMode (mode) {
  this._next.cullMode = mode;
};

/**
 * @method setVertexBuffer
 * @param {Number} stream
 * @param {VertexBuffer} buffer
 * @param {Number} start - start vertex
 */
Device.prototype.setVertexBuffer = function setVertexBuffer (stream, buffer, start) {
    if ( start === void 0 ) start = 0;

  this._next.vertexBuffers[stream] = buffer;
  this._next.vertexBufferOffsets[stream] = start;
  if (this._next.maxStream < stream) {
    this._next.maxStream = stream;
  }
};

/**
 * @method setIndexBuffer
 * @param {IndexBuffer} buffer
 */
Device.prototype.setIndexBuffer = function setIndexBuffer (buffer) {
  this._next.indexBuffer = buffer;
};

/**
 * @method setProgram
 * @param {Program} program
 */
Device.prototype.setProgram = function setProgram (program) {
  this._next.program = program;
};

/**
 * @method setTexture
 * @param {String} name
 * @param {Texture} texture
 * @param {Number} slot
 */
Device.prototype.setTexture = function setTexture (name, texture, slot) {
  if (slot >= this._caps.maxTextureUnits) {
    console.warn(("Can not set texture " + name + " at stage " + slot + ", max texture exceed: " + (this._caps.maxTextureUnits)));
    return;
  }

  this._next.textureUnits[slot] = texture;
  this.setUniform(name, slot);
};

/**
 * @method setTextureArray
 * @param {String} name
 * @param {Array} textures
 * @param {Int32Array} slots
 */
Device.prototype.setTextureArray = function setTextureArray (name, textures, slots) {
    var this$1 = this;

  var len = textures.length;
  if (len >= this._caps.maxTextureUnits) {
    console.warn(("Can not set " + len + " textures for " + name + ", max texture exceed: " + (this._caps.maxTextureUnits)));
    return;
  }
  for (var i = 0; i < len; ++i) {
    var slot = slots[i];
    this$1._next.textureUnits[slot] = textures[i];
  }
  this.setUniform(name, slots);
};

/**
 * @method setUniform
 * @param {String} name
 * @param {*} value
 */
Device.prototype.setUniform = function setUniform (name, value) {
  var uniform = this._uniforms[name];
  if (!uniform) {
    uniform = {
      dirty: true,
      value: value,
    };
  } else {
    uniform.dirty = true;
    uniform.value = value;
  }
  this._uniforms[name] = uniform;
};

/**
 * @method setPrimitiveType
 * @param {PT_*} type
 */
Device.prototype.setPrimitiveType = function setPrimitiveType (type) {
  this._next.primitiveType = type;
};

/**
 * @method draw
 * @param {Number} base
 * @param {Number} count
 */
Device.prototype.draw = function draw (base, count) {
    var this$1 = this;

  var gl = this._gl;
  var cur = this._current;
  var next = this._next;

  // commit blend
  _commitBlendStates(gl, cur, next);

  // commit depth
  _commitDepthStates(gl, cur, next);

  // commit stencil
  _commitStencilStates(gl, cur, next);

  // commit cull
  _commitCullMode(gl, cur, next);

  // commit vertex-buffer
  _commitVertexBuffers(this, gl, cur, next);

  // commit index-buffer
  if (cur.indexBuffer !== next.indexBuffer) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, next.indexBuffer ? next.indexBuffer._glID : null);
  }

  // commit program
  var programDirty = false;
  if (cur.program !== next.program) {
    if (next.program._linked) {
      gl.useProgram(next.program._glID);
    } else {
      console.warn('Failed to use program: has not linked yet.');
    }
    programDirty = true;
  }

  // commit texture/sampler
  _commitTextures(gl, cur, next);

  // commit uniforms
  for (var i = 0; i < next.program._uniforms.length; ++i) {
    var uniformInfo = next.program._uniforms[i];
    var uniform = this$1._uniforms[uniformInfo.name];
    if (!uniform) {
      // console.warn(`Can not find uniform ${uniformInfo.name}`);
      continue;
    }

    if (!programDirty && !uniform.dirty) {
      continue;
    }

    uniform.dirty = false;

    // TODO: please consider array uniform: uniformInfo.size > 0

    var commitFunc = (uniformInfo.size === undefined) ? _type2uniformCommit[uniformInfo.type] : _type2uniformArrayCommit[uniformInfo.type];
    if (!commitFunc) {
      console.warn(("Can not find commit function for uniform " + (uniformInfo.name)));
      continue;
    }

    commitFunc(gl, uniformInfo.location, uniform.value);
  }

  // drawPrimitives
  if (next.indexBuffer) {
    gl.drawElements(
      this._next.primitiveType,
      count,
      next.indexBuffer._format,
      base * next.indexBuffer._bytesPerIndex
    );
  } else {
    gl.drawArrays(
      this._next.primitiveType,
      base,
      count
    );
  }

  // TODO: autogen mipmap for color buffer
  // if (this._framebuffer && this._framebuffer.colors[0].mipmap) {
  // gl.bindTexture(this._framebuffer.colors[i]._target, colors[i]._glID);
  // gl.generateMipmap(this._framebuffer.colors[i]._target);
  // }

  // update stats
  this._stats.drawcalls += 1;

  // reset states
  cur.set(next);
  next.reset();
};

var gfx = {
  // classes
  VertexFormat: VertexFormat,
  IndexBuffer: IndexBuffer,
  VertexBuffer: VertexBuffer,
  Program: Program,
  Texture: Texture,
  Texture2D: Texture2D,
  TextureCube: TextureCube,
  RenderBuffer: RenderBuffer,
  FrameBuffer: FrameBuffer,
  Device: Device,

  // functions
  attrTypeBytes: attrTypeBytes,
  glFilter: glFilter,
  glTextureFmt: glTextureFmt,
};
Object.assign(gfx, enums);

var enums$1 = {
  // projection
  PROJ_PERSPECTIVE: 0,
  PROJ_ORTHO: 1,

  // lights
  LIGHT_DIRECTIONAL: 0,
  LIGHT_POINT: 1,
  LIGHT_SPOT: 2,

  // shadows
  SHADOW_NONE: 0,
  SHADOW_HARD: 1,
  SHADOW_SOFT: 2,

  // parameter type
  PARAM_INT:             0,
  PARAM_INT2:            1,
  PARAM_INT3:            2,
  PARAM_INT4:            3,
  PARAM_FLOAT:           4,
  PARAM_FLOAT2:          5,
  PARAM_FLOAT3:          6,
  PARAM_FLOAT4:          7,
  PARAM_COLOR3:          8,
  PARAM_COLOR4:          9,
  PARAM_MAT2:           10,
  PARAM_MAT3:           11,
  PARAM_MAT4:           12,
  PARAM_TEXTURE_2D:     13,
  PARAM_TEXTURE_CUBE:   14,

  // clear flags
  CLEAR_COLOR: 1,
  CLEAR_DEPTH: 2,
  CLEAR_STENCIL: 4,
};

var InputAssembler = function InputAssembler(vb, ib, pt) {
  if ( pt === void 0 ) pt = gfx.PT_TRIANGLES;

  this._vertexBuffer = vb;
  this._indexBuffer = ib;
  this._primitiveType = pt;
  this._start = 0;
  this._count = -1;

  // TODO: instancing data
  // this._stream = 0;
};

InputAssembler.prototype.getPrimitiveCount = function getPrimitiveCount () {
  if (this._count !== -1) {
    return this._count;
  }

  if (this._indexBuffer) {
    return this._indexBuffer.count;
  }

  return this._vertexBuffer.count;
};

var Pass = function Pass(name) {
  this._programName = name;

  // cullmode
  this._cullMode = gfx.CULL_BACK;

  // blending
  this._blend = false;
  this._blendEq = gfx.BLEND_FUNC_ADD;
  this._blendAlphaEq = gfx.BLEND_FUNC_ADD;
  this._blendSrc = gfx.BLEND_ONE;
  this._blendDst = gfx.BLEND_ZERO;
  this._blendSrcAlpha = gfx.BLEND_ONE;
  this._blendDstAlpha = gfx.BLEND_ZERO;
  this._blendColor = 0xffffffff;

  // depth
  this._depthTest = false;
  this._depthWrite = false;
  this._depthFunc = gfx.DS_FUNC_LESS,

  // stencil
  this._stencilTest = false;
  // front
  this._stencilFuncFront = gfx.DS_FUNC_ALWAYS;
  this._stencilRefFront = 0;
  this._stencilMaskFront = 0xff;
  this._stencilFailOpFront = gfx.STENCIL_OP_KEEP;
  this._stencilZFailOpFront = gfx.STENCIL_OP_KEEP;
  this._stencilZPassOpFront = gfx.STENCIL_OP_KEEP;
  this._stencilWriteMaskFront = 0xff;
  // back
  this._stencilFuncBack = gfx.DS_FUNC_ALWAYS;
  this._stencilRefBack = 0;
  this._stencilMaskBack = 0xff;
  this._stencilFailOpBack = gfx.STENCIL_OP_KEEP;
  this._stencilZFailOpBack = gfx.STENCIL_OP_KEEP;
  this._stencilZPassOpBack = gfx.STENCIL_OP_KEEP;
  this._stencilWriteMaskBack = 0xff;
};

Pass.prototype.setCullMode = function setCullMode (cullMode) {
  this._cullMode = cullMode;
};

Pass.prototype.setBlend = function setBlend (
  blendEq,
  blendSrc,
  blendDst,
  blendAlphaEq,
  blendSrcAlpha,
  blendDstAlpha,
  blendColor
) {
    if ( blendEq === void 0 ) blendEq = gfx.BLEND_FUNC_ADD;
    if ( blendSrc === void 0 ) blendSrc = gfx.BLEND_ONE;
    if ( blendDst === void 0 ) blendDst = gfx.BLEND_ZERO;
    if ( blendAlphaEq === void 0 ) blendAlphaEq = gfx.BLEND_FUNC_ADD;
    if ( blendSrcAlpha === void 0 ) blendSrcAlpha = gfx.BLEND_ONE;
    if ( blendDstAlpha === void 0 ) blendDstAlpha = gfx.BLEND_ZERO;
    if ( blendColor === void 0 ) blendColor = 0xffffffff;

  this._blend = true;
  this._blendEq = blendEq;
  this._blendSrc = blendSrc;
  this._blendDst = blendDst;
  this._blendAlphaEq = blendAlphaEq;
  this._blendSrcAlpha = blendSrcAlpha;
  this._blendDstAlpha = blendDstAlpha;
  this._blendColor = blendColor;
};

Pass.prototype.setDepth = function setDepth (
  depthTest,
  depthWrite,
  depthFunc
) {
    if ( depthTest === void 0 ) depthTest = false;
    if ( depthWrite === void 0 ) depthWrite = false;
    if ( depthFunc === void 0 ) depthFunc = gfx.DS_FUNC_LESS;

  this._depthTest = depthTest;
  this._depthWrite = depthWrite;
  this._depthFunc = depthFunc;
};

Pass.prototype.setStencilFront = function setStencilFront (
  stencilFunc,
  stencilRef,
  stencilMask,
  stencilFailOp,
  stencilZFailOp,
  stencilZPassOp,
  stencilWriteMask
) {
    if ( stencilFunc === void 0 ) stencilFunc = gfx.DS_FUNC_ALWAYS;
    if ( stencilRef === void 0 ) stencilRef = 0;
    if ( stencilMask === void 0 ) stencilMask = 0xff;
    if ( stencilFailOp === void 0 ) stencilFailOp = gfx.STENCIL_OP_KEEP;
    if ( stencilZFailOp === void 0 ) stencilZFailOp = gfx.STENCIL_OP_KEEP;
    if ( stencilZPassOp === void 0 ) stencilZPassOp = gfx.STENCIL_OP_KEEP;
    if ( stencilWriteMask === void 0 ) stencilWriteMask = 0xff;

  this._stencilTest = true;
  this._stencilFuncFront = stencilFunc;
  this._stencilRefFront = stencilRef;
  this._stencilMaskFront = stencilMask;
  this._stencilFailOpFront = stencilFailOp;
  this._stencilZFailOpFront = stencilZFailOp;
  this._stencilZPassOpFront = stencilZPassOp;
  this._stencilWriteMaskFront = stencilWriteMask;
};

Pass.prototype.setStencilBack = function setStencilBack (
  stencilFunc,
  stencilRef,
  stencilMask,
  stencilFailOp,
  stencilZFailOp,
  stencilZPassOp,
  stencilWriteMask
) {
    if ( stencilFunc === void 0 ) stencilFunc = gfx.DS_FUNC_ALWAYS;
    if ( stencilRef === void 0 ) stencilRef = 0;
    if ( stencilMask === void 0 ) stencilMask = 0xff;
    if ( stencilFailOp === void 0 ) stencilFailOp = gfx.STENCIL_OP_KEEP;
    if ( stencilZFailOp === void 0 ) stencilZFailOp = gfx.STENCIL_OP_KEEP;
    if ( stencilZPassOp === void 0 ) stencilZPassOp = gfx.STENCIL_OP_KEEP;
    if ( stencilWriteMask === void 0 ) stencilWriteMask = 0xff;

  this._stencilTest = true;
  this._stencilFuncBack = stencilFunc;
  this._stencilRefBack = stencilRef;
  this._stencilMaskBack = stencilMask;
  this._stencilFailOpBack = stencilFailOp;
  this._stencilZFailOpBack = stencilZFailOp;
  this._stencilZPassOpBack = stencilZPassOp;
  this._stencilWriteMaskBack = stencilWriteMask;
};

var _stageOffset = 0;
var _name2stageID = {};

var config = {
  addStage: function (name) {
    // already added
    if (_name2stageID[name] !== undefined) {
      return;
    }

    var stageID = 1 << _stageOffset;
    _name2stageID[name] = stageID;

    _stageOffset += 1;
  },

  stageID: function (name) {
    var id = _name2stageID[name];
    if (id === undefined) {
      return -1;
    }
    return id;
  },

  stageIDs: function (nameList) {
    var key = 0;
    for (var i = 0; i < nameList.length; ++i) {
      var id = _name2stageID[nameList[i]];
      if (id !== undefined) {
        key |= id;
      }
    }
    return key;
  }
};

var _genID$1 = 0;

var Technique = function Technique(stages, parameters, passes, layer) {
  if ( layer === void 0 ) layer = 0;

  this._id = _genID$1++;
  this._stageIDs = config.stageIDs(stages);
  this._parameters = parameters; // {name, type, size, val}
  this._passes = passes;
  this._layer = layer;
  // TODO: this._version = 'webgl' or 'webgl2' // ????
};

var prototypeAccessors$3 = { passes: { configurable: true },stageIDs: { configurable: true } };

Technique.prototype.setStages = function setStages (stages) {
  this._stageIDs = config.stageIDs(stages);
};

prototypeAccessors$3.passes.get = function () {
  return this._passes;
};

prototypeAccessors$3.stageIDs.get = function () {
  return this._stageIDs;
};

Object.defineProperties( Technique.prototype, prototypeAccessors$3 );

var Effect = function Effect(techniques, values, opts) {
  if ( values === void 0 ) values = {};
  if ( opts === void 0 ) opts = [];

  this._techniques = techniques;
  this._values = values;
  this._options = opts;

  // TODO: check if params is valid for current technique???
};

Effect.prototype.getTechnique = function getTechnique (stage) {
    var this$1 = this;

  var stageID = config.stageID(stage);
  for (var i = 0; i < this._techniques.length; ++i) {
    var tech = this$1._techniques[i];
    if (tech.stageIDs & stageID) {
      return tech;
    }
  }

  return null;
};

Effect.prototype.getValue = function getValue (name) {
  return this._values[name];
};

Effect.prototype.setValue = function setValue (name, value) {
  // TODO: check if params is valid for current technique???
  this._values[name] = value;
};

Effect.prototype.getOption = function getOption (name) {
    var this$1 = this;

  for (var i = 0; i < this._options.length; ++i) {
    var opt = this$1._options[i];
    if ( opt.name === name ) {
      return opt.value;
    }
  }

  console.warn(("Failed to get option " + name + ", option not found."));
  return null;
};

Effect.prototype.setOption = function setOption (name, value) {
    var this$1 = this;

  for (var i = 0; i < this._options.length; ++i) {
    var opt = this$1._options[i];
    if ( opt.name === name ) {
      opt.value = value;
      return;
    }
  }

  console.warn(("Failed to set option " + name + ", option not found."));
};

Effect.prototype.extractOptions = function extractOptions (out) {
    var this$1 = this;
    if ( out === void 0 ) out = {};

  for (var i = 0; i < this._options.length; ++i) {
    var opt = this$1._options[i];
    out[opt.name] = opt.value;
  }

  return out;
};

/**
 * @param {object} json
 */


/**
 * @param {gfx.Device} device
 * @param {Object} data
 */
function createIA(device, data) {
  if (!data.positions) {
    console.error('The data must have positions field');
    return null;
  }

  var verts = [];
  var vcount = data.positions.length / 3;

  for (var i = 0; i < vcount; ++i) {
    verts.push(data.positions[3 * i], data.positions[3 * i + 1], data.positions[3 * i + 2]);

    if (data.normals) {
      verts.push(data.normals[3 * i], data.normals[3 * i + 1], data.normals[3 * i + 2]);
    }

    if (data.uvs) {
      verts.push(data.uvs[2 * i], data.uvs[2 * i + 1]);
    }
  }

  var vfmt = [];
  vfmt.push({ name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 });
  if (data.normals) {
    vfmt.push({ name: gfx.ATTR_NORMAL, type: gfx.ATTR_TYPE_FLOAT32, num: 3 });
  }
  if (data.uvs) {
    vfmt.push({ name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 });
  }

  var vb = new gfx.VertexBuffer(
    device,
    new gfx.VertexFormat(vfmt),
    gfx.USAGE_STATIC,
    new Float32Array(verts),
    vcount
  );

  var ib = null;
  if (data.indices) {
    ib = new gfx.IndexBuffer(
      device,
      gfx.INDEX_FMT_UINT16,
      gfx.USAGE_STATIC,
      new Uint16Array(data.indices),
      data.indices.length
    );
  }

  return new InputAssembler(vb, ib);
}

var _d2r = Math.PI / 180.0;
var _r2d = 180.0 / Math.PI;

/**
 * @property {number} EPSILON
 */
var EPSILON = 0.000001;

/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */
function equals(a, b) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}

/**
 * Tests whether or not the arguments have approximately the same value by given maxDiff
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @param {Number} maxDiff Maximum difference.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */
function approx(a, b, maxDiff) {
  maxDiff = maxDiff || EPSILON;
  return Math.abs(a - b) <= maxDiff;
}

/**
 * Clamps a value between a minimum float and maximum float value.
 *
 * @method clamp
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
function clamp(val, min, max) {
  return val < min ? min : val > max ? max : val;
}

/**
 * Clamps a value between 0 and 1.
 *
 * @method clamp01
 * @param {number} val
 * @return {number}
 */
function clamp01(val) {
  return val < 0 ? 0 : val > 1 ? 1 : val;
}

/**
 * @method lerp
 * @param {number} from
 * @param {number} to
 * @param {number} ratio - the interpolation coefficient
 * @return {number}
 */
function lerp(from, to, ratio) {
  return from + (to - from) * ratio;
}

/**
* Convert Degree To Radian
*
* @param {Number} a Angle in Degrees
*/
function toRadian(a) {
  return a * _d2r;
}

/**
* Convert Radian To Degree
*
* @param {Number} a Angle in Radian
*/
function toDegree(a) {
  return a * _r2d;
}

/**
* @method random
*/
var random = Math.random;

/**
 * Returns a floating-point random number between min (inclusive) and max (exclusive).
 *
 * @method randomRange
 * @param {number} min
 * @param {number} max
 * @return {number} the random number
 */
function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (exclusive).
 *
 * @method randomRangeInt
 * @param {number} min
 * @param {number} max
 * @return {number} the random integer
 */
function randomRangeInt(min, max) {
  return Math.floor(randomRange(min, max));
}

/**
 * Returns the next power of two for the value
 *
 * @method nextPow2
 * @param {number} val
 * @return {number} the the next power of two
 */
function nextPow2(val) {
  --val;
  val = (val >> 1) | val;
  val = (val >> 2) | val;
  val = (val >> 4) | val;
  val = (val >> 8) | val;
  val = (val >> 16) | val;
  ++val;

  return val;
}

/**
 * Bit twiddling hacks for JavaScript.
 *
 * Author: Mikola Lysenko
 *
 * Ported from Stanford bit twiddling hack library:
 *    http://graphics.stanford.edu/~seander/bithacks.html
 */

// Number of bits in an integer
var INT_BITS = 32;
var INT_MAX =  0x7fffffff;
var INT_MIN = -1<<(INT_BITS-1);

/**
 * Returns -1, 0, +1 depending on sign of x
 *
 * @param {number} v
 * @returns {number}
 */
function sign(v) {
  return (v > 0) - (v < 0);
}

/**
 * Computes absolute value of integer
 *
 * @param {number} v
 * @returns {number}
 */
function abs(v) {
  var mask = v >> (INT_BITS-1);
  return (v ^ mask) - mask;
}

/**
 * Computes minimum of integers x and y
 *
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
function min(x, y) {
  return y ^ ((x ^ y) & -(x < y));
}

/**
 * Computes maximum of integers x and y
 *
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
function max(x, y) {
  return x ^ ((x ^ y) & -(x < y));
}

/**
 * Checks if a number is a power of two
 *
 * @param {number} v
 * @returns {boolean}
 */
function isPow2$1(v) {
  return !(v & (v-1)) && (!!v);
}

/**
 * Computes log base 2 of v
 *
 * @param {number} v
 * @returns {number}
 */
function log2(v) {
  var r, shift;
  r =     (v > 0xFFFF) << 4; v >>>= r;
  shift = (v > 0xFF  ) << 3; v >>>= shift; r |= shift;
  shift = (v > 0xF   ) << 2; v >>>= shift; r |= shift;
  shift = (v > 0x3   ) << 1; v >>>= shift; r |= shift;
  return r | (v >> 1);
}

/**
 * Computes log base 10 of v
 *
 * @param {number} v
 * @returns {number}
 */
function log10(v) {
  return  (v >= 1000000000) ? 9 : (v >= 100000000) ? 8 : (v >= 10000000) ? 7 :
          (v >= 1000000) ? 6 : (v >= 100000) ? 5 : (v >= 10000) ? 4 :
          (v >= 1000) ? 3 : (v >= 100) ? 2 : (v >= 10) ? 1 : 0;
}

/**
 * Counts number of bits
 *
 * @param {number} v
 * @returns {number}
 */
function popCount(v) {
  v = v - ((v >>> 1) & 0x55555555);
  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
  return ((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
}

/**
 * Counts number of trailing zeros
 *
 * @param {number} v
 * @returns {number}
 */
function countTrailingZeros(v) {
  var c = 32;
  v &= -v;
  if (v) { c--; }
  if (v & 0x0000FFFF) { c -= 16; }
  if (v & 0x00FF00FF) { c -= 8; }
  if (v & 0x0F0F0F0F) { c -= 4; }
  if (v & 0x33333333) { c -= 2; }
  if (v & 0x55555555) { c -= 1; }
  return c;
}

/**
 * Rounds to next power of 2
 *
 * @param {number} v
 * @returns {number}
 */
function nextPow2$1(v) {
  v += v === 0;
  --v;
  v |= v >>> 1;
  v |= v >>> 2;
  v |= v >>> 4;
  v |= v >>> 8;
  v |= v >>> 16;
  return v + 1;
}

/**
 * Rounds down to previous power of 2
 *
 * @param {number} v
 * @returns {number}
 */
function prevPow2(v) {
  v |= v >>> 1;
  v |= v >>> 2;
  v |= v >>> 4;
  v |= v >>> 8;
  v |= v >>> 16;
  return v - (v>>>1);
}

/**
 * Computes parity of word
 *
 * @param {number} v
 * @returns {number}
 */
function parity(v) {
  v ^= v >>> 16;
  v ^= v >>> 8;
  v ^= v >>> 4;
  v &= 0xf;
  return (0x6996 >>> v) & 1;
}

var REVERSE_TABLE = new Array(256);

(function(tab) {
  for(var i=0; i<256; ++i) {
    var v = i, r = i, s = 7;
    for (v >>>= 1; v; v >>>= 1) {
      r <<= 1;
      r |= v & 1;
      --s;
    }
    tab[i] = (r << s) & 0xff;
  }
})(REVERSE_TABLE);

/**
 * Reverse bits in a 32 bit word
 *
 * @param {number} v
 * @returns {number}
 */
function reverse(v) {
  return (REVERSE_TABLE[v & 0xff] << 24) |
         (REVERSE_TABLE[(v >>> 8) & 0xff] << 16) |
         (REVERSE_TABLE[(v >>> 16) & 0xff] << 8) |
         REVERSE_TABLE[(v >>> 24) & 0xff];
}

/**
 * Interleave bits of 2 coordinates with 16 bits. Useful for fast quadtree codes
 *
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
function interleave2(x, y) {
  x &= 0xFFFF;
  x = (x | (x << 8)) & 0x00FF00FF;
  x = (x | (x << 4)) & 0x0F0F0F0F;
  x = (x | (x << 2)) & 0x33333333;
  x = (x | (x << 1)) & 0x55555555;

  y &= 0xFFFF;
  y = (y | (y << 8)) & 0x00FF00FF;
  y = (y | (y << 4)) & 0x0F0F0F0F;
  y = (y | (y << 2)) & 0x33333333;
  y = (y | (y << 1)) & 0x55555555;

  return x | (y << 1);
}

/**
 * Extracts the nth interleaved component
 *
 * @param {number} v
 * @param {number} n
 * @returns {number}
 */
function deinterleave2(v, n) {
  v = (v >>> n) & 0x55555555;
  v = (v | (v >>> 1))  & 0x33333333;
  v = (v | (v >>> 2))  & 0x0F0F0F0F;
  v = (v | (v >>> 4))  & 0x00FF00FF;
  v = (v | (v >>> 16)) & 0x000FFFF;
  return (v << 16) >> 16;
}

/**
 * Interleave bits of 3 coordinates, each with 10 bits.  Useful for fast octree codes
 *
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {number}
 */
function interleave3(x, y, z) {
  x &= 0x3FF;
  x  = (x | (x<<16)) & 4278190335;
  x  = (x | (x<<8))  & 251719695;
  x  = (x | (x<<4))  & 3272356035;
  x  = (x | (x<<2))  & 1227133513;

  y &= 0x3FF;
  y  = (y | (y<<16)) & 4278190335;
  y  = (y | (y<<8))  & 251719695;
  y  = (y | (y<<4))  & 3272356035;
  y  = (y | (y<<2))  & 1227133513;
  x |= (y << 1);

  z &= 0x3FF;
  z  = (z | (z<<16)) & 4278190335;
  z  = (z | (z<<8))  & 251719695;
  z  = (z | (z<<4))  & 3272356035;
  z  = (z | (z<<2))  & 1227133513;

  return x | (z << 2);
}

/**
 * Extracts nth interleaved component of a 3-tuple
 *
 * @param {number} v
 * @param {number} n
 * @returns {number}
 */
function deinterleave3(v, n) {
  v = (v >>> n)       & 1227133513;
  v = (v | (v>>>2))   & 3272356035;
  v = (v | (v>>>4))   & 251719695;
  v = (v | (v>>>8))   & 4278190335;
  v = (v | (v>>>16))  & 0x3FF;
  return (v<<22)>>22;
}

/**
 * Computes next combination in colexicographic order (this is mistakenly called nextPermutation on the bit twiddling hacks page)
 *
 * @param {number} v
 * @returns {number}
 */
function nextCombination(v) {
  var t = v | (v - 1);
  return (t + 1) | (((~t & -~t) - 1) >>> (countTrailingZeros(v) + 1));
}

var bits_ = Object.freeze({
	INT_BITS: INT_BITS,
	INT_MAX: INT_MAX,
	INT_MIN: INT_MIN,
	sign: sign,
	abs: abs,
	min: min,
	max: max,
	isPow2: isPow2$1,
	log2: log2,
	log10: log10,
	popCount: popCount,
	countTrailingZeros: countTrailingZeros,
	nextPow2: nextPow2$1,
	prevPow2: prevPow2,
	parity: parity,
	reverse: reverse,
	interleave2: interleave2,
	deinterleave2: deinterleave2,
	interleave3: interleave3,
	deinterleave3: deinterleave3,
	nextCombination: nextCombination
});

var _tmp = new Array(2);

var _vec2 = function _vec2(x, y) {
  this.x = x;
  this.y = y;
};

_vec2.prototype.toJSON = function toJSON () {
  _tmp[0] = this.x;
  _tmp[1] = this.y;

  return _tmp;
};

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */
var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function () {
  return new _vec2(0, 0);
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.new = function (x, y) {
  return new _vec2(x, y);
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function (a) {
  return new _vec2(a.x, a.y);
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function (out, a) {
  out.x = a.x;
  out.y = a.y;
  return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function (out, x, y) {
  out.x = x;
  out.y = y;
  return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function (out, a, b) {
  out.x = a.x + b.x;
  out.y = a.y + b.y;
  return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function (out, a, b) {
  out.x = a.x - b.x;
  out.y = a.y - b.y;
  return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function (out, a, b) {
  out.x = a.x * b.x;
  out.y = a.y * b.y;
  return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function (out, a, b) {
  out.x = a.x / b.x;
  out.y = a.y / b.y;
  return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Math.ceil the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to ceil
 * @returns {vec2} out
 */
vec2.ceil = function (out, a) {
  out.x = Math.ceil(a.x);
  out.y = Math.ceil(a.y);
  return out;
};

/**
 * Math.floor the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to floor
 * @returns {vec2} out
 */
vec2.floor = function (out, a) {
  out.x = Math.floor(a.x);
  out.y = Math.floor(a.y);
  return out;
};

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function (out, a, b) {
  out.x = Math.min(a.x, b.x);
  out.y = Math.min(a.y, b.y);
  return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function (out, a, b) {
  out.x = Math.max(a.x, b.x);
  out.y = Math.max(a.y, b.y);
  return out;
};

/**
 * Math.round the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to round
 * @returns {vec2} out
 */
vec2.round = function (out, a) {
  out.x = Math.round(a.x);
  out.y = Math.round(a.y);
  return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function (out, a, b) {
  out.x = a.x * b;
  out.y = a.y * b;
  return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
vec2.scaleAndAdd = function (out, a, b, scale) {
  out.x = a.x + (b.x * scale);
  out.y = a.y + (b.y * scale);
  return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function (a, b) {
  var x = b.x - a.x,
      y = b.y - a.y;
  return Math.sqrt(x * x + y * y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function (a, b) {
  var x = b.x - a.x,
      y = b.y - a.y;
  return x * x + y * y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
  var x = a.x,
      y = a.y;
  return Math.sqrt(x * x + y * y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
  var x = a.x,
      y = a.y;
  return x * x + y * y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function (out, a) {
  out.x = -a.x;
  out.y = -a.y;
  return out;
};

/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */
vec2.inverse = function (out, a) {
  out.x = 1.0 / a.x;
  out.y = 1.0 / a.y;
  return out;
};

/**
 * Returns the inverse of the components of a vec2 safely
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */
vec2.inverseSafe = function (out, a) {
  var x = a.x,
      y = a.y;

  if (Math.abs(x) < EPSILON) {
    out.x = 0;
  } else {
    out.x = 1.0 / x;
  }

  if (Math.abs(y) < EPSILON) {
    out.y = 0;
  } else {
    out.y = 1.0 / a.y;
  }

  return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function (out, a) {
  var x = a.x,
      y = a.y;
  var len = x * x + y * y;
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    out.x = a.x * len;
    out.y = a.y * len;
  }
  return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
  return a.x * b.x + a.y * b.y;
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function (out, a, b) {
  var z = a.x * b.y - a.y * b.x;
  out.x = out.y = 0;
  out.z = z;
  return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
  var ax = a.x,
      ay = a.y;
  out.x = ax + t * (b.x - ax);
  out.y = ay + t * (b.y - ay);
  return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
vec2.random = function (out, scale) {
  scale = scale || 1.0;
  var r = random() * 2.0 * Math.PI;
  out.x = Math.cos(r) * scale;
  out.y = Math.sin(r) * scale;
  return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function (out, a, m) {
  var x = a.x,
      y = a.y;
  out.x = m.m00 * x + m.m02 * y;
  out.y = m.m01 * x + m.m03 * y;
  return out;
};

/**
 * Transforms the vec2 with a mat23
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat23} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat23 = function (out, a, m) {
  var x = a.x,
      y = a.y;
  out.x = m.m00 * x + m.m02 * y + m.m04;
  out.y = m.m01 * x + m.m03 * y + m.m05;
  return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function (out, a, m) {
  var x = a.x,
      y = a.y;
  out.x = m.m00 * x + m.m03 * y + m.m06;
  out.y = m.m01 * x + m.m04 * y + m.m07;
  return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function (out, a, m) {
  var x = a.x,
      y = a.y;
  out.x = m.m00 * x + m.m04 * y + m.m12;
  out.y = m.m01 * x + m.m05 * y + m.m13;
  return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function () {
  var vec = vec2.create();

  return function (a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 2;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec.x = a[i]; vec.y = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec.x; a[i + 1] = vec.y;
    }

    return a;
  };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
  return ("vec2(" + (a.x) + ", " + (a.y) + ")");
};

/**
 * Returns typed array
 *
 * @param {array} out
 * @param {vec2} v
 * @returns {array}
 */
vec2.array = function (out, v) {
  out[0] = v.x;
  out[1] = v.y;

  return out;
};

/**
 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec2.exactEquals = function (a, b) {
  return a.x === b.x && a.y === b.y;
};

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec2.equals = function (a, b) {
  var a0 = a.x, a1 = a.y;
  var b0 = b.x, b1 = b.y;
  return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)));
};

var _tmp$1 = new Array(3);

var _vec3 = function _vec3(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
};

_vec3.prototype.toJSON = function toJSON () {
  _tmp$1[0] = this.x;
  _tmp$1[1] = this.y;
  _tmp$1[2] = this.z;

  return _tmp$1;
};

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */
var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function () {
  return new _vec3(0, 0, 0);
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.new = function (x, y, z) {
  return new _vec3(x, y, z);
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function (a) {
  return new _vec3(a.x, a.y, a.z);
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function (out, a) {
  out.x = a.x;
  out.y = a.y;
  out.z = a.z;
  return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function (out, x, y, z) {
  out.x = x;
  out.y = y;
  out.z = z;
  return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function (out, a, b) {
  out.x = a.x + b.x;
  out.y = a.y + b.y;
  out.z = a.z + b.z;
  return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function (out, a, b) {
  out.x = a.x - b.x;
  out.y = a.y - b.y;
  out.z = a.z - b.z;
  return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function (out, a, b) {
  out.x = a.x * b.x;
  out.y = a.y * b.y;
  out.z = a.z * b.z;
  return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function (out, a, b) {
  out.x = a.x / b.x;
  out.y = a.y / b.y;
  out.z = a.z / b.z;
  return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to ceil
 * @returns {vec3} out
 */
vec3.ceil = function (out, a) {
  out.x = Math.ceil(a.x);
  out.y = Math.ceil(a.y);
  out.z = Math.ceil(a.z);
  return out;
};

/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to floor
 * @returns {vec3} out
 */
vec3.floor = function (out, a) {
  out.x = Math.floor(a.x);
  out.y = Math.floor(a.y);
  out.z = Math.floor(a.z);
  return out;
};

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function (out, a, b) {
  out.x = Math.min(a.x, b.x);
  out.y = Math.min(a.y, b.y);
  out.z = Math.min(a.z, b.z);
  return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function (out, a, b) {
  out.x = Math.max(a.x, b.x);
  out.y = Math.max(a.y, b.y);
  out.z = Math.max(a.z, b.z);
  return out;
};

/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to round
 * @returns {vec3} out
 */
vec3.round = function (out, a) {
  out.x = Math.round(a.x);
  out.y = Math.round(a.y);
  out.z = Math.round(a.z);
  return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function (out, a, b) {
  out.x = a.x * b;
  out.y = a.y * b;
  out.z = a.z * b;
  return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function (out, a, b, scale) {
  out.x = a.x + (b.x * scale);
  out.y = a.y + (b.y * scale);
  out.z = a.z + (b.z * scale);
  return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function (a, b) {
  var x = b.x - a.x,
    y = b.y - a.y,
    z = b.z - a.z;
  return Math.sqrt(x * x + y * y + z * z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function (a, b) {
  var x = b.x - a.x,
      y = b.y - a.y,
      z = b.z - a.z;
  return x * x + y * y + z * z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
  var x = a.x,
      y = a.y,
      z = a.z;
  return Math.sqrt(x * x + y * y + z * z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
  var x = a.x,
      y = a.y,
      z = a.z;
  return x * x + y * y + z * z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function (out, a) {
  out.x = -a.x;
  out.y = -a.y;
  out.z = -a.z;
  return out;
};

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
vec3.inverse = function (out, a) {
  out.x = 1.0 / a.x;
  out.y = 1.0 / a.y;
  out.z = 1.0 / a.z;
  return out;
};

/**
 * Returns the inverse of the components of a vec3 safely
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
vec3.inverseSafe = function (out, a) {
  var x = a.x,
      y = a.y,
      z = a.z;

  if (Math.abs(x) < EPSILON) {
    out.x = 0;
  } else {
    out.x = 1.0 / x;
  }

  if (Math.abs(y) < EPSILON) {
    out.y = 0;
  } else {
    out.y = 1.0 / y;
  }

  if (Math.abs(z) < EPSILON) {
    out.z = 0;
  } else {
    out.z = 1.0 / z;
  }

  return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function (out, a) {
  var x = a.x,
      y = a.y,
      z = a.z;

  var len = x * x + y * y + z * z;
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    out.x = x * len;
    out.y = y * len;
    out.z = z * len;
  }
  return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function (out, a, b) {
  var ax = a.x, ay = a.y, az = a.z,
      bx = b.x, by = b.y, bz = b.z;

  out.x = ay * bz - az * by;
  out.y = az * bx - ax * bz;
  out.z = ax * by - ay * bx;
  return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
  var ax = a.x,
      ay = a.y,
      az = a.z;
  out.x = ax + t * (b.x - ax);
  out.y = ay + t * (b.y - ay);
  out.z = az + t * (b.z - az);
  return out;
};

/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.hermite = function (out, a, b, c, d, t) {
  var factorTimes2 = t * t,
      factor1 = factorTimes2 * (2 * t - 3) + 1,
      factor2 = factorTimes2 * (t - 2) + t,
      factor3 = factorTimes2 * (t - 1),
      factor4 = factorTimes2 * (3 - 2 * t);

  out.x = a.x * factor1 + b.x * factor2 + c.x * factor3 + d.x * factor4;
  out.y = a.y * factor1 + b.y * factor2 + c.y * factor3 + d.y * factor4;
  out.z = a.z * factor1 + b.z * factor2 + c.z * factor3 + d.z * factor4;

  return out;
};

/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.bezier = function (out, a, b, c, d, t) {
  var inverseFactor = 1 - t,
      inverseFactorTimesTwo = inverseFactor * inverseFactor,
      factorTimes2 = t * t,
      factor1 = inverseFactorTimesTwo * inverseFactor,
      factor2 = 3 * t * inverseFactorTimesTwo,
      factor3 = 3 * factorTimes2 * inverseFactor,
      factor4 = factorTimes2 * t;

  out.x = a.x * factor1 + b.x * factor2 + c.x * factor3 + d.x * factor4;
  out.y = a.y * factor1 + b.y * factor2 + c.y * factor3 + d.y * factor4;
  out.z = a.z * factor1 + b.z * factor2 + c.z * factor3 + d.z * factor4;

  return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
  scale = scale || 1.0;

  var r = random() * 2.0 * Math.PI;
  var z = (random() * 2.0) - 1.0;
  var zScale = Math.sqrt(1.0 - z * z) * scale;

  out.x = Math.cos(r) * zScale;
  out.y = Math.sin(r) * zScale;
  out.z = z * scale;
  return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function (out, a, m) {
  var x = a.x, y = a.y, z = a.z,
      w = m.m03 * x + m.m07 * y + m.m11 * z + m.m15;
  w = w || 1.0;
  out.x = (m.m00 * x + m.m04 * y + m.m08 * z + m.m12) / w;
  out.y = (m.m01 * x + m.m05 * y + m.m09 * z + m.m13) / w;
  out.z = (m.m02 * x + m.m06 * y + m.m10 * z + m.m14) / w;
  return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function (out, a, m) {
  var x = a.x, y = a.y, z = a.z;
  out.x = x * m.m00 + y * m.m03 + z * m.m06;
  out.y = x * m.m01 + y * m.m04 + z * m.m07;
  out.z = x * m.m02 + y * m.m05 + z * m.m08;
  return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function (out, a, q) {
  // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

  var x = a.x, y = a.y, z = a.z;
  var qx = q.x, qy = q.y, qz = q.z, qw = q.w;

  // calculate quat * vec
  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z;

  // calculate result * inverse quat
  out.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  return out;
};

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateX = function (out, a, b, c) {
  var p = [], r = [];
  // Translate point to the origin
  p.x = a.x - b.x;
  p.y = a.y - b.y;
  p.z = a.z - b.z;

  //perform rotation
  r.x = p.x;
  r.y = p.y * Math.cos(c) - p.z * Math.sin(c);
  r.z = p.y * Math.sin(c) + p.z * Math.cos(c);

  //translate to correct position
  out.x = r.x + b.x;
  out.y = r.y + b.y;
  out.z = r.z + b.z;

  return out;
};

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateY = function (out, a, b, c) {
  var p = [], r = [];
  //Translate point to the origin
  p.x = a.x - b.x;
  p.y = a.y - b.y;
  p.z = a.z - b.z;

  //perform rotation
  r.x = p.z * Math.sin(c) + p.x * Math.cos(c);
  r.y = p.y;
  r.z = p.z * Math.cos(c) - p.x * Math.sin(c);

  //translate to correct position
  out.x = r.x + b.x;
  out.y = r.y + b.y;
  out.z = r.z + b.z;

  return out;
};

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateZ = function (out, a, b, c) {
  var p = [], r = [];
  //Translate point to the origin
  p.x = a.x - b.x;
  p.y = a.y - b.y;
  p.z = a.z - b.z;

  //perform rotation
  r.x = p.x * Math.cos(c) - p.y * Math.sin(c);
  r.y = p.x * Math.sin(c) + p.y * Math.cos(c);
  r.z = p.z;

  //translate to correct position
  out.x = r.x + b.x;
  out.y = r.y + b.y;
  out.z = r.z + b.z;

  return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function () {
  var vec = vec3.create();

  return function (a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec.x = a[i]; vec.y = a[i + 1]; vec.z = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec.x; a[i + 1] = vec.y; a[i + 2] = vec.z;
    }

    return a;
  };
})();

/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
vec3.angle = (function () {
  var tempA = vec3.create();
  var tempB = vec3.create();

  return function (a, b) {
    vec3.copy(tempA, a);
    vec3.copy(tempB, b);

    vec3.normalize(tempA, tempA);
    vec3.normalize(tempB, tempB);

    var cosine = vec3.dot(tempA, tempB);

    if (cosine > 1.0) {
      return 0;
    }

    if (cosine < -1.0) {
      return Math.PI;
    }

    return Math.acos(cosine);
  };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
  return ("vec3(" + (a.x) + ", " + (a.y) + ", " + (a.z) + ")");
};

/**
 * Returns typed array
 *
 * @param {array} out
 * @param {vec3} v
 * @returns {array}
 */
vec3.array = function (out, v) {
  out[0] = v.x;
  out[1] = v.y;
  out[2] = v.z;

  return out;
};

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec3.exactEquals = function (a, b) {
  return a.x === b.x && a.y === b.y && a.z === b.z;
};

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec3.equals = function (a, b) {
  var a0 = a.x, a1 = a.y, a2 = a.z;
  var b0 = b.x, b1 = b.y, b2 = b.z;
  return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)));
};

var _tmp$2 = new Array(4);

var _vec4 = function _vec4(x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
};

_vec4.prototype.toJSON = function toJSON () {
  _tmp$2[0] = this.x;
  _tmp$2[1] = this.y;
  _tmp$2[2] = this.z;
  _tmp$2[3] = this.w;

  return _tmp$2;
};

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */
var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function () {
  return new _vec4(0, 0, 0, 0);
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.new = function (x, y, z, w) {
  return new _vec4(x, y, z, w);
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function (a) {
  return new _vec4(a.x, a.y, a.z, a.w);
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function (out, a) {
  out.x = a.x;
  out.y = a.y;
  out.z = a.z;
  out.w = a.w;
  return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function (out, x, y, z, w) {
  out.x = x;
  out.y = y;
  out.z = z;
  out.w = w;
  return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function (out, a, b) {
  out.x = a.x + b.x;
  out.y = a.y + b.y;
  out.z = a.z + b.z;
  out.w = a.w + b.w;
  return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function (out, a, b) {
  out.x = a.x - b.x;
  out.y = a.y - b.y;
  out.z = a.z - b.z;
  out.w = a.w - b.w;
  return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function (out, a, b) {
  out.x = a.x * b.x;
  out.y = a.y * b.y;
  out.z = a.z * b.z;
  out.w = a.w * b.w;
  return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function (out, a, b) {
  out.x = a.x / b.x;
  out.y = a.y / b.y;
  out.z = a.z / b.z;
  out.w = a.w / b.w;
  return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to ceil
 * @returns {vec4} out
 */
vec4.ceil = function (out, a) {
  out.x = Math.ceil(a.x);
  out.y = Math.ceil(a.y);
  out.z = Math.ceil(a.z);
  out.w = Math.ceil(a.w);
  return out;
};

/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to floor
 * @returns {vec4} out
 */
vec4.floor = function (out, a) {
  out.x = Math.floor(a.x);
  out.y = Math.floor(a.y);
  out.z = Math.floor(a.z);
  out.w = Math.floor(a.w);
  return out;
};

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function (out, a, b) {
  out.x = Math.min(a.x, b.x);
  out.y = Math.min(a.y, b.y);
  out.z = Math.min(a.z, b.z);
  out.w = Math.min(a.w, b.w);
  return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function (out, a, b) {
  out.x = Math.max(a.x, b.x);
  out.y = Math.max(a.y, b.y);
  out.z = Math.max(a.z, b.z);
  out.w = Math.max(a.w, b.w);
  return out;
};

/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to round
 * @returns {vec4} out
 */
vec4.round = function (out, a) {
  out.x = Math.round(a.x);
  out.y = Math.round(a.y);
  out.z = Math.round(a.z);
  out.w = Math.round(a.w);
  return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function (out, a, b) {
  out.x = a.x * b;
  out.y = a.y * b;
  out.z = a.z * b;
  out.w = a.w * b;
  return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function (out, a, b, scale) {
  out.x = a.x + (b.x * scale);
  out.y = a.y + (b.y * scale);
  out.z = a.z + (b.z * scale);
  out.w = a.w + (b.w * scale);
  return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function (a, b) {
  var x = b.x - a.x,
    y = b.y - a.y,
    z = b.z - a.z,
    w = b.w - a.w;
  return Math.sqrt(x * x + y * y + z * z + w * w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function (a, b) {
  var x = b.x - a.x,
      y = b.y - a.y,
      z = b.z - a.z,
      w = b.w - a.w;
  return x * x + y * y + z * z + w * w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
  var x = a.x,
      y = a.y,
      z = a.z,
      w = a.w;
  return Math.sqrt(x * x + y * y + z * z + w * w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
  var x = a.x,
      y = a.y,
      z = a.z,
      w = a.w;
  return x * x + y * y + z * z + w * w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function (out, a) {
  out.x = -a.x;
  out.y = -a.y;
  out.z = -a.z;
  out.w = -a.w;
  return out;
};

/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */
vec4.inverse = function (out, a) {
  out.x = 1.0 / a.x;
  out.y = 1.0 / a.y;
  out.z = 1.0 / a.z;
  out.w = 1.0 / a.w;
  return out;
};

/**
 * Returns the inverse of the components of a vec4 safely
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */
vec4.inverseSafe = function (out, a) {
  var x = a.x,
      y = a.y,
      z = a.z,
      w = a.w;

  if (Math.abs(x) < EPSILON) {
    out.x = 0;
  } else {
    out.x = 1.0 / x;
  }

  if (Math.abs(y) < EPSILON) {
    out.y = 0;
  } else {
    out.y = 1.0 / y;
  }

  if (Math.abs(z) < EPSILON) {
    out.z = 0;
  } else {
    out.z = 1.0 / z;
  }

  if (Math.abs(w) < EPSILON) {
    out.w = 0;
  } else {
    out.w = 1.0 / w;
  }

  return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function (out, a) {
  var x = a.x,
      y = a.y,
      z = a.z,
      w = a.w;
  var len = x * x + y * y + z * z + w * w;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out.x = x * len;
    out.y = y * len;
    out.z = z * len;
    out.w = w * len;
  }
  return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
  var ax = a.x,
      ay = a.y,
      az = a.z,
      aw = a.w;
  out.x = ax + t * (b.x - ax);
  out.y = ay + t * (b.y - ay);
  out.z = az + t * (b.z - az);
  out.w = aw + t * (b.w - aw);
  return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
  scale = scale || 1.0;

  //TODO: This is a pretty awful way of doing this. Find something better.
  out.x = random();
  out.y = random();
  out.z = random();
  out.w = random();
  vec4.normalize(out, out);
  vec4.scale(out, out, scale);
  return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function (out, a, m) {
  var x = a.x, y = a.y, z = a.z, w = a.w;
  out.x = m.m00 * x + m.m04 * y + m.m08 * z + m.m12 * w;
  out.y = m.m01 * x + m.m05 * y + m.m09 * z + m.m13 * w;
  out.z = m.m02 * x + m.m06 * y + m.m10 * z + m.m14 * w;
  out.w = m.m03 * x + m.m07 * y + m.m11 * z + m.m15 * w;
  return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function (out, a, q) {
  var x = a.x, y = a.y, z = a.z;
  var qx = q.x, qy = q.y, qz = q.z, qw = q.w;

  // calculate quat * vec
  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z;

  // calculate result * inverse quat
  out.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  out.w = a.w;
  return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function () {
  var vec = vec4.create();

  return function (a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec.x = a[i]; vec.y = a[i + 1]; vec.z = a[i + 2]; vec.w = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec.x; a[i + 1] = vec.y; a[i + 2] = vec.z; a[i + 3] = vec.w;
    }

    return a;
  };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
  return ("vec4(" + (a.x) + ", " + (a.y) + ", " + (a.z) + ", " + (a.w) + ")");
};

/**
 * Returns typed array
 *
 * @param {array} out
 * @param {vec4} v
 * @returns {array}
 */
vec4.array = function (out, v) {
  out[0] = v.x;
  out[1] = v.y;
  out[2] = v.z;
  out[3] = v.w;

  return out;
};

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec4.exactEquals = function (a, b) {
  return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
};

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec4.equals = function (a, b) {
  var a0 = a.x, a1 = a.y, a2 = a.z, a3 = a.w;
  var b0 = b.x, b1 = b.y, b2 = b.z, b3 = b.w;
  return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
    Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)));
};

var _tmp$4 = new Array(9);

var _mat3 = function _mat3(m00, m01, m02, m03, m04, m05, m06, m07, m08) {
  this.m00 = m00;
  this.m01 = m01;
  this.m02 = m02;
  this.m03 = m03;
  this.m04 = m04;
  this.m05 = m05;
  this.m06 = m06;
  this.m07 = m07;
  this.m08 = m08;
};

_mat3.prototype.toJSON = function toJSON () {
  _tmp$4[0] = this.m00;
  _tmp$4[1] = this.m01;
  _tmp$4[2] = this.m02;
  _tmp$4[3] = this.m03;
  _tmp$4[4] = this.m04;
  _tmp$4[5] = this.m05;
  _tmp$4[6] = this.m06;
  _tmp$4[7] = this.m07;
  _tmp$4[8] = this.m08;

  return _tmp$4;
};

/**
 * @class 3x3 Matrix
 * @name mat3
 *
 * NOTE: we use column-major matrix for all matrix calculation.
 *
 * This may lead to some confusion when referencing OpenGL documentation,
 * however, which represents out all matricies in column-major format.
 * This means that while in code a matrix may be typed out as:
 *
 * [1, 0, 0, 0,
 *  0, 1, 0, 0,
 *  0, 0, 1, 0,
 *  x, y, z, 0]
 *
 * The same matrix in the [OpenGL documentation](https://www.khronos.org/registry/OpenGL-Refpages/gl2.1/xhtml/glTranslate.xml)
 * is written as:
 *
 *  1 0 0 x
 *  0 1 0 y
 *  0 0 1 z
 *  0 0 0 0
 *
 * Please rest assured, however, that they are the same thing!
 * This is not unique to glMatrix, either, as OpenGL developers have long been confused by the
 * apparent lack of consistency between the memory layout and the documentation.
 */
var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function () {
  return new _mat3(
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  );
};

/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */
mat3.new = function (m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  return new _mat3(
    m00, m01, m02,
    m10, m11, m12,
    m20, m21, m22
  );
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function (a) {
  return new _mat3(
    a.m00, a.m01, a.m02,
    a.m03, a.m04, a.m05,
    a.m06, a.m07, a.m08
  );
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function (out, a) {
  out.m00 = a.m00;
  out.m01 = a.m01;
  out.m02 = a.m02;
  out.m03 = a.m03;
  out.m04 = a.m04;
  out.m05 = a.m05;
  out.m06 = a.m06;
  out.m07 = a.m07;
  out.m08 = a.m08;
  return out;
};

/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} out
 */
mat3.set = function (out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  out.m00 = m00;
  out.m01 = m01;
  out.m02 = m02;
  out.m03 = m10;
  out.m04 = m11;
  out.m05 = m12;
  out.m06 = m20;
  out.m07 = m21;
  out.m08 = m22;
  return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function (out) {
  out.m00 = 1;
  out.m01 = 0;
  out.m02 = 0;
  out.m03 = 0;
  out.m04 = 1;
  out.m05 = 0;
  out.m06 = 0;
  out.m07 = 0;
  out.m08 = 1;
  return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function (out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a.m01, a02 = a.m02, a12 = a.m05;
    out.m01 = a.m03;
    out.m02 = a.m06;
    out.m03 = a01;
    out.m05 = a.m07;
    out.m06 = a02;
    out.m07 = a12;
  } else {
    out.m00 = a.m00;
    out.m01 = a.m03;
    out.m02 = a.m06;
    out.m03 = a.m01;
    out.m04 = a.m04;
    out.m05 = a.m07;
    out.m06 = a.m02;
    out.m07 = a.m05;
    out.m08 = a.m08;
  }

  return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function (out, a) {
  var a00 = a.m00, a01 = a.m01, a02 = a.m02,
      a10 = a.m03, a11 = a.m04, a12 = a.m05,
      a20 = a.m06, a21 = a.m07, a22 = a.m08;

  var b01 = a22 * a11 - a12 * a21;
  var b11 = -a22 * a10 + a12 * a20;
  var b21 = a21 * a10 - a11 * a20;

  // Calculate the determinant
  var det = a00 * b01 + a01 * b11 + a02 * b21;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out.m00 = b01 * det;
  out.m01 = (-a22 * a01 + a02 * a21) * det;
  out.m02 = (a12 * a01 - a02 * a11) * det;
  out.m03 = b11 * det;
  out.m04 = (a22 * a00 - a02 * a20) * det;
  out.m05 = (-a12 * a00 + a02 * a10) * det;
  out.m06 = b21 * det;
  out.m07 = (-a21 * a00 + a01 * a20) * det;
  out.m08 = (a11 * a00 - a01 * a10) * det;
  return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function (out, a) {
  var a00 = a.m00, a01 = a.m01, a02 = a.m02,
      a10 = a.m03, a11 = a.m04, a12 = a.m05,
      a20 = a.m06, a21 = a.m07, a22 = a.m08;

  out.m00 = (a11 * a22 - a12 * a21);
  out.m01 = (a02 * a21 - a01 * a22);
  out.m02 = (a01 * a12 - a02 * a11);
  out.m03 = (a12 * a20 - a10 * a22);
  out.m04 = (a00 * a22 - a02 * a20);
  out.m05 = (a02 * a10 - a00 * a12);
  out.m06 = (a10 * a21 - a11 * a20);
  out.m07 = (a01 * a20 - a00 * a21);
  out.m08 = (a00 * a11 - a01 * a10);
  return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
  var a00 = a.m00, a01 = a.m01, a02 = a.m02,
      a10 = a.m03, a11 = a.m04, a12 = a.m05,
      a20 = a.m06, a21 = a.m07, a22 = a.m08;

  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
  var a00 = a.m00, a01 = a.m01, a02 = a.m02,
      a10 = a.m03, a11 = a.m04, a12 = a.m05,
      a20 = a.m06, a21 = a.m07, a22 = a.m08;

  var b00 = b.m00, b01 = b.m01, b02 = b.m02;
  var b10 = b.m03, b11 = b.m04, b12 = b.m05;
  var b20 = b.m06, b21 = b.m07, b22 = b.m08;

  out.m00 = b00 * a00 + b01 * a10 + b02 * a20;
  out.m01 = b00 * a01 + b01 * a11 + b02 * a21;
  out.m02 = b00 * a02 + b01 * a12 + b02 * a22;

  out.m03 = b10 * a00 + b11 * a10 + b12 * a20;
  out.m04 = b10 * a01 + b11 * a11 + b12 * a21;
  out.m05 = b10 * a02 + b11 * a12 + b12 * a22;

  out.m06 = b20 * a00 + b21 * a10 + b22 * a20;
  out.m07 = b20 * a01 + b21 * a11 + b22 * a21;
  out.m08 = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function (out, a, v) {
  var a00 = a.m00, a01 = a.m01, a02 = a.m02,
      a10 = a.m03, a11 = a.m04, a12 = a.m05,
      a20 = a.m06, a21 = a.m07, a22 = a.m08;
  var x = v.x, y = v.y;

  out.m00 = a00;
  out.m01 = a01;
  out.m02 = a02;

  out.m03 = a10;
  out.m04 = a11;
  out.m05 = a12;

  out.m06 = x * a00 + y * a10 + a20;
  out.m07 = x * a01 + y * a11 + a21;
  out.m08 = x * a02 + y * a12 + a22;
  return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
  var a00 = a.m00, a01 = a.m01, a02 = a.m02,
      a10 = a.m03, a11 = a.m04, a12 = a.m05,
      a20 = a.m06, a21 = a.m07, a22 = a.m08;

  var s = Math.sin(rad);
  var c = Math.cos(rad);

  out.m00 = c * a00 + s * a10;
  out.m01 = c * a01 + s * a11;
  out.m02 = c * a02 + s * a12;

  out.m03 = c * a10 - s * a00;
  out.m04 = c * a11 - s * a01;
  out.m05 = c * a12 - s * a02;

  out.m06 = a20;
  out.m07 = a21;
  out.m08 = a22;
  return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function (out, a, v) {
  var x = v.x, y = v.y;

  out.m00 = x * a.m00;
  out.m01 = x * a.m01;
  out.m02 = x * a.m02;

  out.m03 = y * a.m03;
  out.m04 = y * a.m04;
  out.m05 = y * a.m05;

  out.m06 = a.m06;
  out.m07 = a.m07;
  out.m08 = a.m08;
  return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function (out, a) {
  out.m00 = a.m00;
  out.m01 = a.m01;
  out.m02 = a.m02;
  out.m03 = a.m04;
  out.m04 = a.m05;
  out.m05 = a.m06;
  out.m06 = a.m08;
  out.m07 = a.m09;
  out.m08 = a.m10;
  return out;
};

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat3} out
 */
mat3.fromTranslation = function (out, v) {
  out.m00 = 1;
  out.m01 = 0;
  out.m02 = 0;
  out.m03 = 0;
  out.m04 = 1;
  out.m05 = 0;
  out.m06 = v.x;
  out.m07 = v.y;
  out.m08 = 1;
  return out;
};

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.fromRotation = function (out, rad) {
  var s = Math.sin(rad), c = Math.cos(rad);

  out.m00 = c;
  out.m01 = s;
  out.m02 = 0;

  out.m03 = -s;
  out.m04 = c;
  out.m05 = 0;

  out.m06 = 0;
  out.m07 = 0;
  out.m08 = 1;
  return out;
};

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat3} out
 */
mat3.fromScaling = function (out, v) {
  out.m00 = v.x;
  out.m01 = 0;
  out.m02 = 0;

  out.m03 = 0;
  out.m04 = v.y;
  out.m05 = 0;

  out.m06 = 0;
  out.m07 = 0;
  out.m08 = 1;
  return out;
};

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
mat3.fromMat2d = function (out, a) {
  out.m00 = a.m00;
  out.m01 = a.m01;
  out.m02 = 0;

  out.m03 = a.m02;
  out.m04 = a.m03;
  out.m05 = 0;

  out.m06 = a.m04;
  out.m07 = a.m05;
  out.m08 = 1;
  return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
  var x = q.x, y = q.y, z = q.z, w = q.w;
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;

  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;

  out.m00 = 1 - yy - zz;
  out.m03 = yx - wz;
  out.m06 = zx + wy;

  out.m01 = yx + wz;
  out.m04 = 1 - xx - zz;
  out.m07 = zy - wx;

  out.m02 = zx - wy;
  out.m05 = zy + wx;
  out.m08 = 1 - xx - yy;

  return out;
};

/**
* Calculates a 3x3 matrix from view direction and up direction
*
* @param {mat3} out mat3 receiving operation result
* @param {vec3} view view direction (must be normalized)
* @param {vec3} [up] up direction, default is (0,1,0) (must be normalized)
*
* @returns {mat3} out
*/
mat3.fromViewUp = (function () {
  var default_up = vec3.new(0, 1, 0);
  var x = vec3.create();
  var y = vec3.create();

  return function (out, view, up) {
    if (vec3.sqrLen(view) < EPSILON * EPSILON) {
      mat3.identity(out);
      return out;
    }

    up = up || default_up;
    vec3.cross(x, up, view);

    if (vec3.sqrLen(x) < EPSILON * EPSILON) {
      mat3.identity(out);
      return out;
    }

    vec3.cross(y, view, x);
    mat3.set(out,
      x.x, x.y, x.z,
      y.x, y.y, y.z,
      view.x, view.y, view.z
    );

    return out;
  };
})();

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
  var a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03,
      a10 = a.m04, a11 = a.m05, a12 = a.m06, a13 = a.m07,
      a20 = a.m08, a21 = a.m09, a22 = a.m10, a23 = a.m11,
      a30 = a.m12, a31 = a.m13, a32 = a.m14, a33 = a.m15;

  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out.m00 = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out.m01 = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out.m02 = (a10 * b10 - a11 * b08 + a13 * b06) * det;

  out.m03 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out.m04 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out.m05 = (a01 * b08 - a00 * b10 - a03 * b06) * det;

  out.m06 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out.m07 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out.m08 = (a30 * b04 - a31 * b02 + a33 * b00) * det;

  return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
  return ("mat3(" + (a.m00) + ", " + (a.m01) + ", " + (a.m02) + ", " + (a.m03) + ", " + (a.m04) + ", " + (a.m05) + ", " + (a.m06) + ", " + (a.m07) + ", " + (a.m08) + ")");
};

/**
 * Returns typed array
 *
 * @param {array} out
 * @param {mat3} m
 * @returns {array}
 */
mat3.array = function (out, m) {
  out[0] = m.m00;
  out[1] = m.m01;
  out[2] = m.m02;
  out[3] = m.m03;
  out[4] = m.m04;
  out[5] = m.m05;
  out[6] = m.m06;
  out[7] = m.m07;
  out[8] = m.m08;

  return out;
};

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat3.frob = function (a) {
  return (Math.sqrt(Math.pow(a.m00, 2) + Math.pow(a.m01, 2) + Math.pow(a.m02, 2) + Math.pow(a.m03, 2) + Math.pow(a.m04, 2) + Math.pow(a.m05, 2) + Math.pow(a.m06, 2) + Math.pow(a.m07, 2) + Math.pow(a.m08, 2)));
};

/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.add = function (out, a, b) {
  out.m00 = a.m00 + b.m00;
  out.m01 = a.m01 + b.m01;
  out.m02 = a.m02 + b.m02;
  out.m03 = a.m03 + b.m03;
  out.m04 = a.m04 + b.m04;
  out.m05 = a.m05 + b.m05;
  out.m06 = a.m06 + b.m06;
  out.m07 = a.m07 + b.m07;
  out.m08 = a.m08 + b.m08;
  return out;
};

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.subtract = function (out, a, b) {
  out.m00 = a.m00 - b.m00;
  out.m01 = a.m01 - b.m01;
  out.m02 = a.m02 - b.m02;
  out.m03 = a.m03 - b.m03;
  out.m04 = a.m04 - b.m04;
  out.m05 = a.m05 - b.m05;
  out.m06 = a.m06 - b.m06;
  out.m07 = a.m07 - b.m07;
  out.m08 = a.m08 - b.m08;
  return out;
};

/**
 * Alias for {@link mat3.subtract}
 * @function
 */
mat3.sub = mat3.subtract;

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */
mat3.multiplyScalar = function (out, a, b) {
  out.m00 = a.m00 * b;
  out.m01 = a.m01 * b;
  out.m02 = a.m02 * b;
  out.m03 = a.m03 * b;
  out.m04 = a.m04 * b;
  out.m05 = a.m05 * b;
  out.m06 = a.m06 * b;
  out.m07 = a.m07 * b;
  out.m08 = a.m08 * b;
  return out;
};

/**
 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat3} out the receiving vector
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat3} out
 */
mat3.multiplyScalarAndAdd = function (out, a, b, scale) {
  out.m00 = a.m00 + (b.m00 * scale);
  out.m01 = a.m01 + (b.m01 * scale);
  out.m02 = a.m02 + (b.m02 * scale);
  out.m03 = a.m03 + (b.m03 * scale);
  out.m04 = a.m04 + (b.m04 * scale);
  out.m05 = a.m05 + (b.m05 * scale);
  out.m06 = a.m06 + (b.m06 * scale);
  out.m07 = a.m07 + (b.m07 * scale);
  out.m08 = a.m08 + (b.m08 * scale);
  return out;
};

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat3.exactEquals = function (a, b) {
  return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 &&
    a.m03 === b.m03 && a.m04 === b.m04 && a.m05 === b.m05 &&
    a.m06 === b.m06 && a.m07 === b.m07 && a.m08 === b.m08;
};

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat3.equals = function (a, b) {
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05, a6 = a.m06, a7 = a.m07, a8 = a.m08;
  var b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03, b4 = b.m04, b5 = b.m05, b6 = b.m06, b7 = b.m07, b8 = b.m08;
  return (
    Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
    Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
    Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
    Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
    Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
    Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
    Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8))
  );
};

var _tmp$3 = new Array(4);

var _quat = function _quat(x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
};

_quat.prototype.toJSON = function toJSON () {
  _tmp$3[0] = this.x;
  _tmp$3[1] = this.y;
  _tmp$3[2] = this.z;
  _tmp$3[3] = this.w;

  return _tmp$3;
};

/**
 * @class Quaternion
 * @name quat
 */
var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function () {
  return new _quat(0, 0, 0, 1);
};

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.new = function (x, y, z, w) {
  return new _quat(x, y, z, w);
};

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = function (a) {
  return new _quat(a.x, a.y, a.z, a.w);
};

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function (out) {
  out.x = 0;
  out.y = 0;
  out.z = 0;
  out.w = 1;
  return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function () {
  var tmpvec3 = vec3.create();
  var xUnitVec3 = vec3.new(1, 0, 0);
  var yUnitVec3 = vec3.new(0, 1, 0);

  return function (out, a, b) {
    var dot = vec3.dot(a, b);
    if (dot < -0.999999) {
      vec3.cross(tmpvec3, xUnitVec3, a);
      if (vec3.length(tmpvec3) < 0.000001) {
        vec3.cross(tmpvec3, yUnitVec3, a);
      }
      vec3.normalize(tmpvec3, tmpvec3);
      quat.fromAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out.x = 0;
      out.y = 0;
      out.z = 0;
      out.w = 1;
      return out;
    } else {
      vec3.cross(tmpvec3, a, b);
      out.x = tmpvec3.x;
      out.y = tmpvec3.y;
      out.z = tmpvec3.z;
      out.w = 1 + dot;
      return quat.normalize(out, out);
    }
  };
})();

/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  fromAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param  {vec3} out_axis  Vector receiving the axis of rotation
 * @param  {quat} q     Quaternion to be decomposed
 * @return {Number}     Angle, in radians, of the rotation
 */
quat.getAxisAngle = function (out_axis, q) {
  var rad = Math.acos(q.w) * 2.0;
  var s = Math.sin(rad / 2.0);
  if (s != 0.0) {
    out_axis.x = q.x / s;
    out_axis.y = q.y / s;
    out_axis.z = q.z / s;
  } else {
    // If s is zero, return any axis (no rotation - axis does not matter)
    out_axis.x = 1;
    out_axis.y = 0;
    out_axis.z = 0;
  }
  return rad;
};

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function (out, a, b) {
  var ax = a.x, ay = a.y, az = a.z, aw = a.w,
      bx = b.x, by = b.y, bz = b.z, bw = b.w;

  out.x = ax * bw + aw * bx + ay * bz - az * by;
  out.y = ay * bw + aw * by + az * bx - ax * bz;
  out.z = az * bw + aw * bz + ax * by - ay * bx;
  out.w = aw * bw - ax * bx - ay * by - az * bz;
  return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
  rad *= 0.5;

  var ax = a.x, ay = a.y, az = a.z, aw = a.w,
      bx = Math.sin(rad), bw = Math.cos(rad);

  out.x = ax * bw + aw * bx;
  out.y = ay * bw + az * bx;
  out.z = az * bw - ay * bx;
  out.w = aw * bw - ax * bx;
  return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
  rad *= 0.5;

  var ax = a.x, ay = a.y, az = a.z, aw = a.w,
      by = Math.sin(rad), bw = Math.cos(rad);

  out.x = ax * bw - az * by;
  out.y = ay * bw + aw * by;
  out.z = az * bw + ax * by;
  out.w = aw * bw - ay * by;
  return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
  rad *= 0.5;

  var ax = a.x, ay = a.y, az = a.z, aw = a.w,
      bz = Math.sin(rad), bw = Math.cos(rad);

  out.x = ax * bw + ay * bz;
  out.y = ay * bw - ax * bz;
  out.z = az * bw + aw * bz;
  out.w = aw * bw - az * bz;
  return out;
};

/**
 * Rotates a quaternion by the given angle about the axis in world space
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} rot quat to rotate
 * @param {vec3} axis the axis around which to rotate in world space
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateAround = (function () {
  var v3_tmp = vec3.create();
  var q_tmp = quat.create();

  return function (out, rot, axis, rad) {
    // get inv-axis (local to rot)
    quat.invert(q_tmp, rot);
    vec3.transformQuat(v3_tmp, axis, q_tmp);
    // rotate by inv-axis
    quat.fromAxisAngle(q_tmp, v3_tmp, rad);
    quat.mul(out, rot, q_tmp);

    return out;
  };
})();

/**
 * Rotates a quaternion by the given angle about the axis in local space
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} rot quat to rotate
 * @param {vec3} axis the axis around which to rotate in local space
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateAroundLocal = (function () {
  var q_tmp = quat.create();

  return function (out, rot, axis, rad) {
    quat.fromAxisAngle(q_tmp, axis, rad);
    quat.mul(out, rot, q_tmp);

    return out;
  };
})();

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
  var x = a.x, y = a.y, z = a.z;

  out.x = x;
  out.y = y;
  out.z = z;
  out.w = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
  return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations

  var ax = a.x, ay = a.y, az = a.z, aw = a.w,
      bx = b.x, by = b.y, bz = b.z, bw = b.w;

  var omega, cosom, sinom, scale0, scale1;

  // calc cosine
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  // adjust signs (if necessary)
  if (cosom < 0.0) {
    cosom = -cosom;
    bx = - bx;
    by = - by;
    bz = - bz;
    bw = - bw;
  }
  // calculate coefficients
  if ((1.0 - cosom) > 0.000001) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  }
  // calculate final values
  out.x = scale0 * ax + scale1 * bx;
  out.y = scale0 * ay + scale1 * by;
  out.z = scale0 * az + scale1 * bz;
  out.w = scale0 * aw + scale1 * bw;

  return out;
};

/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {quat} c the third operand
 * @param {quat} d the fourth operand
 * @param {Number} t interpolation amount
 * @returns {quat} out
 */
quat.sqlerp = (function () {
  var temp1 = quat.create();
  var temp2 = quat.create();

  return function (out, a, b, c, d, t) {
    quat.slerp(temp1, a, d, t);
    quat.slerp(temp2, b, c, t);
    quat.slerp(out, temp1, temp2, 2 * t * (1 - t));

    return out;
  };
}());

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function (out, a) {
  var a0 = a.x, a1 = a.y, a2 = a.z, a3 = a.w;
  var dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  var invDot = dot ? 1.0 / dot : 0;

  // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

  out.x = -a0 * invDot;
  out.y = -a1 * invDot;
  out.z = -a2 * invDot;
  out.w = a3 * invDot;
  return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
  out.x = -a.x;
  out.y = -a.y;
  out.z = -a.z;
  out.w = a.w;
  return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} xAxis the vector representing the local "right" direction
 * @param {vec3} yAxis the vector representing the local "up" direction
 * @param {vec3} zAxis the vector representing the viewing direction
 * @returns {quat} out
 */
quat.fromAxes = (function () {
  var matr = mat3.create();

  return function (out, xAxis, yAxis, zAxis) {
    mat3.set(
      matr,
      xAxis.x, xAxis.y, xAxis.z,
      yAxis.x, yAxis.y, yAxis.z,
      zAxis.x, zAxis.y, zAxis.z
    );
    return quat.normalize(out, quat.fromMat3(out, matr));
  };
})();

/**
* Calculates a quaternion from view direction and up direction
*
* @param {quat} out mat3 receiving operation result
* @param {vec3} view view direction (must be normalized)
* @param {vec3} [up] up direction, default is (0,1,0) (must be normalized)
*
* @returns {quat} out
*/
quat.fromViewUp = (function () {
  var matr = mat3.create();

  return function (out, view, up) {
    mat3.fromViewUp(matr, view, up);
    if (!matr) {
      return null;
    }

    return quat.normalize(out, quat.fromMat3(out, matr));
  };
})();

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.fromAxisAngle = function (out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out.x = s * axis.x;
  out.y = s * axis.y;
  out.z = s * axis.z;
  out.w = Math.cos(rad);
  return out;
};

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = function (out, m) {
  // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

  var m00 = m.m00, m01 = m.m03, m02 = m.m06,
      m10 = m.m01, m11 = m.m04, m12 = m.m07,
      m20 = m.m02, m21 = m.m05, m22 = m.m08;

  var trace = m00 + m11 + m22;

  if (trace > 0) {
    var s = 0.5 / Math.sqrt(trace + 1.0);

    out.w = 0.25 / s;
    out.x = (m21 - m12) * s;
    out.y = (m02 - m20) * s;
    out.z = (m10 - m01) * s;

  } else if ((m00 > m11) && (m00 > m22)) {
    var s$1 = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);

    out.w = (m21 - m12) / s$1;
    out.x = 0.25 * s$1;
    out.y = (m01 + m10) / s$1;
    out.z = (m02 + m20) / s$1;

  } else if (m11 > m22) {
    var s$2 = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);

    out.w = (m02 - m20) / s$2;
    out.x = (m01 + m10) / s$2;
    out.y = 0.25 * s$2;
    out.z = (m12 + m21) / s$2;

  } else {
    var s$3 = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);

    out.w = (m10 - m01) / s$3;
    out.x = (m02 + m20) / s$3;
    out.y = (m12 + m21) / s$3;
    out.z = 0.25 * s$3;
  }

  return out;
};

/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param {quat} out the receiving quaternion
 * @param {x} Angle to rotate around X axis in degrees.
 * @param {y} Angle to rotate around Y axis in degrees.
 * @param {z} Angle to rotate around Z axis in degrees.
 * @returns {quat} out
 * @function
 */
quat.fromEuler = function (out, x, y, z) {
  var halfToRad = 0.5 * Math.PI / 180.0;
  x *= halfToRad;
  y *= halfToRad;
  z *= halfToRad;

  var sx = Math.sin(x);
  var cx = Math.cos(x);
  var sy = Math.sin(y);
  var cy = Math.cos(y);
  var sz = Math.sin(z);
  var cz = Math.cos(z);

  out.x = sx * cy * cz - cx * sy * sz;
  out.y = cx * sy * cz + sx * cy * sz;
  out.z = cx * cy * sz - sx * sy * cz;
  out.w = cx * cy * cz + sx * sy * sz;

  return out;
};

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
  return ("quat(" + (a.x) + ", " + (a.y) + ", " + (a.z) + ", " + (a.w) + ")");
};

/**
 * Returns typed array
 *
 * @param {array} out
 * @param {quat} q
 * @returns {array}
 */
quat.array = function (out, q) {
  out[0] = q.x;
  out[1] = q.y;
  out[2] = q.z;
  out[3] = q.w;

  return out;
};

/**
 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {quat} a The first quaternion.
 * @param {quat} b The second quaternion.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
quat.exactEquals = vec4.exactEquals;

/**
 * Returns whether or not the quaternions have approximately the same elements in the same position.
 *
 * @param {quat} a The first vector.
 * @param {quat} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
quat.equals = vec4.equals;

var _tmp$5 = new Array(4);

var _mat2 = function _mat2(m00, m01, m02, m03) {
  this.m00 = m00;
  this.m01 = m01;
  this.m02 = m02;
  this.m03 = m03;
};

_mat2.prototype.toJSON = function toJSON () {
  _tmp$5[0] = this.m00;
  _tmp$5[1] = this.m01;
  _tmp$5[2] = this.m02;
  _tmp$5[3] = this.m03;

  return _tmp$5;
};

/**
 * @class 2x2 Matrix
 * @name mat2
 */
var mat2 = {};

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
  return new _mat2(1, 0, 0, 1);
};

/**
 * Create a new mat2 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out A new 2x2 matrix
 */
mat2.new = function (m00, m01, m10, m11) {
  return new _mat2(m00, m01, m10, m11);
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function (a) {
  return new _mat2(a.m00, a.m01, a.m02, a.m03);
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function (out, a) {
  out.m00 = a.m00;
  out.m01 = a.m01;
  out.m02 = a.m02;
  out.m03 = a.m03;
  return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function (out) {
  out.m00 = 1;
  out.m01 = 0;
  out.m02 = 0;
  out.m03 = 1;
  return out;
};

/**
 * Set the components of a mat2 to the given values
 *
 * @param {mat2} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out
 */
mat2.set = function (out, m00, m01, m10, m11) {
  out.m00 = m00;
  out.m01 = m01;
  out.m02 = m10;
  out.m03 = m11;
  return out;
};


/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function (out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a1 = a.m01;
    out.m01 = a.m02;
    out.m02 = a1;
  } else {
    out.m00 = a.m00;
    out.m01 = a.m02;
    out.m02 = a.m01;
    out.m03 = a.m03;
  }

  return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function (out, a) {
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03;

  // Calculate the determinant
  var det = a0 * a3 - a2 * a1;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out.m00 = a3 * det;
  out.m01 = -a1 * det;
  out.m02 = -a2 * det;
  out.m03 = a0 * det;

  return out;
};

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function (out, a) {
  // Caching this value is nessecary if out == a
  var a0 = a.m00;
  out.m00 = a.m03;
  out.m01 = -a.m01;
  out.m02 = -a.m02;
  out.m03 = a0;

  return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
  return a.m00 * a.m03 - a.m02 * a.m01;
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03;
  var b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03;
  out.m00 = a0 * b0 + a2 * b1;
  out.m01 = a1 * b0 + a3 * b1;
  out.m02 = a0 * b2 + a2 * b3;
  out.m03 = a1 * b2 + a3 * b3;
  return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03,
      s = Math.sin(rad),
      c = Math.cos(rad);
  out.m00 = a0 * c + a2 * s;
  out.m01 = a1 * c + a3 * s;
  out.m02 = a0 * -s + a2 * c;
  out.m03 = a1 * -s + a3 * c;
  return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function (out, a, v) {
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03,
      v0 = v.x, v1 = v.y;
  out.m00 = a0 * v0;
  out.m01 = a1 * v0;
  out.m02 = a2 * v1;
  out.m03 = a3 * v1;
  return out;
};

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.rotate(dest, dest, rad);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.fromRotation = function (out, rad) {
  var s = Math.sin(rad),
      c = Math.cos(rad);
  out.m00 = c;
  out.m01 = s;
  out.m02 = -s;
  out.m03 = c;
  return out;
};

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.scale(dest, dest, vec);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2} out
 */
mat2.fromScaling = function (out, v) {
  out.m00 = v.x;
  out.m01 = 0;
  out.m02 = 0;
  out.m03 = v.y;
  return out;
};

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
  return ("mat2(" + (a.m00) + ", " + (a.m01) + ", " + (a.m02) + ", " + (a.m03) + ")");
};

/**
 * Returns typed array
 *
 * @param {array} out
 * @param {mat2} m
 * @returns {array}
 */
mat2.array = function (out, m) {
  out[0] = m.m00;
  out[1] = m.m01;
  out[2] = m.m02;
  out[3] = m.m03;

  return out;
};

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2.frob = function (a) {
  return (Math.sqrt(Math.pow(a.m00, 2) + Math.pow(a.m01, 2) + Math.pow(a.m02, 2) + Math.pow(a.m03, 2)));
};

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix
 * @param {mat2} D the diagonal matrix
 * @param {mat2} U the upper triangular matrix
 * @param {mat2} a the input matrix to factorize
 */

mat2.LDU = function (L, D, U, a) {
  L.m02 = a.m02 / a.m00;
  U.m00 = a.m00;
  U.m01 = a.m01;
  U.m03 = a.m03 - L.m02 * U.m01;
};

/**
 * Adds two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.add = function (out, a, b) {
  out.m00 = a.m00 + b.m00;
  out.m01 = a.m01 + b.m01;
  out.m02 = a.m02 + b.m02;
  out.m03 = a.m03 + b.m03;
  return out;
};

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.subtract = function (out, a, b) {
  out.m00 = a.m00 - b.m00;
  out.m01 = a.m01 - b.m01;
  out.m02 = a.m02 - b.m02;
  out.m03 = a.m03 - b.m03;
  return out;
};

/**
 * Alias for {@link mat2.subtract}
 * @function
 */
mat2.sub = mat2.subtract;

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat2} a The first matrix.
 * @param {mat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat2.exactEquals = function (a, b) {
  return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 && a.m03 === b.m03;
};

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat2} a The first matrix.
 * @param {mat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat2.equals = function (a, b) {
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03;
  var b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03;
  return (
    Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
    Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3))
  );
};

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2} out
 */
mat2.multiplyScalar = function (out, a, b) {
  out.m00 = a.m00 * b;
  out.m01 = a.m01 * b;
  out.m02 = a.m02 * b;
  out.m03 = a.m03 * b;
  return out;
};

/**
 * Adds two mat2's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2} out the receiving vector
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2} out
 */
mat2.multiplyScalarAndAdd = function (out, a, b, scale) {
  out.m00 = a.m00 + (b.m00 * scale);
  out.m01 = a.m01 + (b.m01 * scale);
  out.m02 = a.m02 + (b.m02 * scale);
  out.m03 = a.m03 + (b.m03 * scale);
  return out;
};

var _tmp$6 = new Array(6);

var _mat23 = function _mat23(m00, m01, m02, m03, m04, m05) {
  this.m00 = m00;
  this.m01 = m01;
  this.m02 = m02;
  this.m03 = m03;
  this.m04 = m04;
  this.m05 = m05;
};

_mat23.prototype.toJSON = function toJSON () {
  _tmp$6[0] = this.m00;
  _tmp$6[1] = this.m01;
  _tmp$6[2] = this.m02;
  _tmp$6[3] = this.m03;
  _tmp$6[4] = this.m04;
  _tmp$6[5] = this.m05;

  return _tmp$6;
};

/**
 * @class 2x3 Matrix
 * @name mat23
 *
 * @description
 * A mat23 contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */
var mat23 = {};

/**
 * Creates a new identity mat23
 *
 * @returns {mat23} a new 2x3 matrix
 */
mat23.create = function () {
  return new _mat23(
    1, 0,
    0, 1,
    0, 0
  );
};

/**
 * Create a new mat23 with the given values
 *
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat23} A new mat23
 */
mat23.new = function (a, b, c, d, tx, ty) {
  return new _mat23(
    a, b,
    c, d,
    tx, ty
  );
};

/**
 * Creates a new mat23 initialized with values from an existing matrix
 *
 * @param {mat23} a matrix to clone
 * @returns {mat23} a new 2x3 matrix
 */
mat23.clone = function (a) {
  return new _mat23(
    a.m00, a.m01,
    a.m02, a.m03,
    a.m04, a.m05
  );
};

/**
 * Copy the values from one mat23 to another
 *
 * @param {mat23} out the receiving matrix
 * @param {mat23} a the source matrix
 * @returns {mat23} out
 */
mat23.copy = function (out, a) {
  out.m00 = a.m00;
  out.m01 = a.m01;
  out.m02 = a.m02;
  out.m03 = a.m03;
  out.m04 = a.m04;
  out.m05 = a.m05;
  return out;
};

/**
 * Set a mat23 to the identity matrix
 *
 * @param {mat23} out the receiving matrix
 * @returns {mat23} out
 */
mat23.identity = function (out) {
  out.m00 = 1;
  out.m01 = 0;
  out.m02 = 0;
  out.m03 = 1;
  out.m04 = 0;
  out.m05 = 0;
  return out;
};

/**
 * Set the components of a mat23 to the given values
 *
 * @param {mat23} out the receiving matrix
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat23} out
 */
mat23.set = function (out, a, b, c, d, tx, ty) {
  out.m00 = a;
  out.m01 = b;
  out.m02 = c;
  out.m03 = d;
  out.m04 = tx;
  out.m05 = ty;
  return out;
};

/**
 * Inverts a mat23
 *
 * @param {mat23} out the receiving matrix
 * @param {mat23} a the source matrix
 * @returns {mat23} out
 */
mat23.invert = function (out, a) {
  var aa = a.m00, ab = a.m01, ac = a.m02, ad = a.m03,
    atx = a.m04, aty = a.m05;

  var det = aa * ad - ab * ac;
  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out.m00 = ad * det;
  out.m01 = -ab * det;
  out.m02 = -ac * det;
  out.m03 = aa * det;
  out.m04 = (ac * aty - ad * atx) * det;
  out.m05 = (ab * atx - aa * aty) * det;
  return out;
};

/**
 * Calculates the determinant of a mat23
 *
 * @param {mat23} a the source matrix
 * @returns {Number} determinant of a
 */
mat23.determinant = function (a) {
  return a.m00 * a.m03 - a.m01 * a.m02;
};

/**
 * Multiplies two mat23's
 *
 * @param {mat23} out the receiving matrix
 * @param {mat23} a the first operand
 * @param {mat23} b the second operand
 * @returns {mat23} out
 */
mat23.multiply = function (out, a, b) {
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05,
    b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03, b4 = b.m04, b5 = b.m05;
  out.m00 = a0 * b0 + a2 * b1;
  out.m01 = a1 * b0 + a3 * b1;
  out.m02 = a0 * b2 + a2 * b3;
  out.m03 = a1 * b2 + a3 * b3;
  out.m04 = a0 * b4 + a2 * b5 + a4;
  out.m05 = a1 * b4 + a3 * b5 + a5;
  return out;
};

/**
 * Alias for {@link mat23.multiply}
 * @function
 */
mat23.mul = mat23.multiply;

/**
 * Rotates a mat23 by the given angle
 *
 * @param {mat23} out the receiving matrix
 * @param {mat23} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat23} out
 */
mat23.rotate = function (out, a, rad) {
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05,
    s = Math.sin(rad),
    c = Math.cos(rad);
  out.m00 = a0 * c + a2 * s;
  out.m01 = a1 * c + a3 * s;
  out.m02 = a0 * -s + a2 * c;
  out.m03 = a1 * -s + a3 * c;
  out.m04 = a4;
  out.m05 = a5;
  return out;
};

/**
 * Scales the mat23 by the dimensions in the given vec2
 *
 * @param {mat23} out the receiving matrix
 * @param {mat23} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat23} out
 **/
mat23.scale = function (out, a, v) {
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05,
    v0 = v.x, v1 = v.y;
  out.m00 = a0 * v0;
  out.m01 = a1 * v0;
  out.m02 = a2 * v1;
  out.m03 = a3 * v1;
  out.m04 = a4;
  out.m05 = a5;
  return out;
};

/**
 * Translates the mat23 by the dimensions in the given vec2
 *
 * @param {mat23} out the receiving matrix
 * @param {mat23} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat23} out
 **/
mat23.translate = function (out, a, v) {
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05,
    v0 = v.x, v1 = v.y;
  out.m00 = a0;
  out.m01 = a1;
  out.m02 = a2;
  out.m03 = a3;
  out.m04 = a0 * v0 + a2 * v1 + a4;
  out.m05 = a1 * v0 + a3 * v1 + a5;
  return out;
};

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat23.identity(dest);
 *     mat23.rotate(dest, dest, rad);
 *
 * @param {mat23} out mat23 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat23} out
 */
mat23.fromRotation = function (out, rad) {
  var s = Math.sin(rad), c = Math.cos(rad);
  out.m00 = c;
  out.m01 = s;
  out.m02 = -s;
  out.m03 = c;
  out.m04 = 0;
  out.m05 = 0;
  return out;
};

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat23.identity(dest);
 *     mat23.scale(dest, dest, vec);
 *
 * @param {mat23} out mat23 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat23} out
 */
mat23.fromScaling = function (out, v) {
  out.m00 = v.m00;
  out.m01 = 0;
  out.m02 = 0;
  out.m03 = v.m01;
  out.m04 = 0;
  out.m05 = 0;
  return out;
};

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat23.identity(dest);
 *     mat23.translate(dest, dest, vec);
 *
 * @param {mat23} out mat23 receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat23} out
 */
mat23.fromTranslation = function (out, v) {
  out.m00 = 1;
  out.m01 = 0;
  out.m02 = 0;
  out.m03 = 1;
  out.m04 = v.x;
  out.m05 = v.y;
  return out;
};

/**
 * Returns a string representation of a mat23
 *
 * @param {mat23} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat23.str = function (a) {
  return ("mat23(" + (a.m00) + ", " + (a.m01) + ", " + (a.m02) + ", " + (a.m03) + ", " + (a.m04) + ", " + (a.m05) + ")");
};

/**
 * Returns typed array
 *
 * @param {array} out
 * @param {mat23} m
 * @returns {array}
 */
mat23.array = function (out, m) {
  out[0] = m.m00;
  out[1] = m.m01;
  out[2] = m.m02;
  out[3] = m.m03;
  out[4] = m.m04;
  out[5] = m.m05;

  return out;
};

/**
 * Returns typed array to 16 float array
 *
 * @param {array} out
 * @param {mat23} m
 * @returns {array}
 */
mat23.array4x4 = function (out, m) {
  out[0] = m.m00;
  out[1] = m.m01;
  out[2] = 0;
  out[3] = 0;
  out[4] = m.m02;
  out[5] = m.m03;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = m.m04;
  out[13] = m.m05;
  out[14] = 0;
  out[15] = 1;

  return out;
};

/**
 * Returns Frobenius norm of a mat23
 *
 * @param {mat23} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat23.frob = function (a) {
  return (Math.sqrt(Math.pow(a.m00, 2) + Math.pow(a.m01, 2) + Math.pow(a.m02, 2) + Math.pow(a.m03, 2) + Math.pow(a.m04, 2) + Math.pow(a.m05, 2) + 1));
};

/**
 * Adds two mat23's
 *
 * @param {mat23} out the receiving matrix
 * @param {mat23} a the first operand
 * @param {mat23} b the second operand
 * @returns {mat23} out
 */
mat23.add = function (out, a, b) {
  out.m00 = a.m00 + b.m00;
  out.m01 = a.m01 + b.m01;
  out.m02 = a.m02 + b.m02;
  out.m03 = a.m03 + b.m03;
  out.m04 = a.m04 + b.m04;
  out.m05 = a.m05 + b.m05;
  return out;
};

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat23} out the receiving matrix
 * @param {mat23} a the first operand
 * @param {mat23} b the second operand
 * @returns {mat23} out
 */
mat23.subtract = function (out, a, b) {
  out.m00 = a.m00 - b.m00;
  out.m01 = a.m01 - b.m01;
  out.m02 = a.m02 - b.m02;
  out.m03 = a.m03 - b.m03;
  out.m04 = a.m04 - b.m04;
  out.m05 = a.m05 - b.m05;
  return out;
};

/**
 * Alias for {@link mat23.subtract}
 * @function
 */
mat23.sub = mat23.subtract;

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat23} out the receiving matrix
 * @param {mat23} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat23} out
 */
mat23.multiplyScalar = function (out, a, b) {
  out.m00 = a.m00 * b;
  out.m01 = a.m01 * b;
  out.m02 = a.m02 * b;
  out.m03 = a.m03 * b;
  out.m04 = a.m04 * b;
  out.m05 = a.m05 * b;
  return out;
};

/**
 * Adds two mat23's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat23} out the receiving vector
 * @param {mat23} a the first operand
 * @param {mat23} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat23} out
 */
mat23.multiplyScalarAndAdd = function (out, a, b, scale) {
  out.m00 = a.m00 + (b.m00 * scale);
  out.m01 = a.m01 + (b.m01 * scale);
  out.m02 = a.m02 + (b.m02 * scale);
  out.m03 = a.m03 + (b.m03 * scale);
  out.m04 = a.m04 + (b.m04 * scale);
  out.m05 = a.m05 + (b.m05 * scale);
  return out;
};

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat23} a The first matrix.
 * @param {mat23} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat23.exactEquals = function (a, b) {
  return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 && a.m03 === b.m03 && a.m04 === b.m04 && a.m05 === b.m05;
};

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat23} a The first matrix.
 * @param {mat23} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat23.equals = function (a, b) {
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05;
  var b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03, b4 = b.m04, b5 = b.m05;
  return (
    Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
    Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
    Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
    Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5))
  );
};

var _tmp$7 = new Array(16);

var _mat4 = function _mat4(
  m00, m01, m02, m03,
  m04, m05, m06, m07,
  m08, m09, m10, m11,
  m12, m13, m14, m15
) {
  this.m00 = m00;
  this.m01 = m01;
  this.m02 = m02;
  this.m03 = m03;
  this.m04 = m04;
  this.m05 = m05;
  this.m06 = m06;
  this.m07 = m07;
  this.m08 = m08;
  this.m09 = m09;
  this.m10 = m10;
  this.m11 = m11;
  this.m12 = m12;
  this.m13 = m13;
  this.m14 = m14;
  this.m15 = m15;
};

_mat4.prototype.toJSON = function toJSON () {
  _tmp$7[0] = this.m00;
  _tmp$7[1] = this.m01;
  _tmp$7[2] = this.m02;
  _tmp$7[3] = this.m03;
  _tmp$7[4] = this.m04;
  _tmp$7[5] = this.m05;
  _tmp$7[6] = this.m06;
  _tmp$7[7] = this.m07;
  _tmp$7[8] = this.m08;
  _tmp$7[9] = this.m09;
  _tmp$7[10] = this.m10;
  _tmp$7[11] = this.m11;
  _tmp$7[12] = this.m12;
  _tmp$7[13] = this.m13;
  _tmp$7[14] = this.m14;
  _tmp$7[15] = this.m15;

  return _tmp$7;
};

/**
 * @class 4x4 Matrix
 * @name mat4
 *
 * NOTE: we use column-major matrix for all matrix calculation.
 *
 * This may lead to some confusion when referencing OpenGL documentation,
 * however, which represents out all matricies in column-major format.
 * This means that while in code a matrix may be typed out as:
 *
 * [1, 0, 0, 0,
 *  0, 1, 0, 0,
 *  0, 0, 1, 0,
 *  x, y, z, 0]
 *
 * The same matrix in the [OpenGL documentation](https://www.khronos.org/registry/OpenGL-Refpages/gl2.1/xhtml/glTranslate.xml)
 * is written as:
 *
 *  1 0 0 x
 *  0 1 0 y
 *  0 0 1 z
 *  0 0 0 0
 *
 * Please rest assured, however, that they are the same thing!
 * This is not unique to glMatrix, either, as OpenGL developers have long been confused by the
 * apparent lack of consistency between the memory layout and the documentation.
 */
var mat4 = {};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function () {
  return new _mat4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  );
};

/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */
mat4.new = function (m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  return new _mat4(
    m00, m01, m02, m03,
    m10, m11, m12, m13,
    m20, m21, m22, m23,
    m30, m31, m32, m33
  );
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function (a) {
  return new _mat4(
    a.m00, a.m01, a.m02, a.m03,
    a.m04, a.m05, a.m06, a.m07,
    a.m08, a.m09, a.m10, a.m11,
    a.m12, a.m13, a.m14, a.m15
  );
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function (out, a) {
  out.m00 = a.m00;
  out.m01 = a.m01;
  out.m02 = a.m02;
  out.m03 = a.m03;
  out.m04 = a.m04;
  out.m05 = a.m05;
  out.m06 = a.m06;
  out.m07 = a.m07;
  out.m08 = a.m08;
  out.m09 = a.m09;
  out.m10 = a.m10;
  out.m11 = a.m11;
  out.m12 = a.m12;
  out.m13 = a.m13;
  out.m14 = a.m14;
  out.m15 = a.m15;
  return out;
};

/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */
mat4.set = function (out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out.m00 = m00;
  out.m01 = m01;
  out.m02 = m02;
  out.m03 = m03;
  out.m04 = m10;
  out.m05 = m11;
  out.m06 = m12;
  out.m07 = m13;
  out.m08 = m20;
  out.m09 = m21;
  out.m10 = m22;
  out.m11 = m23;
  out.m12 = m30;
  out.m13 = m31;
  out.m14 = m32;
  out.m15 = m33;
  return out;
};


/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function (out) {
  out.m00 = 1;
  out.m01 = 0;
  out.m02 = 0;
  out.m03 = 0;
  out.m04 = 0;
  out.m05 = 1;
  out.m06 = 0;
  out.m07 = 0;
  out.m08 = 0;
  out.m09 = 0;
  out.m10 = 1;
  out.m11 = 0;
  out.m12 = 0;
  out.m13 = 0;
  out.m14 = 0;
  out.m15 = 1;
  return out;
};

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = function (out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a.m01, a02 = a.m02, a03 = a.m03,
        a12 = a.m06, a13 = a.m07,
        a23 = a.m11;

    out.m01 = a.m04;
    out.m02 = a.m08;
    out.m03 = a.m12;
    out.m04 = a01;
    out.m06 = a.m09;
    out.m07 = a.m13;
    out.m08 = a02;
    out.m09 = a12;
    out.m11 = a.m14;
    out.m12 = a03;
    out.m13 = a13;
    out.m14 = a23;
  } else {
    out.m00 = a.m00;
    out.m01 = a.m04;
    out.m02 = a.m08;
    out.m03 = a.m12;
    out.m04 = a.m01;
    out.m05 = a.m05;
    out.m06 = a.m09;
    out.m07 = a.m13;
    out.m08 = a.m02;
    out.m09 = a.m06;
    out.m10 = a.m10;
    out.m11 = a.m14;
    out.m12 = a.m03;
    out.m13 = a.m07;
    out.m14 = a.m11;
    out.m15 = a.m15;
  }

  return out;
};

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function (out, a) {
  var a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03,
      a10 = a.m04, a11 = a.m05, a12 = a.m06, a13 = a.m07,
      a20 = a.m08, a21 = a.m09, a22 = a.m10, a23 = a.m11,
      a30 = a.m12, a31 = a.m13, a32 = a.m14, a33 = a.m15;

  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out.m00 = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out.m01 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out.m02 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out.m03 = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out.m04 = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out.m05 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out.m06 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out.m07 = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out.m08 = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out.m09 = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out.m10 = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out.m11 = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out.m12 = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out.m13 = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out.m14 = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out.m15 = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return out;
};

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.adjoint = function (out, a) {
  var a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03,
      a10 = a.m04, a11 = a.m05, a12 = a.m06, a13 = a.m07,
      a20 = a.m08, a21 = a.m09, a22 = a.m10, a23 = a.m11,
      a30 = a.m12, a31 = a.m13, a32 = a.m14, a33 = a.m15;

  out.m00 = (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
  out.m01 = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out.m02 = (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
  out.m03 = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out.m04 = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out.m05 = (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
  out.m06 = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out.m07 = (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
  out.m08 = (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
  out.m09 = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out.m10 = (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
  out.m11 = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out.m12 = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out.m13 = (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
  out.m14 = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out.m15 = (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
  return out;
};

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
  var a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03,
      a10 = a.m04, a11 = a.m05, a12 = a.m06, a13 = a.m07,
      a20 = a.m08, a21 = a.m09, a22 = a.m10, a23 = a.m11,
      a30 = a.m12, a31 = a.m13, a32 = a.m14, a33 = a.m15;

  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's explicitly
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
  var a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03,
      a10 = a.m04, a11 = a.m05, a12 = a.m06, a13 = a.m07,
      a20 = a.m08, a21 = a.m09, a22 = a.m10, a23 = a.m11,
      a30 = a.m12, a31 = a.m13, a32 = a.m14, a33 = a.m15;

  // Cache only the current line of the second matrix
  var b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03;
  out.m00 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out.m01 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out.m02 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out.m03 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b.m04; b1 = b.m05; b2 = b.m06; b3 = b.m07;
  out.m04 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out.m05 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out.m06 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out.m07 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b.m08; b1 = b.m09; b2 = b.m10; b3 = b.m11;
  out.m08 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out.m09 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out.m10 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out.m11 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b.m12; b1 = b.m13; b2 = b.m14; b3 = b.m15;
  out.m12 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out.m13 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out.m14 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out.m15 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
  var x = v.x, y = v.y, z = v.z,
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23;

  if (a === out) {
    out.m12 = a.m00 * x + a.m04 * y + a.m08 * z + a.m12;
    out.m13 = a.m01 * x + a.m05 * y + a.m09 * z + a.m13;
    out.m14 = a.m02 * x + a.m06 * y + a.m10 * z + a.m14;
    out.m15 = a.m03 * x + a.m07 * y + a.m11 * z + a.m15;
  } else {
    a00 = a.m00; a01 = a.m01; a02 = a.m02; a03 = a.m03;
    a10 = a.m04; a11 = a.m05; a12 = a.m06; a13 = a.m07;
    a20 = a.m08; a21 = a.m09; a22 = a.m10; a23 = a.m11;

    out.m00 = a00; out.m01 = a01; out.m02 = a02; out.m03 = a03;
    out.m04 = a10; out.m05 = a11; out.m06 = a12; out.m07 = a13;
    out.m08 = a20; out.m09 = a21; out.m10 = a22; out.m11 = a23;

    out.m12 = a00 * x + a10 * y + a20 * z + a.m12;
    out.m13 = a01 * x + a11 * y + a21 * z + a.m13;
    out.m14 = a02 * x + a12 * y + a22 * z + a.m14;
    out.m15 = a03 * x + a13 * y + a23 * z + a.m15;
  }

  return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function (out, a, v) {
  var x = v.x, y = v.y, z = v.z;

  out.m00 = a.m00 * x;
  out.m01 = a.m01 * x;
  out.m02 = a.m02 * x;
  out.m03 = a.m03 * x;
  out.m04 = a.m04 * y;
  out.m05 = a.m05 * y;
  out.m06 = a.m06 * y;
  out.m07 = a.m07 * y;
  out.m08 = a.m08 * z;
  out.m09 = a.m09 * z;
  out.m10 = a.m10 * z;
  out.m11 = a.m11 * z;
  out.m12 = a.m12;
  out.m13 = a.m13;
  out.m14 = a.m14;
  out.m15 = a.m15;
  return out;
};

/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
  var x = axis.x, y = axis.y, z = axis.z;
  var s, c, t,
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23,
      b00, b01, b02,
      b10, b11, b12,
      b20, b21, b22;

  var len = Math.sqrt(x * x + y * y + z * z);

  if (Math.abs(len) < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;

  a00 = a.m00; a01 = a.m01; a02 = a.m02; a03 = a.m03;
  a10 = a.m04; a11 = a.m05; a12 = a.m06; a13 = a.m07;
  a20 = a.m08; a21 = a.m09; a22 = a.m10; a23 = a.m11;

  // Construct the elements of the rotation matrix
  b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
  b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
  b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

  // Perform rotation-specific matrix multiplication
  out.m00 = a00 * b00 + a10 * b01 + a20 * b02;
  out.m01 = a01 * b00 + a11 * b01 + a21 * b02;
  out.m02 = a02 * b00 + a12 * b01 + a22 * b02;
  out.m03 = a03 * b00 + a13 * b01 + a23 * b02;
  out.m04 = a00 * b10 + a10 * b11 + a20 * b12;
  out.m05 = a01 * b10 + a11 * b11 + a21 * b12;
  out.m06 = a02 * b10 + a12 * b11 + a22 * b12;
  out.m07 = a03 * b10 + a13 * b11 + a23 * b12;
  out.m08 = a00 * b20 + a10 * b21 + a20 * b22;
  out.m09 = a01 * b20 + a11 * b21 + a21 * b22;
  out.m10 = a02 * b20 + a12 * b21 + a22 * b22;
  out.m11 = a03 * b20 + a13 * b21 + a23 * b22;

  // If the source and destination differ, copy the unchanged last row
  if (a !== out) {
    out.m12 = a.m12;
    out.m13 = a.m13;
    out.m14 = a.m14;
    out.m15 = a.m15;
  }

  return out;
};

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = function (out, a, rad) {
  var s = Math.sin(rad),
      c = Math.cos(rad),
      a10 = a.m04,
      a11 = a.m05,
      a12 = a.m06,
      a13 = a.m07,
      a20 = a.m08,
      a21 = a.m09,
      a22 = a.m10,
      a23 = a.m11;

  if (a !== out) { // If the source and destination differ, copy the unchanged rows
    out.m00 = a.m00;
    out.m01 = a.m01;
    out.m02 = a.m02;
    out.m03 = a.m03;
    out.m12 = a.m12;
    out.m13 = a.m13;
    out.m14 = a.m14;
    out.m15 = a.m15;
  }

  // Perform axis-specific matrix multiplication
  out.m04 = a10 * c + a20 * s;
  out.m05 = a11 * c + a21 * s;
  out.m06 = a12 * c + a22 * s;
  out.m07 = a13 * c + a23 * s;
  out.m08 = a20 * c - a10 * s;
  out.m09 = a21 * c - a11 * s;
  out.m10 = a22 * c - a12 * s;
  out.m11 = a23 * c - a13 * s;

  return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateY = function (out, a, rad) {
  var s = Math.sin(rad),
      c = Math.cos(rad),
      a00 = a.m00,
      a01 = a.m01,
      a02 = a.m02,
      a03 = a.m03,
      a20 = a.m08,
      a21 = a.m09,
      a22 = a.m10,
      a23 = a.m11;

  if (a !== out) { // If the source and destination differ, copy the unchanged rows
    out.m04 = a.m04;
    out.m05 = a.m05;
    out.m06 = a.m06;
    out.m07 = a.m07;
    out.m12 = a.m12;
    out.m13 = a.m13;
    out.m14 = a.m14;
    out.m15 = a.m15;
  }

  // Perform axis-specific matrix multiplication
  out.m00 = a00 * c - a20 * s;
  out.m01 = a01 * c - a21 * s;
  out.m02 = a02 * c - a22 * s;
  out.m03 = a03 * c - a23 * s;
  out.m08 = a00 * s + a20 * c;
  out.m09 = a01 * s + a21 * c;
  out.m10 = a02 * s + a22 * c;
  out.m11 = a03 * s + a23 * c;

  return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateZ = function (out, a, rad) {
  var s = Math.sin(rad),
      c = Math.cos(rad),
      a00 = a.m00,
      a01 = a.m01,
      a02 = a.m02,
      a03 = a.m03,
      a10 = a.m04,
      a11 = a.m05,
      a12 = a.m06,
      a13 = a.m07;

  // If the source and destination differ, copy the unchanged last row
  if (a !== out) {
    out.m08 = a.m08;
    out.m09 = a.m09;
    out.m10 = a.m10;
    out.m11 = a.m11;
    out.m12 = a.m12;
    out.m13 = a.m13;
    out.m14 = a.m14;
    out.m15 = a.m15;
  }

  // Perform axis-specific matrix multiplication
  out.m00 = a00 * c + a10 * s;
  out.m01 = a01 * c + a11 * s;
  out.m02 = a02 * c + a12 * s;
  out.m03 = a03 * c + a13 * s;
  out.m04 = a10 * c - a00 * s;
  out.m05 = a11 * c - a01 * s;
  out.m06 = a12 * c - a02 * s;
  out.m07 = a13 * c - a03 * s;

  return out;
};

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromTranslation = function (out, v) {
  out.m00 = 1;
  out.m01 = 0;
  out.m02 = 0;
  out.m03 = 0;
  out.m04 = 0;
  out.m05 = 1;
  out.m06 = 0;
  out.m07 = 0;
  out.m08 = 0;
  out.m09 = 0;
  out.m10 = 1;
  out.m11 = 0;
  out.m12 = v.x;
  out.m13 = v.y;
  out.m14 = v.z;
  out.m15 = 1;
  return out;
};

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */
mat4.fromScaling = function (out, v) {
  out.m00 = v.x;
  out.m01 = 0;
  out.m02 = 0;
  out.m03 = 0;
  out.m04 = 0;
  out.m05 = v.y;
  out.m06 = 0;
  out.m07 = 0;
  out.m08 = 0;
  out.m09 = 0;
  out.m10 = v.z;
  out.m11 = 0;
  out.m12 = 0;
  out.m13 = 0;
  out.m14 = 0;
  out.m15 = 1;
  return out;
};

/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.fromRotation = function (out, rad, axis) {
  var x = axis.x, y = axis.y, z = axis.z;
  var len = Math.sqrt(x * x + y * y + z * z);
  var s, c, t;

  if (Math.abs(len) < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;

  // Perform rotation-specific matrix multiplication
  out.m00 = x * x * t + c;
  out.m01 = y * x * t + z * s;
  out.m02 = z * x * t - y * s;
  out.m03 = 0;
  out.m04 = x * y * t - z * s;
  out.m05 = y * y * t + c;
  out.m06 = z * y * t + x * s;
  out.m07 = 0;
  out.m08 = x * z * t + y * s;
  out.m09 = y * z * t - x * s;
  out.m10 = z * z * t + c;
  out.m11 = 0;
  out.m12 = 0;
  out.m13 = 0;
  out.m14 = 0;
  out.m15 = 1;
  return out;
};

/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromXRotation = function (out, rad) {
  var s = Math.sin(rad),
      c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out.m00 = 1;
  out.m01 = 0;
  out.m02 = 0;
  out.m03 = 0;
  out.m04 = 0;
  out.m05 = c;
  out.m06 = s;
  out.m07 = 0;
  out.m08 = 0;
  out.m09 = -s;
  out.m10 = c;
  out.m11 = 0;
  out.m12 = 0;
  out.m13 = 0;
  out.m14 = 0;
  out.m15 = 1;
  return out;
};

/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromYRotation = function (out, rad) {
  var s = Math.sin(rad),
      c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out.m00 = c;
  out.m01 = 0;
  out.m02 = -s;
  out.m03 = 0;
  out.m04 = 0;
  out.m05 = 1;
  out.m06 = 0;
  out.m07 = 0;
  out.m08 = s;
  out.m09 = 0;
  out.m10 = c;
  out.m11 = 0;
  out.m12 = 0;
  out.m13 = 0;
  out.m14 = 0;
  out.m15 = 1;
  return out;
};

/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromZRotation = function (out, rad) {
  var s = Math.sin(rad),
      c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out.m00 = c;
  out.m01 = s;
  out.m02 = 0;
  out.m03 = 0;
  out.m04 = -s;
  out.m05 = c;
  out.m06 = 0;
  out.m07 = 0;
  out.m08 = 0;
  out.m09 = 0;
  out.m10 = 1;
  out.m11 = 0;
  out.m12 = 0;
  out.m13 = 0;
  out.m14 = 0;
  out.m15 = 1;
  return out;
};

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRT = function (out, q, v) {
  // Quaternion math
  var x = q.x, y = q.y, z = q.z, w = q.w;
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;

  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;

  out.m00 = 1 - (yy + zz);
  out.m01 = xy + wz;
  out.m02 = xz - wy;
  out.m03 = 0;
  out.m04 = xy - wz;
  out.m05 = 1 - (xx + zz);
  out.m06 = yz + wx;
  out.m07 = 0;
  out.m08 = xz + wy;
  out.m09 = yz - wx;
  out.m10 = 1 - (xx + yy);
  out.m11 = 0;
  out.m12 = v.x;
  out.m13 = v.y;
  out.m14 = v.z;
  out.m15 = 1;

  return out;
};

/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRT,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
mat4.getTranslation = function (out, mat) {
  out.x = mat.m12;
  out.y = mat.m13;
  out.z = mat.m14;

  return out;
};

/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRTS
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
mat4.getScaling = function (out, mat) {
  var m11 = mat.m00,
      m12 = mat.m01,
      m13 = mat.m02,
      m21 = mat.m04,
      m22 = mat.m05,
      m23 = mat.m06,
      m31 = mat.m08,
      m32 = mat.m09,
      m33 = mat.m10;

  out.x = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
  out.y = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
  out.z = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);

  return out;
};

/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRT, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {mat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */
mat4.getRotation = function (out, mat) {
  // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
  var trace = mat.m00 + mat.m05 + mat.m10;
  var S = 0;

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out.w = 0.25 * S;
    out.x = (mat.m06 - mat.m09) / S;
    out.y = (mat.m08 - mat.m02) / S;
    out.z = (mat.m01 - mat.m04) / S;
  } else if ((mat.m00 > mat.m05) & (mat.m00 > mat.m10)) {
    S = Math.sqrt(1.0 + mat.m00 - mat.m05 - mat.m10) * 2;
    out.w = (mat.m06 - mat.m09) / S;
    out.x = 0.25 * S;
    out.y = (mat.m01 + mat.m04) / S;
    out.z = (mat.m08 + mat.m02) / S;
  } else if (mat.m05 > mat.m10) {
    S = Math.sqrt(1.0 + mat.m05 - mat.m00 - mat.m10) * 2;
    out.w = (mat.m08 - mat.m02) / S;
    out.x = (mat.m01 + mat.m04) / S;
    out.y = 0.25 * S;
    out.z = (mat.m06 + mat.m09) / S;
  } else {
    S = Math.sqrt(1.0 + mat.m10 - mat.m00 - mat.m05) * 2;
    out.w = (mat.m01 - mat.m04) / S;
    out.x = (mat.m08 + mat.m02) / S;
    out.y = (mat.m06 + mat.m09) / S;
    out.z = 0.25 * S;
  }

  return out;
};

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */
mat4.fromRTS = function (out, q, v, s) {
  // Quaternion math
  var x = q.x, y = q.y, z = q.z, w = q.w;
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;

  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s.x;
  var sy = s.y;
  var sz = s.z;

  out.m00 = (1 - (yy + zz)) * sx;
  out.m01 = (xy + wz) * sx;
  out.m02 = (xz - wy) * sx;
  out.m03 = 0;
  out.m04 = (xy - wz) * sy;
  out.m05 = (1 - (xx + zz)) * sy;
  out.m06 = (yz + wx) * sy;
  out.m07 = 0;
  out.m08 = (xz + wy) * sz;
  out.m09 = (yz - wx) * sz;
  out.m10 = (1 - (xx + yy)) * sz;
  out.m11 = 0;
  out.m12 = v.x;
  out.m13 = v.y;
  out.m14 = v.z;
  out.m15 = 1;

  return out;
};

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @param {vec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */
mat4.fromRTSOrigin = function (out, q, v, s, o) {
  // Quaternion math
  var x = q.x, y = q.y, z = q.z, w = q.w;
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;

  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;

  var sx = s.x;
  var sy = s.y;
  var sz = s.z;

  var ox = o.x;
  var oy = o.y;
  var oz = o.z;

  out.m00 = (1 - (yy + zz)) * sx;
  out.m01 = (xy + wz) * sx;
  out.m02 = (xz - wy) * sx;
  out.m03 = 0;
  out.m04 = (xy - wz) * sy;
  out.m05 = (1 - (xx + zz)) * sy;
  out.m06 = (yz + wx) * sy;
  out.m07 = 0;
  out.m08 = (xz + wy) * sz;
  out.m09 = (yz - wx) * sz;
  out.m10 = (1 - (xx + yy)) * sz;
  out.m11 = 0;
  out.m12 = v.x + ox - (out.m00 * ox + out.m04 * oy + out.m08 * oz);
  out.m13 = v.y + oy - (out.m01 * ox + out.m05 * oy + out.m09 * oz);
  out.m14 = v.z + oz - (out.m02 * ox + out.m06 * oy + out.m10 * oz);
  out.m15 = 1;

  return out;
};

/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */
mat4.fromQuat = function (out, q) {
  var x = q.x, y = q.y, z = q.z, w = q.w;
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;

  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;

  out.m00 = 1 - yy - zz;
  out.m01 = yx + wz;
  out.m02 = zx - wy;
  out.m03 = 0;

  out.m04 = yx - wz;
  out.m05 = 1 - xx - zz;
  out.m06 = zy + wx;
  out.m07 = 0;

  out.m08 = zx + wy;
  out.m09 = zy - wx;
  out.m10 = 1 - xx - yy;
  out.m11 = 0;

  out.m12 = 0;
  out.m13 = 0;
  out.m14 = 0;
  out.m15 = 1;

  return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);

  out.m00 = (near * 2) * rl;
  out.m01 = 0;
  out.m02 = 0;
  out.m03 = 0;
  out.m04 = 0;
  out.m05 = (near * 2) * tb;
  out.m06 = 0;
  out.m07 = 0;
  out.m08 = (right + left) * rl;
  out.m09 = (top + bottom) * tb;
  out.m10 = (far + near) * nf;
  out.m11 = -1;
  out.m12 = 0;
  out.m13 = 0;
  out.m14 = (far * near * 2) * nf;
  out.m15 = 0;
  return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2);
  var nf = 1 / (near - far);

  out.m00 = f / aspect;
  out.m01 = 0;
  out.m02 = 0;
  out.m03 = 0;
  out.m04 = 0;
  out.m05 = f;
  out.m06 = 0;
  out.m07 = 0;
  out.m08 = 0;
  out.m09 = 0;
  out.m10 = (far + near) * nf;
  out.m11 = -1;
  out.m12 = 0;
  out.m13 = 0;
  out.m14 = (2 * far * near) * nf;
  out.m15 = 0;
  return out;
};

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspectiveFromFieldOfView = function (out, fov, near, far) {
  var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
  var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
  var xScale = 2.0 / (leftTan + rightTan);
  var yScale = 2.0 / (upTan + downTan);

  out.m00 = xScale;
  out.m01 = 0.0;
  out.m02 = 0.0;
  out.m03 = 0.0;
  out.m04 = 0.0;
  out.m05 = yScale;
  out.m06 = 0.0;
  out.m07 = 0.0;
  out.m08 = -((leftTan - rightTan) * xScale * 0.5);
  out.m09 = ((upTan - downTan) * yScale * 0.5);
  out.m10 = far / (near - far);
  out.m11 = -1.0;
  out.m12 = 0.0;
  out.m13 = 0.0;
  out.m14 = (far * near) / (near - far);
  out.m15 = 0.0;
  return out;
};

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out.m00 = -2 * lr;
  out.m01 = 0;
  out.m02 = 0;
  out.m03 = 0;
  out.m04 = 0;
  out.m05 = -2 * bt;
  out.m06 = 0;
  out.m07 = 0;
  out.m08 = 0;
  out.m09 = 0;
  out.m10 = 2 * nf;
  out.m11 = 0;
  out.m12 = (left + right) * lr;
  out.m13 = (top + bottom) * bt;
  out.m14 = (far + near) * nf;
  out.m15 = 1;
  return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye.x;
  var eyey = eye.y;
  var eyez = eye.z;
  var upx = up.x;
  var upy = up.y;
  var upz = up.z;
  var centerx = center.x;
  var centery = center.y;
  var centerz = center.z;

  if (
    Math.abs(eyex - centerx) < EPSILON &&
    Math.abs(eyey - centery) < EPSILON &&
    Math.abs(eyez - centerz) < EPSILON
  ) {
    return mat4.identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;

  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;

  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;

  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out.m00 = x0;
  out.m01 = y0;
  out.m02 = z0;
  out.m03 = 0;
  out.m04 = x1;
  out.m05 = y1;
  out.m06 = z1;
  out.m07 = 0;
  out.m08 = x2;
  out.m09 = y2;
  out.m10 = z2;
  out.m11 = 0;
  out.m12 = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out.m13 = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out.m14 = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out.m15 = 1;

  return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
  return ("mat4(" + (a.m00) + ", " + (a.m01) + ", " + (a.m02) + ", " + (a.m03) + ", " + (a.m04) + ", " + (a.m05) + ", " + (a.m06) + ", " + (a.m07) + ", " + (a.m08) + ", " + (a.m09) + ", " + (a.m10) + ", " + (a.m11) + ", " + (a.m12) + ", " + (a.m13) + ", " + (a.m14) + ", " + (a.m15) + ")");
};

/**
 * Returns typed array
 *
 * @param {array} out
 * @param {mat4} m
 * @returns {array}
 */
mat4.array = function (out, m) {
  out[0]  = m.m00;
  out[1]  = m.m01;
  out[2]  = m.m02;
  out[3]  = m.m03;
  out[4]  = m.m04;
  out[5]  = m.m05;
  out[6]  = m.m06;
  out[7]  = m.m07;
  out[8]  = m.m08;
  out[9]  = m.m09;
  out[10] = m.m10;
  out[11] = m.m11;
  out[12] = m.m12;
  out[13] = m.m13;
  out[14] = m.m14;
  out[15] = m.m15;

  return out;
};

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat4.frob = function (a) {
  return (Math.sqrt(Math.pow(a.m00, 2) + Math.pow(a.m01, 2) + Math.pow(a.m02, 2) + Math.pow(a.m03, 2) + Math.pow(a.m04, 2) + Math.pow(a.m05, 2) + Math.pow(a.m06, 2) + Math.pow(a.m07, 2) + Math.pow(a.m08, 2) + Math.pow(a.m09, 2) + Math.pow(a.m10, 2) + Math.pow(a.m11, 2) + Math.pow(a.m12, 2) + Math.pow(a.m13, 2) + Math.pow(a.m14, 2) + Math.pow(a.m15, 2)))
};

/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.add = function (out, a, b) {
  out.m00 = a.m00 + b.m00;
  out.m01 = a.m01 + b.m01;
  out.m02 = a.m02 + b.m02;
  out.m03 = a.m03 + b.m03;
  out.m04 = a.m04 + b.m04;
  out.m05 = a.m05 + b.m05;
  out.m06 = a.m06 + b.m06;
  out.m07 = a.m07 + b.m07;
  out.m08 = a.m08 + b.m08;
  out.m09 = a.m09 + b.m09;
  out.m10 = a.m10 + b.m10;
  out.m11 = a.m11 + b.m11;
  out.m12 = a.m12 + b.m12;
  out.m13 = a.m13 + b.m13;
  out.m14 = a.m14 + b.m14;
  out.m15 = a.m15 + b.m15;
  return out;
};

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.subtract = function (out, a, b) {
  out.m00 = a.m00 - b.m00;
  out.m01 = a.m01 - b.m01;
  out.m02 = a.m02 - b.m02;
  out.m03 = a.m03 - b.m03;
  out.m04 = a.m04 - b.m04;
  out.m05 = a.m05 - b.m05;
  out.m06 = a.m06 - b.m06;
  out.m07 = a.m07 - b.m07;
  out.m08 = a.m08 - b.m08;
  out.m09 = a.m09 - b.m09;
  out.m10 = a.m10 - b.m10;
  out.m11 = a.m11 - b.m11;
  out.m12 = a.m12 - b.m12;
  out.m13 = a.m13 - b.m13;
  out.m14 = a.m14 - b.m14;
  out.m15 = a.m15 - b.m15;
  return out;
};

/**
 * Alias for {@link mat4.subtract}
 * @function
 */
mat4.sub = mat4.subtract;

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */
mat4.multiplyScalar = function (out, a, b) {
  out.m00 = a.m00 * b;
  out.m01 = a.m01 * b;
  out.m02 = a.m02 * b;
  out.m03 = a.m03 * b;
  out.m04 = a.m04 * b;
  out.m05 = a.m05 * b;
  out.m06 = a.m06 * b;
  out.m07 = a.m07 * b;
  out.m08 = a.m08 * b;
  out.m09 = a.m09 * b;
  out.m10 = a.m10 * b;
  out.m11 = a.m11 * b;
  out.m12 = a.m12 * b;
  out.m13 = a.m13 * b;
  out.m14 = a.m14 * b;
  out.m15 = a.m15 * b;
  return out;
};

/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */
mat4.multiplyScalarAndAdd = function (out, a, b, scale) {
  out.m00 = a.m00 + (b.m00 * scale);
  out.m01 = a.m01 + (b.m01 * scale);
  out.m02 = a.m02 + (b.m02 * scale);
  out.m03 = a.m03 + (b.m03 * scale);
  out.m04 = a.m04 + (b.m04 * scale);
  out.m05 = a.m05 + (b.m05 * scale);
  out.m06 = a.m06 + (b.m06 * scale);
  out.m07 = a.m07 + (b.m07 * scale);
  out.m08 = a.m08 + (b.m08 * scale);
  out.m09 = a.m09 + (b.m09 * scale);
  out.m10 = a.m10 + (b.m10 * scale);
  out.m11 = a.m11 + (b.m11 * scale);
  out.m12 = a.m12 + (b.m12 * scale);
  out.m13 = a.m13 + (b.m13 * scale);
  out.m14 = a.m14 + (b.m14 * scale);
  out.m15 = a.m15 + (b.m15 * scale);
  return out;
};

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat4.exactEquals = function (a, b) {
  return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 && a.m03 === b.m03 &&
    a.m04 === b.m04 && a.m05 === b.m05 && a.m06 === b.m06 && a.m07 === b.m07 &&
    a.m08 === b.m08 && a.m09 === b.m09 && a.m10 === b.m10 && a.m11 === b.m11 &&
    a.m12 === b.m12 && a.m13 === b.m13 && a.m14 === b.m14 && a.m15 === b.m15;
};

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat4.equals = function (a, b) {
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03,
      a4 = a.m04, a5 = a.m05, a6 = a.m06, a7 = a.m07,
      a8 = a.m08, a9 = a.m09, a10 = a.m10, a11 = a.m11,
      a12 = a.m12, a13 = a.m13, a14 = a.m14, a15 = a.m15;

  var b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03,
      b4 = b.m04, b5 = b.m05, b6 = b.m06, b7 = b.m07,
      b8 = b.m08, b9 = b.m09, b10 = b.m10, b11 = b.m11,
      b12 = b.m12, b13 = b.m13, b14 = b.m14, b15 = b.m15;

  return (
    Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
    Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
    Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
    Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
    Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
    Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
    Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) &&
    Math.abs(a9 - b9) <= EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) &&
    Math.abs(a10 - b10) <= EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) &&
    Math.abs(a11 - b11) <= EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) &&
    Math.abs(a12 - b12) <= EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) &&
    Math.abs(a13 - b13) <= EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) &&
    Math.abs(a14 - b14) <= EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) &&
    Math.abs(a15 - b15) <= EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15))
  );
};

var _tmp$8 = new Array(3);

var _color3 = function _color3(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
};

_color3.prototype.toJSON = function toJSON () {
  _tmp$8[0] = this.r;
  _tmp$8[1] = this.g;
  _tmp$8[2] = this.b;

  return _tmp$8;
};

/**
 * @class Color
 * @name color3
 */
var color3 = {};

/**
 * Creates a new color
 *
 * @returns {color3} a new color
 */
color3.create = function () {
  return new _color3(1, 1, 1);
};

/**
 * Creates a new color initialized with the given values
 *
 * @param {Number} r red component
 * @param {Number} g green component
 * @param {Number} b blue component
 * @returns {color3} a new color
 * @function
 */
color3.new = function (r, g, b) {
  return new _color3(r, g, b);
};

/**
 * Creates a new color initialized with values from an existing quaternion
 *
 * @param {color3} a color to clone
 * @returns {color3} a new color
 * @function
 */
color3.clone = function (a) {
  return new _color3(a.r, a.g, a.b, a.a);
};

/**
 * Copy the values from one color to another
 *
 * @param {color3} out the receiving color
 * @param {color3} a the source color
 * @returns {color3} out
 * @function
 */
color3.copy = function (out, a) {
  out.r = a.r;
  out.g = a.g;
  out.b = a.b;
  return out;
};

/**
 * Set the components of a color to the given values
 *
 * @param {color3} out the receiving color
 * @param {Number} r red component
 * @param {Number} g green component
 * @param {Number} b blue component
 * @returns {color3} out
 * @function
 */
color3.set = function (out, r, g, b) {
  out.r = r;
  out.g = g;
  out.b = b;
  return out;
};

/**
 * Set from hex
 *
 * @param {color3} out the receiving color
 * @param {Number} hex
 * @returns {color3} out
 * @function
 */
color3.fromHex = function (out, hex) {
  var r = ((hex >> 16)) / 255.0;
  var g = ((hex >> 8) & 0xff) / 255.0;
  var b = ((hex) & 0xff) / 255.0;

  out.r = r;
  out.g = g;
  out.b = b;
  return out;
};

/**
 * Adds two color's
 *
 * @param {color3} out the receiving color
 * @param {color3} a the first operand
 * @param {color3} b the second operand
 * @returns {color3} out
 * @function
 */
color3.add = function (out, a, b) {
  out.r = a.r + b.r;
  out.g = a.g + b.g;
  out.b = a.b + b.b;
  return out;
};

/**
 * Subtracts color b from color a
 *
 * @param {color3} out the receiving color
 * @param {color3} a the first operand
 * @param {color3} b the second operand
 * @returns {color3} out
 */
color3.subtract = function (out, a, b) {
  out.r = a.r - b.r;
  out.g = a.g - b.g;
  out.b = a.b - b.b;
  return out;
};

/**
 * Alias for {@link color3.subtract}
 * @function
 */
color3.sub = color3.subtract;

/**
 * Multiplies two color's
 *
 * @param {color3} out the receiving color
 * @param {color3} a the first operand
 * @param {color3} b the second operand
 * @returns {color3} out
 * @function
 */
color3.multiply = function (out, a, b) {
  out.r = a.r * b.r;
  out.g = a.g * b.g;
  out.b = a.b * b.b;
  return out;
};

/**
 * Alias for {@link color3.multiply}
 * @function
 */
color3.mul = color3.multiply;

/**
 * Divides two color's
 *
 * @param {color3} out the receiving vector
 * @param {color3} a the first operand
 * @param {color3} b the second operand
 * @returns {color3} out
 */
color3.divide = function (out, a, b) {
  out.r = a.r / b.r;
  out.g = a.g / b.g;
  out.b = a.b / b.b;
  return out;
};

/**
 * Alias for {@link color3.divide}
 * @function
 */
color3.div = color3.divide;


/**
 * Scales a color by a scalar number
 *
 * @param {color3} out the receiving vector
 * @param {color3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {color3} out
 * @function
 */
color3.scale = function (out, a, b) {
  out.r = a.r * b;
  out.g = a.g * b;
  out.b = a.b * b;
  return out;
};

/**
 * Performs a linear interpolation between two color's
 *
 * @param {color3} out the receiving color
 * @param {color3} a the first operand
 * @param {color3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {color3} out
 * @function
 */
color3.lerp = function (out, a, b, t) {
  var ar = a.r,
      ag = a.g,
      ab = a.b;
  out.r = ar + t * (b.r - ar);
  out.g = ag + t * (b.g - ag);
  out.b = ab + t * (b.b - ab);
  return out;
};

/**
 * Returns a string representation of a color
 *
 * @param {color3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
color3.str = function (a) {
  return ("color3(" + (a.r) + ", " + (a.g) + ", " + (a.b) + ")");
};

/**
 * Returns typed array
 *
 * @param {array} out
 * @param {color3} a
 * @returns {array}
 */
color3.array = function (out, a) {
  out[0] = a.r;
  out[1] = a.g;
  out[2] = a.b;

  return out;
};

/**
 * Returns whether or not the color have exactly the same elements in the same position (when compared with ===)
 *
 * @param {color3} a The first color3.
 * @param {color3} b The second color3.
 * @returns {Boolean} True if the colors are equal, false otherwise.
 */
color3.exactEquals = function (a, b) {
  return a.r === b.r && a.g === b.g && a.b === b.b;
};

/**
 * Returns whether or not the colors have approximately the same elements in the same position.
 *
 * @param {color3} a The first color3.
 * @param {color3} b The second color3.
 * @returns {Boolean} True if the colors are equal, false otherwise.
 */
color3.equals = function (a, b) {
  var a0 = a.r, a1 = a.g, a2 = a.b;
  var b0 = b.r, b1 = b.g, b2 = b.b;
  return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)));
};

/**
 * Returns the hex value
 *
 * @param {color3} a The color
 * @returns {Number}
 */
color3.hex = function (a) {
  return (a.r * 255) << 16 | (a.g * 255) << 8 | (a.b * 255);
};

var _tmp$9 = new Array(4);

var _color4 = function _color4(r, g, b, a) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
};

_color4.prototype.toJSON = function toJSON () {
  _tmp$9[0] = this.r;
  _tmp$9[1] = this.g;
  _tmp$9[2] = this.b;
  _tmp$9[3] = this.a;

  return _tmp$9;
};

/**
 * @class Color
 * @name color4
 */
var color4 = {};

/**
 * Creates a new color
 *
 * @returns {color4} a new color
 */
color4.create = function () {
  return new _color4(1, 1, 1, 1);
};

/**
 * Creates a new color initialized with the given values
 *
 * @param {Number} r red component
 * @param {Number} g green component
 * @param {Number} b blue component
 * @param {Number} a alpha component
 * @returns {color4} a new color
 * @function
 */
color4.new = function (r, g, b, a) {
  return new _color4(r, g, b, a);
};

/**
 * Creates a new color initialized with values from an existing quaternion
 *
 * @param {color4} a color to clone
 * @returns {color4} a new color
 * @function
 */
color4.clone = function (a) {
  return new _color4(a.r, a.g, a.b, a.a);
};

/**
 * Copy the values from one color to another
 *
 * @param {color4} out the receiving color
 * @param {color4} a the source color
 * @returns {color4} out
 * @function
 */
color4.copy = function (out, a) {
  out.r = a.r;
  out.g = a.g;
  out.b = a.b;
  out.a = a.a;
  return out;
};

/**
 * Set the components of a color to the given values
 *
 * @param {color4} out the receiving color
 * @param {Number} r red component
 * @param {Number} g green component
 * @param {Number} b blue component
 * @param {Number} a alpha component
 * @returns {color4} out
 * @function
 */
color4.set = function (out, r, g, b, a) {
  out.r = r;
  out.g = g;
  out.b = b;
  out.a = a;
  return out;
};

/**
 * Set from hex
 *
 * @param {color4} out the receiving color
 * @param {Number} hex
 * @returns {color4} out
 * @function
 */
color4.fromHex = function (out, hex) {
  var r = ((hex >> 24)) / 255.0;
  var g = ((hex >> 16) & 0xff) / 255.0;
  var b = ((hex >> 8) & 0xff) / 255.0;
  var a = ((hex) & 0xff) / 255.0;

  out.r = r;
  out.g = g;
  out.b = b;
  out.a = a;
  return out;
};

/**
 * Adds two color's
 *
 * @param {color4} out the receiving color
 * @param {color4} a the first operand
 * @param {color4} b the second operand
 * @returns {color4} out
 * @function
 */
color4.add = function (out, a, b) {
  out.r = a.r + b.r;
  out.g = a.g + b.g;
  out.b = a.b + b.b;
  out.a = a.a + b.a;
  return out;
};

/**
 * Subtracts color b from color a
 *
 * @param {color4} out the receiving color
 * @param {color4} a the first operand
 * @param {color4} b the second operand
 * @returns {color4} out
 */
color4.subtract = function (out, a, b) {
  out.r = a.r - b.r;
  out.g = a.g - b.g;
  out.b = a.b - b.b;
  out.a = a.a - b.a;
  return out;
};

/**
 * Alias for {@link color4.subtract}
 * @function
 */
color4.sub = color4.subtract;

/**
 * Multiplies two color's
 *
 * @param {color4} out the receiving color
 * @param {color4} a the first operand
 * @param {color4} b the second operand
 * @returns {color4} out
 * @function
 */
color4.multiply = function (out, a, b) {
  out.r = a.r * b.r;
  out.g = a.g * b.g;
  out.b = a.b * b.b;
  out.a = a.a * b.a;
  return out;
};

/**
 * Alias for {@link color4.multiply}
 * @function
 */
color4.mul = color4.multiply;

/**
 * Divides two color's
 *
 * @param {color4} out the receiving vector
 * @param {color4} a the first operand
 * @param {color4} b the second operand
 * @returns {color4} out
 */
color4.divide = function (out, a, b) {
  out.r = a.r / b.r;
  out.g = a.g / b.g;
  out.b = a.b / b.b;
  out.a = a.a / b.a;
  return out;
};

/**
 * Alias for {@link color4.divide}
 * @function
 */
color4.div = color4.divide;


/**
 * Scales a color by a scalar number
 *
 * @param {color4} out the receiving vector
 * @param {color4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {color4} out
 * @function
 */
color4.scale = function (out, a, b) {
  out.r = a.r * b;
  out.g = a.g * b;
  out.b = a.b * b;
  out.a = a.a * b;
  return out;
};

/**
 * Performs a linear interpolation between two color's
 *
 * @param {color4} out the receiving color
 * @param {color4} a the first operand
 * @param {color4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {color4} out
 * @function
 */
color4.lerp = function (out, a, b, t) {
  var ar = a.r,
      ag = a.g,
      ab = a.b,
      aa = a.a;
  out.r = ar + t * (b.r - ar);
  out.g = ag + t * (b.g - ag);
  out.b = ab + t * (b.b - ab);
  out.a = aa + t * (b.a - aa);
  return out;
};

/**
 * Returns a string representation of a color
 *
 * @param {color4} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
color4.str = function (a) {
  return ("color4(" + (a.r) + ", " + (a.g) + ", " + (a.b) + ", " + (a.a) + ")");
};

/**
 * Returns typed array
 *
 * @param {array} out
 * @param {color4} a
 * @returns {array}
 */
color4.array = function (out, a) {
  out[0] = a.r;
  out[1] = a.g;
  out[2] = a.b;
  out[3] = a.a;

  return out;
};

/**
 * Returns whether or not the color have exactly the same elements in the same position (when compared with ===)
 *
 * @param {color4} a The first color4.
 * @param {color4} b The second color4.
 * @returns {Boolean} True if the colors are equal, false otherwise.
 */
color4.exactEquals = function (a, b) {
  return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
};

/**
 * Returns whether or not the colors have approximately the same elements in the same position.
 *
 * @param {color4} a The first color4.
 * @param {color4} b The second color4.
 * @returns {Boolean} True if the colors are equal, false otherwise.
 */
color4.equals = function (a, b) {
  var a0 = a.r, a1 = a.g, a2 = a.b, a3 = a.a;
  var b0 = b.r, b1 = b.g, b2 = b.b, b3 = b.a;
  return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
    Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)));
};

/**
 * Returns the hex value
 *
 * @param {color4} a The color
 * @returns {Number}
 */
color4.hex = function (a) {
  return ((a.r * 255) << 24 | (a.g * 255) << 16 | (a.b * 255) << 8 | a.a * 255) >>> 0;
};

// NOTE: there is no syntax for: export {* as bits} from './lib/bits';
var bits = bits_;



var math = Object.freeze({
	bits: bits,
	vec2: vec2,
	vec3: vec3,
	vec4: vec4,
	quat: quat,
	mat2: mat2,
	mat23: mat23,
	mat3: mat3,
	mat4: mat4,
	color3: color3,
	color4: color4,
	EPSILON: EPSILON,
	equals: equals,
	approx: approx,
	clamp: clamp,
	clamp01: clamp01,
	lerp: lerp,
	toRadian: toRadian,
	toDegree: toDegree,
	random: random,
	randomRange: randomRange,
	randomRangeInt: randomRangeInt,
	nextPow2: nextPow2
});

var _m4_tmp = mat4.create();
var _genID$2 = 0;

var View = function View() {
  this._id = _genID$2++;

  // viewport
  this._rect = {
    x: 0, y: 0, w: 1, h: 1
  };

  // TODO:
  // this._scissor = {
  // x: 0, y: 0, w: 1, h: 1
  // };

  // clear options
  this._color = color4.new(0.3, 0.3, 0.3, 1);
  this._depth = 1;
  this._stencil = 1;
  this._clearFlags = enums$1.CLEAR_COLOR | enums$1.CLEAR_DEPTH;

  // matrix
  this._matView = mat4.create();
  this._matProj = mat4.create();
  this._matViewProj = mat4.create();
  this._matInvViewProj = mat4.create();

  // stages & framebuffer
  this._stages = [];
  this._cullingByID = false;
  this._framebuffer = null;

  this._shadowLight = null; // TODO: should not refer light in view.
};

View.prototype.getForward = function getForward (out) {
  return vec3.set(
    out,
    -this._matView.m02,
    -this._matView.m06,
    -this._matView.m10
  );
};

View.prototype.getPosition = function getPosition (out) {
  mat4.invert(_m4_tmp, this._matView);
  return mat4.getTranslation(out, _m4_tmp);
};

var _forward = vec3.new(0, 0, -1);

var _m4_tmp$1 = mat4.create();
var _m3_tmp = mat3.create();
var _transformedLightDirection = vec3.create();

// compute light viewProjMat for shadow.
function _computeSpotLightViewProjMatrix(light, outView, outProj) {
  // view matrix
  light._node.getWorldRT(outView);
  mat4.invert(outView, outView);

  // proj matrix
  mat4.perspective(outProj, light._spotAngle * light._spotAngleScale, 1, light._shadowMinDepth, light._shadowMaxDepth);
}

function _computeDirectionalLightViewProjMatrix(light, outView, outProj) {
  // view matrix
  light._node.getWorldRT(outView);
  mat4.invert(outView, outView);

  // TODO: should compute directional light frustum based on rendered meshes in scene.
  // proj matrix
  var halfSize = light._shadowFustumSize / 2;
  mat4.ortho(outProj, -halfSize, halfSize, -halfSize, halfSize, light._shadowMinDepth, light._shadowMaxDepth);
}

function _computePointLightViewProjMatrix(light, outView, outProj) {
  // TODO:
}

var Light = function Light() {
  this._poolID = -1;
  this._node = null;

  this._type = enums$1.LIGHT_DIRECTIONAL;

  this._color = color3.new(1, 1, 1);
  this._intensity = 1;

  // used for spot and point light
  this._range = 1;
  // used for spot light, default to 60 degrees
  this._spotAngle = toRadian(60);
  this._spotExp = 1;
  // cached for uniform
  this._directionUniform = new Float32Array(3);
  this._positionUniform = new Float32Array(3);
  this._colorUniform = new Float32Array([this._color.r * this._intensity, this._color.g * this._intensity, this._color.b * this._intensity]);
  this._spotUniform = new Float32Array([Math.cos(this._spotAngle * 0.5), this._spotExp]);

  // shadow params
  this._shadowType = enums$1.SHADOW_NONE;
  this._shadowFrameBuffer = null;
  this._shadowMap = null;
  this._shadowMapDirty = false;
  this._shadowDepthBuffer = null;
  this._shadowResolution = 1024;
  this._shadowBias = 0.00005;
  this._shadowDarkness = 1;
  this._shadowMinDepth = 1;
  this._shadowMaxDepth = 1000;
  this._shadowDepthScale = 50; // maybe need to change it if the distance between shadowMaxDepth and shadowMinDepth is small.
  this._frustumEdgeFalloff = 0; // used by directional and spot light.
  this._viewProjMatrix = mat4.create();
  this._spotAngleScale = 1; // used for spot light.
  this._shadowFustumSize = 80; // used for directional light.
};

var prototypeAccessors$4 = { color: { configurable: true },intensity: { configurable: true },type: { configurable: true },spotAngle: { configurable: true },spotExp: { configurable: true },range: { configurable: true },shadowType: { configurable: true },shadowMap: { configurable: true },viewProjMatrix: { configurable: true },shadowResolution: { configurable: true },shadowBias: { configurable: true },shadowDarkness: { configurable: true },shadowMinDepth: { configurable: true },shadowMaxDepth: { configurable: true },shadowDepthScale: { configurable: true },frustumEdgeFalloff: { configurable: true } };

Light.prototype.setNode = function setNode (node) {
  this._node = node;
};

Light.prototype.setColor = function setColor (r, g, b) {
  color3.set(this._color, r, g, b);
  this._colorUniform[0] = r * this._intensity;
  this._colorUniform[1] = g * this._intensity;
  this._colorUniform[2] = b * this._intensity;
};
prototypeAccessors$4.color.get = function () {
  return this._color;
};

Light.prototype.setIntensity = function setIntensity (val) {
  this._intensity = val;
  this._colorUniform[0] = val * this._color.r;
  this._colorUniform[1] = val * this._color.g;
  this._colorUniform[2] = val * this._color.b;
};
prototypeAccessors$4.intensity.get = function () {
  return this._intensity;
};

Light.prototype.setType = function setType (tpe) {
  this._type = tpe;
};
prototypeAccessors$4.type.get = function () {
  return this._type;
};

Light.prototype.setSpotAngle = function setSpotAngle (val) {
  this._spotAngle = val;
  this._spotUniform[0] = Math.cos(this._spotAngle * 0.5);
};
prototypeAccessors$4.spotAngle.get = function () {
  return this._spotAngle;
};

Light.prototype.setSpotExp = function setSpotExp (val) {
  this._spotExp = val;
  this._spotUniform[1] = val;
};
prototypeAccessors$4.spotExp.get = function () {
  return this._spotExp;
};

Light.prototype.setRange = function setRange (tpe) {
  this._range = tpe;
};
prototypeAccessors$4.range.get = function () {
  return this._range;
};

Light.prototype.setShadowType = function setShadowType (type) {
  if (this._shadowType === enums$1.SHADOW_NONE && type !== enums$1.SHADOW_NONE) {
    this._shadowMapDirty = true;
  }
  this._shadowType = type;
};
prototypeAccessors$4.shadowType.get = function () {
  return this._shadowType;
};

prototypeAccessors$4.shadowMap.get = function () {
  return this._shadowMap;
};

prototypeAccessors$4.viewProjMatrix.get = function () {
  return this._viewProjMatrix;
};

Light.prototype.setShadowResolution = function setShadowResolution (val) {
  if (this._shadowResolution !== val) {
    this._shadowMapDirty = true;
  }
  this._shadowResolution = val;
};
prototypeAccessors$4.shadowResolution.get = function () {
  return this._shadowResolution;
};

Light.prototype.setShadowBias = function setShadowBias (val) {
  this._shadowBias = val;
};
prototypeAccessors$4.shadowBias.get = function () {
  return this._shadowBias;
};

Light.prototype.setShadowDarkness = function setShadowDarkness (val) {
  this._shadowDarkness = val;
};
prototypeAccessors$4.shadowDarkness.get = function () {
  return this._shadowDarkness;
};

Light.prototype.setShadowMinDepth = function setShadowMinDepth (val) {
  this._shadowMinDepth = val;
};
prototypeAccessors$4.shadowMinDepth.get = function () {
  if (this._type === enums$1.LIGHT_DIRECTIONAL) {
    return 1.0;
  }
  return this._shadowMinDepth;
};

Light.prototype.setShadowMaxDepth = function setShadowMaxDepth (val) {
  this._shadowMaxDepth = val;
};
prototypeAccessors$4.shadowMaxDepth.get = function () {
  if (this._type === enums$1.LIGHT_DIRECTIONAL) {
    return 1.0;
  }
  return this._shadowMaxDepth;
};

Light.prototype.setShadowDepthScale = function setShadowDepthScale (val) {
  this._shadowDepthScale = val;
};
prototypeAccessors$4.shadowDepthScale.get = function () {
  return this._shadowDepthScale;
};

Light.prototype.setFrustumEdgeFalloff = function setFrustumEdgeFalloff (val) {
  this._frustumEdgeFalloff = val;
};
prototypeAccessors$4.frustumEdgeFalloff.get = function () {
  return this._frustumEdgeFalloff;
};

Light.prototype.extractView = function extractView (out, stages) {
  // TODO: view should not handle light.
  out._shadowLight = this;

  // rect
  out._rect.x = 0;
  out._rect.y = 0;
  out._rect.w = this._shadowResolution;
  out._rect.h = this._shadowResolution;

  // clear opts
  color4.set(out._color, 1, 1, 1, 1);
  out._depth = 1;
  out._stencil = 1;
  out._clearFlags = enums$1.CLEAR_COLOR | enums$1.CLEAR_DEPTH;

  // stages & framebuffer
  out._stages = stages;
  out._framebuffer = this._shadowFrameBuffer;

  // view projection matrix
  switch(this._type) {
    case enums$1.LIGHT_SPOT:
      _computeSpotLightViewProjMatrix(this, out._matView, out._matProj);
      break;

    case enums$1.LIGHT_DIRECTIONAL:
      _computeDirectionalLightViewProjMatrix(this, out._matView, out._matProj);
      break;

    case enums$1.LIGHT_POINT:
      _computePointLightViewProjMatrix(this, out._matView, out._matProj);
      break;

    default:
      console.warn('shadow of this light type is not supported');
  }

  // view-projection
  mat4.mul(out._matViewProj, out._matProj, out._matView);
  this._viewProjMatrix = out._matViewProj;
  mat4.invert(out._matInvViewProj, out._matViewProj);
};

Light.prototype._updateLightPositionAndDirection = function _updateLightPositionAndDirection () {
  this._node.getWorldMatrix(_m4_tmp$1);
  mat3.fromMat4(_m3_tmp, _m4_tmp$1);
  vec3.transformMat3(_transformedLightDirection, _forward, _m3_tmp);
  vec3.array(this._directionUniform, _transformedLightDirection);
  var pos = this._positionUniform;
  pos[0] = _m4_tmp$1.m12;
  pos[1] = _m4_tmp$1.m13;
  pos[2] = _m4_tmp$1.m14;
};

Light.prototype._generateShadowMap = function _generateShadowMap (device) {
  this._shadowMap = new gfx.Texture2D(device, {
    width: this._shadowResolution,
    height: this._shadowResolution,
    format: gfx.TEXTURE_FMT_RGBA8,
    wrapS: gfx.WRAP_CLAMP,
    wrapT: gfx.WRAP_CLAMP,
  });
  this._shadowDepthBuffer = new gfx.RenderBuffer(device,
    gfx.RB_FMT_D16,
    this._shadowResolution,
    this._shadowResolution
  );
  this._shadowFrameBuffer = new gfx.FrameBuffer(device, this._shadowResolution, this._shadowResolution, {
    colors: [this._shadowMap],
    depth: this._shadowDepthBuffer,
  });
};

Light.prototype._destroyShadowMap = function _destroyShadowMap () {
  if (this._shadowMap) {
    this._shadowMap.destroy();
    this._shadowDepthBuffer.destroy();
    this._shadowFrameBuffer.destroy();
    this._shadowMap = null;
    this._shadowDepthBuffer = null;
    this._shadowFrameBuffer = null;
  }
};

Light.prototype.update = function update (device) {
  this._updateLightPositionAndDirection();

  if (this._shadowType === enums$1.SHADOW_NONE) {
    this._destroyShadowMap();
  } else if (this._shadowMapDirty) {
    this._destroyShadowMap();
    this._generateShadowMap(device);
    this._shadowMapDirty = false;
  }

};

Object.defineProperties( Light.prototype, prototypeAccessors$4 );

var _matView = mat4.create();
var _matProj = mat4.create();
var _matViewProj = mat4.create();
var _matInvViewProj = mat4.create();
var _tmp_v3 = vec3.create();

var Camera = function Camera() {
  this._poolID = -1;
  this._node = null;

  //
  this._projection = enums$1.PROJ_PERSPECTIVE;

  // clear options
  this._color = color4.new(0.2, 0.3, 0.47, 1);
  this._depth = 1;
  this._stencil = 1;
  this._clearFlags = enums$1.CLEAR_COLOR | enums$1.CLEAR_DEPTH;

  // stages & framebuffer
  this._stages = [];
  this._framebuffer = null;

  // projection properties
  this._near = 0.01;
  this._far = 1000.0;
  this._fov = Math.PI/4.0; // vertical fov
  // this._aspect = 16.0/9.0; // DISABLE: use _rect.w/_rect.h
  this._rect = {
    x: 0, y: 0, w: 1, h: 1
  };

  // ortho properties
  this._orthoHeight = 10;
};

Camera.prototype.setNode = function setNode (node) {
  this._node = node;
};

Camera.prototype.setType = function setType (type) {
  this._projection = type;
};

Camera.prototype.setFov = function setFov (fov) {
  this._fov = fov;
};

Camera.prototype.setNear = function setNear (near) {
  this._near = near;
};
Camera.prototype.getNear = function getNear () {
  return this._near;
};

Camera.prototype.setFar = function setFar (far) {
  this._far = far;
};
Camera.prototype.getFar = function getFar () {
  return this._far;
};

Camera.prototype.setColor = function setColor (r, g, b, a) {
  color4.set(this._color, r, g, b, a);
};

Camera.prototype.setDepth = function setDepth (depth) {
  this._depth = depth;
};

Camera.prototype.setStencil = function setStencil (stencil) {
  this._stencil = stencil;
};

Camera.prototype.setClearFlags = function setClearFlags (flags) {
  this._clearFlags = flags;
};

/**
 * @param {Number} x - [0,1]
 * @param {Number} y - [0,1]
 * @param {Number} w - [0,1]
 * @param {Number} h - [0,1]
 */
Camera.prototype.setRect = function setRect (x, y, w, h) {
  this._rect.x = x;
  this._rect.y = y;
  this._rect.w = w;
  this._rect.h = h;
};

Camera.prototype.setStages = function setStages (stages) {
  this._stages = stages;
};

Camera.prototype.setFramebuffer = function setFramebuffer (framebuffer) {
  this._framebuffer = framebuffer;
};

Camera.prototype.extractView = function extractView (out, width, height) {
  // rect
  out._rect.x = this._rect.x * width;
  out._rect.y = this._rect.y * height;
  out._rect.w = this._rect.w * width;
  out._rect.h = this._rect.h * height;

  // clear opts
  out._color = this._color;
  out._depth = this._depth;
  out._stencil = this._stencil;
  out._clearFlags = this._clearFlags;

  // stages & framebuffer
  out._stages = this._stages;
  out._framebuffer = this._framebuffer;

  // view matrix
  this._node.getWorldRT(out._matView);
  mat4.invert(out._matView, out._matView);

  // projection matrix
  // TODO: if this._projDirty
  var aspect = width / height;
  if (this._projection === enums$1.PROJ_PERSPECTIVE) {
    mat4.perspective(out._matProj,
      this._fov,
      aspect,
      this._near,
      this._far
    );
  } else {
    var x = this._orthoHeight * aspect;
    var y = this._orthoHeight;
    mat4.ortho(out._matProj,
      -x, x, -y, y, this._near, this._far
    );
  }

  // view-projection
  mat4.mul(out._matViewProj, out._matProj, out._matView);
  mat4.invert(out._matInvViewProj, out._matViewProj);
};

Camera.prototype.screenToWorld = function screenToWorld (out, screenPos, width, height) {
  var aspect = width / height;
  var cx = this._rect.x * width;
  var cy = this._rect.y * height;
  var cw = this._rect.w * width;
  var ch = this._rect.h * height;

  // view matrix
  this._node.getWorldRT(_matView);
  mat4.invert(_matView, _matView);

  // projection matrix
  if (this._projection === enums$1.PROJ_PERSPECTIVE) {
    mat4.perspective(_matProj,
      this._fov,
      aspect,
      this._near,
      this._far
    );
  } else {
    var x = this._orthoHeight * aspect;
    var y = this._orthoHeight;
    mat4.ortho(_matProj,
      -x, x, -y, y, this._near, this._far
    );
  }

  // view-projection
  mat4.mul(_matViewProj, _matProj, _matView);

  // inv view-projection
  mat4.invert(_matInvViewProj, _matViewProj);

  //
  if (this._projection === enums$1.PROJ_PERSPECTIVE) {
    // calculate screen pos in far clip plane
    vec3.set(out,
      (screenPos.x - cx) * 2.0 / cw - 1.0,
      (screenPos.y - cy) * 2.0 / ch - 1.0, // DISABLE: (ch - (screenPos.y - cy)) * 2.0 / ch - 1.0,
      1.0
    );

    // transform to world
    vec3.transformMat4(out, out, _matInvViewProj);

    //
    this._node.getWorldPos(_tmp_v3);
    vec3.lerp(out, _tmp_v3, out, screenPos.z / this._far);
  } else {
    var range = this._farClip - this._nearClip;
    vec3.set(out,
      (screenPos.x - cx) * 2.0 / cw - 1.0,
      (screenPos.y - cy) * 2.0 / ch - 1.0, // DISABLE: (ch - (screenPos.y - cy)) * 2.0 / ch - 1.0,
      (this._far - screenPos.z) / range * 2.0 - 1.0
    );

    // transform to world
    vec3.transformMat4(out, out, _matInvViewProj);
  }

  return out;
};

Camera.prototype.worldToScreen = function worldToScreen (out, worldPos, width, height) {
  var aspect = width / height;
  var cx = this._rect.x * width;
  var cy = this._rect.y * height;
  var cw = this._rect.w * width;
  var ch = this._rect.h * height;

  // view matrix
  this._node.getWorldRT(_matView);
  mat4.invert(_matView, _matView);

  // projection matrix
  if (this._projection === enums$1.PROJ_PERSPECTIVE) {
    mat4.perspective(_matProj,
      this._fov,
      aspect,
      this._near,
      this._far
    );
  } else {
    var x = this._orthoHeight * aspect;
    var y = this._orthoHeight;
    mat4.ortho(_matProj,
      -x, x, -y, y, this._near, this._far
    );
  }

  // view-projection
  mat4.mul(_matViewProj, _matProj, _matView);

  // calculate w
  var w =
    worldPos.x * _matViewProj.m03 +
    worldPos.y * _matViewProj.m07 +
    worldPos.z * _matViewProj.m11 +
    _matViewProj.m15;

  vec3.transformMat4(out, worldPos, _matViewProj);
  out.x = cx + (out.x / w + 1) * 0.5 * cw;
  out.y = cy + (out.y / w + 1) * 0.5 * ch;

  return out;
};

var Model = function Model() {
  this._poolID = -1;
  this._node = null;
  this._inputAssemblers = [];
  this._effects = [];
  this._options = [];
  this._dynamicIA = false;
  this._viewID = -1;

  // TODO: we calculate aabb based on vertices
  // this._aabb
};

var prototypeAccessors$5 = { inputAssemblerCount: { configurable: true },dynamicIA: { configurable: true },drawItemCount: { configurable: true } };

prototypeAccessors$5.inputAssemblerCount.get = function () {
  return this._inputAssemblers.length;
};

prototypeAccessors$5.dynamicIA.get = function () {
  return this._dynamicIA;
};

prototypeAccessors$5.drawItemCount.get = function () {
  return this._dynamicIA ? 1 : this._inputAssemblers.length;
};

Model.prototype.setNode = function setNode (node) {
  this._node = node;
};

Model.prototype.setDynamicIA = function setDynamicIA (enabled) {
  this._dynamicIA = enabled;
};

Model.prototype.addInputAssembler = function addInputAssembler (ia) {
  if (this._inputAssemblers.indexOf(ia) !== -1) {
    return;
  }
  this._inputAssemblers.push(ia);
};

Model.prototype.clearInputAssemblers = function clearInputAssemblers () {
  this._inputAssemblers.length = 0;
};

Model.prototype.addEffect = function addEffect (effect) {
  if (this._effects.indexOf(effect) !== -1) {
    return;
  }
  this._effects.push(effect);

  //
  var opts = Object.create(null);
  effect.extractOptions(opts);
  this._options.push(opts);
};

Model.prototype.clearEffects = function clearEffects () {
  this._effects.length = 0;
  this._options.length = 0;
};

Model.prototype.extractDrawItem = function extractDrawItem (out, index) {
  if (this._dynamicIA) {
    out.model = this;
    out.node = this._node;
    out.ia = null;
    out.effect = this._effects[0];
    out.options = out.effect.extractOptions(this._options[0]);

    return;
  }

  if (index >= this._inputAssemblers.length ) {
    out.model = null;
    out.node = null;
    out.ia = null;
    out.effect = null;
    out.options = null;

    return;
  }

  out.model = this;
  out.node = this._node;
  out.ia = this._inputAssemblers[index];

  var effect, options;
  if (index < this._effects.length) {
    effect = this._effects[index];
    options = this._options[index];
  } else {
    effect = this._effects[this._effects.length-1];
    options = this._options[this._effects.length-1];
  }
  out.effect = effect;
  out.options = effect.extractOptions(options);
};

Object.defineProperties( Model.prototype, prototypeAccessors$5 );

var CircularPool = function CircularPool(fn, size) {
  var this$1 = this;

  this._cursor = 0;
  this._data = new Array(size);

  for (var i = 0; i < size; ++i) {
    this$1._data[i] = fn();
  }
};

CircularPool.prototype.request = function request () {
  var item = this._data[this._cursor];
  this._cursor = (this._cursor + 1) % this._data.length;

  return item;
};

// reference: https://github.com/mziccard/node-timsort

/**
 * Default minimum size of a run.
 */
var DEFAULT_MIN_MERGE = 32;

/**
 * Minimum ordered subsequece required to do galloping.
 */
var DEFAULT_MIN_GALLOPING = 7;

/**
 * Default tmp storage length. Can increase depending on the size of the
 * smallest run to merge.
 */
var DEFAULT_TMP_STORAGE_LENGTH = 256;

/**
 * Pre-computed powers of 10 for efficient lexicographic comparison of
 * small integers.
 */
var POWERS_OF_TEN = [1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];

/**
 * Estimate the logarithm base 10 of a small integer.
 *
 * @param {number} x - The integer to estimate the logarithm of.
 * @return {number} - The estimated logarithm of the integer.
 */
function log10$1(x) {
  if (x < 1e5) {
    if (x < 1e2) {
      return x < 1e1 ? 0 : 1;
    }

    if (x < 1e4) {
      return x < 1e3 ? 2 : 3;
    }

    return 4;
  }

  if (x < 1e7) {
    return x < 1e6 ? 5 : 6;
  }

  if (x < 1e9) {
    return x < 1e8 ? 7 : 8;
  }

  return 9;
}

/**
 * Default alphabetical comparison of items.
 *
 * @param {string|object|number} a - First element to compare.
 * @param {string|object|number} b - Second element to compare.
 * @return {number} - A positive number if a.toString() > b.toString(), a
 * negative number if .toString() < b.toString(), 0 otherwise.
 */
function alphabeticalCompare(a, b) {
  if (a === b) {
    return 0;
  }

  if (~~a === a && ~~b === b) {
    if (a === 0 || b === 0) {
      return a < b ? -1 : 1;
    }

    if (a < 0 || b < 0) {
      if (b >= 0) {
        return -1;
      }

      if (a >= 0) {
        return 1;
      }

      a = -a;
      b = -b;
    }

    var al = log10$1(a);
    var bl = log10$1(b);

    var t = 0;

    if (al < bl) {
      a *= POWERS_OF_TEN[bl - al - 1];
      b /= 10;
      t = -1;
    } else if (al > bl) {
      b *= POWERS_OF_TEN[al - bl - 1];
      a /= 10;
      t = 1;
    }

    if (a === b) {
      return t;
    }

    return a < b ? -1 : 1;
  }

  var aStr = String(a);
  var bStr = String(b);

  if (aStr === bStr) {
    return 0;
  }

  return aStr < bStr ? -1 : 1;
}

/**
 * Compute minimum run length for TimSort
 *
 * @param {number} n - The size of the array to sort.
 */
function minRunLength(n) {
  var r = 0;

  while (n >= DEFAULT_MIN_MERGE) {
    r |= (n & 1);
    n >>= 1;
  }

  return n + r;
}

/**
 * Counts the length of a monotonically ascending or strictly monotonically
 * descending sequence (run) starting at array[lo] in the range [lo, hi). If
 * the run is descending it is made ascending.
 *
 * @param {array} array - The array to reverse.
 * @param {number} lo - First element in the range (inclusive).
 * @param {number} hi - Last element in the range.
 * @param {function} compare - Item comparison function.
 * @return {number} - The length of the run.
 */
function makeAscendingRun(array, lo, hi, compare) {
  var runHi = lo + 1;

  if (runHi === hi) {
    return 1;
  }

  // Descending
  if (compare(array[runHi++], array[lo]) < 0) {
    while (runHi < hi && compare(array[runHi], array[runHi - 1]) < 0) {
      runHi++;
    }

    reverseRun(array, lo, runHi);
    // Ascending
  } else {
    while (runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0) {
      runHi++;
    }
  }

  return runHi - lo;
}

/**
 * Reverse an array in the range [lo, hi).
 *
 * @param {array} array - The array to reverse.
 * @param {number} lo - First element in the range (inclusive).
 * @param {number} hi - Last element in the range.
 */
function reverseRun(array, lo, hi) {
  hi--;

  while (lo < hi) {
    var t = array[lo];
    array[lo++] = array[hi];
    array[hi--] = t;
  }
}

/**
 * Perform the binary sort of the array in the range [lo, hi) where start is
 * the first element possibly out of order.
 *
 * @param {array} array - The array to sort.
 * @param {number} lo - First element in the range (inclusive).
 * @param {number} hi - Last element in the range.
 * @param {number} start - First element possibly out of order.
 * @param {function} compare - Item comparison function.
 */
function binaryInsertionSort(array, lo, hi, start, compare) {
  if (start === lo) {
    start++;
  }

  for (; start < hi; start++) {
    var pivot = array[start];

    // Ranges of the array where pivot belongs
    var left = lo;
    var right = start;

    /*
     *   pivot >= array[i] for i in [lo, left)
     *   pivot <  array[i] for i in  in [right, start)
     */
    while (left < right) {
      var mid = (left + right) >>> 1;

      if (compare(pivot, array[mid]) < 0) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    /*
     * Move elements right to make room for the pivot. If there are elements
     * equal to pivot, left points to the first slot after them: this is also
     * a reason for which TimSort is stable
     */
    var n = start - left;
    // Switch is just an optimization for small arrays
    switch (n) {
      case 3:
        array[left + 3] = array[left + 2];
      /* falls through */
      case 2:
        array[left + 2] = array[left + 1];
      /* falls through */
      case 1:
        array[left + 1] = array[left];
        break;
      default:
        while (n > 0) {
          array[left + n] = array[left + n - 1];
          n--;
        }
    }

    array[left] = pivot;
  }
}

/**
 * Find the position at which to insert a value in a sorted range. If the range
 * contains elements equal to the value the leftmost element index is returned
 * (for stability).
 *
 * @param {number} value - Value to insert.
 * @param {array} array - The array in which to insert value.
 * @param {number} start - First element in the range.
 * @param {number} length - Length of the range.
 * @param {number} hint - The index at which to begin the search.
 * @param {function} compare - Item comparison function.
 * @return {number} - The index where to insert value.
 */
function gallopLeft(value, array, start, length, hint, compare) {
  var lastOffset = 0;
  var maxOffset = 0;
  var offset = 1;

  if (compare(value, array[start + hint]) > 0) {
    maxOffset = length - hint;

    while (offset < maxOffset && compare(value, array[start + hint + offset]) > 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    }

    // Make offsets relative to start
    lastOffset += hint;
    offset += hint;

    // value <= array[start + hint]
  } else {
    maxOffset = hint + 1;
    while (offset < maxOffset && compare(value, array[start + hint - offset]) <= 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }
    if (offset > maxOffset) {
      offset = maxOffset;
    }

    // Make offsets relative to start
    var tmp = lastOffset;
    lastOffset = hint - offset;
    offset = hint - tmp;
  }

  /*
   * Now array[start+lastOffset] < value <= array[start+offset], so value
   * belongs somewhere in the range (start + lastOffset, start + offset]. Do a
   * binary search, with invariant array[start + lastOffset - 1] < value <=
   * array[start + offset].
   */
  lastOffset++;
  while (lastOffset < offset) {
    var m = lastOffset + ((offset - lastOffset) >>> 1);

    if (compare(value, array[start + m]) > 0) {
      lastOffset = m + 1;

    } else {
      offset = m;
    }
  }
  return offset;
}

/**
 * Find the position at which to insert a value in a sorted range. If the range
 * contains elements equal to the value the rightmost element index is returned
 * (for stability).
 *
 * @param {number} value - Value to insert.
 * @param {array} array - The array in which to insert value.
 * @param {number} start - First element in the range.
 * @param {number} length - Length of the range.
 * @param {number} hint - The index at which to begin the search.
 * @param {function} compare - Item comparison function.
 * @return {number} - The index where to insert value.
 */
function gallopRight(value, array, start, length, hint, compare) {
  var lastOffset = 0;
  var maxOffset = 0;
  var offset = 1;

  if (compare(value, array[start + hint]) < 0) {
    maxOffset = hint + 1;

    while (offset < maxOffset && compare(value, array[start + hint - offset]) < 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    }

    // Make offsets relative to start
    var tmp = lastOffset;
    lastOffset = hint - offset;
    offset = hint - tmp;

    // value >= array[start + hint]
  } else {
    maxOffset = length - hint;

    while (offset < maxOffset && compare(value, array[start + hint + offset]) >= 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    }

    // Make offsets relative to start
    lastOffset += hint;
    offset += hint;
  }

  /*
   * Now array[start+lastOffset] < value <= array[start+offset], so value
   * belongs somewhere in the range (start + lastOffset, start + offset]. Do a
   * binary search, with invariant array[start + lastOffset - 1] < value <=
   * array[start + offset].
   */
  lastOffset++;

  while (lastOffset < offset) {
    var m = lastOffset + ((offset - lastOffset) >>> 1);

    if (compare(value, array[start + m]) < 0) {
      offset = m;

    } else {
      lastOffset = m + 1;
    }
  }

  return offset;
}

var TimSort = function TimSort(array, compare) {
  this.array = array;
  this.compare = compare;
  this.minGallop = DEFAULT_MIN_GALLOPING;
  this.length = array.length;

  this.tmpStorageLength = DEFAULT_TMP_STORAGE_LENGTH;
  if (this.length < 2 * DEFAULT_TMP_STORAGE_LENGTH) {
    this.tmpStorageLength = this.length >>> 1;
  }

  this.tmp = new Array(this.tmpStorageLength);

  this.stackLength =
    (this.length < 120 ? 5 :
      this.length < 1542 ? 10 :
        this.length < 119151 ? 19 : 40);

  this.runStart = new Array(this.stackLength);
  this.runLength = new Array(this.stackLength);
  this.stackSize = 0;
};

/**
 * Push a new run on TimSort's stack.
 *
 * @param {number} runStart - Start index of the run in the original array.
 * @param {number} runLength - Length of the run;
 */
TimSort.prototype.pushRun = function pushRun (runStart, runLength) {
  this.runStart[this.stackSize] = runStart;
  this.runLength[this.stackSize] = runLength;
  this.stackSize += 1;
};

/**
 * Merge runs on TimSort's stack so that the following holds for all i:
 * 1) runLength[i - 3] > runLength[i - 2] + runLength[i - 1]
 * 2) runLength[i - 2] > runLength[i - 1]
 */
TimSort.prototype.mergeRuns = function mergeRuns () {
    var this$1 = this;

  while (this.stackSize > 1) {
    var n = this$1.stackSize - 2;

    if ((n >= 1 &&
      this$1.runLength[n - 1] <= this$1.runLength[n] + this$1.runLength[n + 1]) ||
      (n >= 2 &&
      this$1.runLength[n - 2] <= this$1.runLength[n] + this$1.runLength[n - 1])) {

      if (this$1.runLength[n - 1] < this$1.runLength[n + 1]) {
        n--;
      }

    } else if (this$1.runLength[n] > this$1.runLength[n + 1]) {
      break;
    }
    this$1.mergeAt(n);
  }
};

/**
 * Merge all runs on TimSort's stack until only one remains.
 */
TimSort.prototype.forceMergeRuns = function forceMergeRuns () {
    var this$1 = this;

  while (this.stackSize > 1) {
    var n = this$1.stackSize - 2;

    if (n > 0 && this$1.runLength[n - 1] < this$1.runLength[n + 1]) {
      n--;
    }

    this$1.mergeAt(n);
  }
};

/**
 * Merge the runs on the stack at positions i and i+1. Must be always be called
 * with i=stackSize-2 or i=stackSize-3 (that is, we merge on top of the stack).
 *
 * @param {number} i - Index of the run to merge in TimSort's stack.
 */
TimSort.prototype.mergeAt = function mergeAt (i) {
  var compare = this.compare;
  var array = this.array;

  var start1 = this.runStart[i];
  var length1 = this.runLength[i];
  var start2 = this.runStart[i + 1];
  var length2 = this.runLength[i + 1];

  this.runLength[i] = length1 + length2;

  if (i === this.stackSize - 3) {
    this.runStart[i + 1] = this.runStart[i + 2];
    this.runLength[i + 1] = this.runLength[i + 2];
  }

  this.stackSize--;

  /*
   * Find where the first element in the second run goes in run1. Previous
   * elements in run1 are already in place
   */
  var k = gallopRight(array[start2], array, start1, length1, 0, compare);
  start1 += k;
  length1 -= k;

  if (length1 === 0) {
    return;
  }

  /*
   * Find where the last element in the first run goes in run2. Next elements
   * in run2 are already in place
   */
  length2 = gallopLeft(array[start1 + length1 - 1], array, start2, length2, length2 - 1, compare);

  if (length2 === 0) {
    return;
  }

  /*
   * Merge remaining runs. A tmp array with length = min(length1, length2) is
   * used
   */
  if (length1 <= length2) {
    this.mergeLow(start1, length1, start2, length2);

  } else {
    this.mergeHigh(start1, length1, start2, length2);
  }
};

/**
 * Merge two adjacent runs in a stable way. The runs must be such that the
 * first element of run1 is bigger than the first element in run2 and the
 * last element of run1 is greater than all the elements in run2.
 * The method should be called when run1.length <= run2.length as it uses
 * TimSort temporary array to store run1. Use mergeHigh if run1.length >
 * run2.length.
 *
 * @param {number} start1 - First element in run1.
 * @param {number} length1 - Length of run1.
 * @param {number} start2 - First element in run2.
 * @param {number} length2 - Length of run2.
 */
TimSort.prototype.mergeLow = function mergeLow (start1, length1, start2, length2) {

  var compare = this.compare;
  var array = this.array;
  var tmp = this.tmp;
  var i = 0;

  for (i = 0; i < length1; i++) {
    tmp[i] = array[start1 + i];
  }

  var cursor1 = 0;
  var cursor2 = start2;
  var dest = start1;

  array[dest++] = array[cursor2++];

  if (--length2 === 0) {
    for (i = 0; i < length1; i++) {
      array[dest + i] = tmp[cursor1 + i];
    }
    return;
  }

  if (length1 === 1) {
    for (i = 0; i < length2; i++) {
      array[dest + i] = array[cursor2 + i];
    }
    array[dest + length2] = tmp[cursor1];
    return;
  }

  var minGallop = this.minGallop;

  while (true) {
    var count1 = 0;
    var count2 = 0;
    var exit = false;

    do {
      if (compare(array[cursor2], tmp[cursor1]) < 0) {
        array[dest++] = array[cursor2++];
        count2++;
        count1 = 0;

        if (--length2 === 0) {
          exit = true;
          break;
        }

      } else {
        array[dest++] = tmp[cursor1++];
        count1++;
        count2 = 0;
        if (--length1 === 1) {
          exit = true;
          break;
        }
      }
    } while ((count1 | count2) < minGallop);

    if (exit) {
      break;
    }

    do {
      count1 = gallopRight(array[cursor2], tmp, cursor1, length1, 0, compare);

      if (count1 !== 0) {
        for (i = 0; i < count1; i++) {
          array[dest + i] = tmp[cursor1 + i];
        }

        dest += count1;
        cursor1 += count1;
        length1 -= count1;
        if (length1 <= 1) {
          exit = true;
          break;
        }
      }

      array[dest++] = array[cursor2++];

      if (--length2 === 0) {
        exit = true;
        break;
      }

      count2 = gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare);

      if (count2 !== 0) {
        for (i = 0; i < count2; i++) {
          array[dest + i] = array[cursor2 + i];
        }

        dest += count2;
        cursor2 += count2;
        length2 -= count2;

        if (length2 === 0) {
          exit = true;
          break;
        }
      }
      array[dest++] = tmp[cursor1++];

      if (--length1 === 1) {
        exit = true;
        break;
      }

      minGallop--;

    } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);

    if (exit) {
      break;
    }

    if (minGallop < 0) {
      minGallop = 0;
    }

    minGallop += 2;
  }

  this.minGallop = minGallop;

  if (minGallop < 1) {
    this.minGallop = 1;
  }

  if (length1 === 1) {
    for (i = 0; i < length2; i++) {
      array[dest + i] = array[cursor2 + i];
    }
    array[dest + length2] = tmp[cursor1];

  } else if (length1 === 0) {
    throw new Error('mergeLow preconditions were not respected');

  } else {
    for (i = 0; i < length1; i++) {
      array[dest + i] = tmp[cursor1 + i];
    }
  }
};

/**
 * Merge two adjacent runs in a stable way. The runs must be such that the
 * first element of run1 is bigger than the first element in run2 and the
 * last element of run1 is greater than all the elements in run2.
 * The method should be called when run1.length > run2.length as it uses
 * TimSort temporary array to store run2. Use mergeLow if run1.length <=
 * run2.length.
 *
 * @param {number} start1 - First element in run1.
 * @param {number} length1 - Length of run1.
 * @param {number} start2 - First element in run2.
 * @param {number} length2 - Length of run2.
 */
TimSort.prototype.mergeHigh = function mergeHigh (start1, length1, start2, length2) {
  var compare = this.compare;
  var array = this.array;
  var tmp = this.tmp;
  var i = 0;

  for (i = 0; i < length2; i++) {
    tmp[i] = array[start2 + i];
  }

  var cursor1 = start1 + length1 - 1;
  var cursor2 = length2 - 1;
  var dest = start2 + length2 - 1;
  var customCursor = 0;
  var customDest = 0;

  array[dest--] = array[cursor1--];

  if (--length1 === 0) {
    customCursor = dest - (length2 - 1);

    for (i = 0; i < length2; i++) {
      array[customCursor + i] = tmp[i];
    }

    return;
  }

  if (length2 === 1) {
    dest -= length1;
    cursor1 -= length1;
    customDest = dest + 1;
    customCursor = cursor1 + 1;

    for (i = length1 - 1; i >= 0; i--) {
      array[customDest + i] = array[customCursor + i];
    }

    array[dest] = tmp[cursor2];
    return;
  }

  var minGallop = this.minGallop;

  while (true) {
    var count1 = 0;
    var count2 = 0;
    var exit = false;

    do {
      if (compare(tmp[cursor2], array[cursor1]) < 0) {
        array[dest--] = array[cursor1--];
        count1++;
        count2 = 0;
        if (--length1 === 0) {
          exit = true;
          break;
        }

      } else {
        array[dest--] = tmp[cursor2--];
        count2++;
        count1 = 0;
        if (--length2 === 1) {
          exit = true;
          break;
        }
      }

    } while ((count1 | count2) < minGallop);

    if (exit) {
      break;
    }

    do {
      count1 = length1 - gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare);

      if (count1 !== 0) {
        dest -= count1;
        cursor1 -= count1;
        length1 -= count1;
        customDest = dest + 1;
        customCursor = cursor1 + 1;

        for (i = count1 - 1; i >= 0; i--) {
          array[customDest + i] = array[customCursor + i];
        }

        if (length1 === 0) {
          exit = true;
          break;
        }
      }

      array[dest--] = tmp[cursor2--];

      if (--length2 === 1) {
        exit = true;
        break;
      }

      count2 = length2 - gallopLeft(array[cursor1], tmp, 0, length2, length2 - 1, compare);

      if (count2 !== 0) {
        dest -= count2;
        cursor2 -= count2;
        length2 -= count2;
        customDest = dest + 1;
        customCursor = cursor2 + 1;

        for (i = 0; i < count2; i++) {
          array[customDest + i] = tmp[customCursor + i];
        }

        if (length2 <= 1) {
          exit = true;
          break;
        }
      }

      array[dest--] = array[cursor1--];

      if (--length1 === 0) {
        exit = true;
        break;
      }

      minGallop--;

    } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);

    if (exit) {
      break;
    }

    if (minGallop < 0) {
      minGallop = 0;
    }

    minGallop += 2;
  }

  this.minGallop = minGallop;

  if (minGallop < 1) {
    this.minGallop = 1;
  }

  if (length2 === 1) {
    dest -= length1;
    cursor1 -= length1;
    customDest = dest + 1;
    customCursor = cursor1 + 1;

    for (i = length1 - 1; i >= 0; i--) {
      array[customDest + i] = array[customCursor + i];
    }

    array[dest] = tmp[cursor2];

  } else if (length2 === 0) {
    throw new Error('mergeHigh preconditions were not respected');

  } else {
    customCursor = dest - (length2 - 1);
    for (i = 0; i < length2; i++) {
      array[customCursor + i] = tmp[i];
    }
  }
};

/**
 * Sort an array in the range [lo, hi) using TimSort.
 *
 * @param {array} array - The array to sort.
 * @param {number} lo - First element in the range (inclusive).
 * @param {number} hi - Last element in the range.
 * @param {function=} compare - Item comparison function. Default is alphabetical.
 */
var sort = function (array, lo, hi, compare) {
  if (!Array.isArray(array)) {
    throw new TypeError('Can only sort arrays');
  }

  /*
   * Handle the case where a comparison function is not provided. We do
   * lexicographic sorting
   */

  if (lo === undefined) {
    lo = 0;
  }

  if (hi === undefined) {
    hi = array.length;
  }

  if (compare === undefined) {
    compare = alphabeticalCompare;
  }

  var remaining = hi - lo;

  // The array is already sorted
  if (remaining < 2) {
    return;
  }

  var runLength = 0;
  // On small arrays binary sort can be used directly
  if (remaining < DEFAULT_MIN_MERGE) {
    runLength = makeAscendingRun(array, lo, hi, compare);
    binaryInsertionSort(array, lo, hi, lo + runLength, compare);
    return;
  }

  var ts = new TimSort(array, compare);

  var minRun = minRunLength(remaining);

  do {
    runLength = makeAscendingRun(array, lo, hi, compare);
    if (runLength < minRun) {
      var force = remaining;
      if (force > minRun) {
        force = minRun;
      }

      binaryInsertionSort(array, lo, lo + force, lo + runLength, compare);
      runLength = force;
    }
    // Push new run and merge if necessary
    ts.pushRun(lo, runLength);
    ts.mergeRuns();

    // Go find next run
    remaining -= runLength;
    lo += runLength;

  } while (remaining !== 0);

  // Force merging of remaining runs
  ts.forceMergeRuns();
};

var FixedArray = function FixedArray(size) {
  this._count = 0;
  this._data = new Array(size);
};

var prototypeAccessors$6 = { length: { configurable: true },data: { configurable: true } };

FixedArray.prototype._resize = function _resize (size) {
    var this$1 = this;

  if (size > this._data.length) {
    for (var i = this._data.length; i < size; ++i) {
      this$1._data[i] = undefined;
    }
  }
};

prototypeAccessors$6.length.get = function () {
  return this._count;
};

prototypeAccessors$6.data.get = function () {
  return this._data;
};

FixedArray.prototype.reset = function reset () {
    var this$1 = this;

  for (var i = 0; i < this._count; ++i) {
    this$1._data[i] = undefined;
  }

  this._count = 0;
};

FixedArray.prototype.push = function push (val) {
  if (this._count >= this._data.length) {
    this._resize(this._data.length * 2);
  }

  this._data[this._count] = val;
  ++this._count;
};

FixedArray.prototype.pop = function pop () {
  --this._count;

  if (this._count < 0) {
    this._count = 0;
  }

  var ret = this._data[this._count];
  this._data[this._count] = undefined;

  return ret;
};

FixedArray.prototype.fastRemove = function fastRemove (idx) {
  if (idx >= this._count) {
    return;
  }

  var last = this._count - 1;
  this._data[idx] = this._data[last];
  this._data[last] = undefined;
  this._count -= 1;
};

FixedArray.prototype.indexOf = function indexOf (val) {
  var idx = this._data.indexOf(val);
  if (idx >= this._count) {
    return -1;
  }

  return idx;
};

FixedArray.prototype.sort = function sort$1 (cmp) {
  return sort(this._data, 0, this._count, cmp);
};

Object.defineProperties( FixedArray.prototype, prototypeAccessors$6 );

var Pool = function Pool(fn, size) {
  var this$1 = this;

  this._fn = fn;
  this._idx = size - 1;
  this._frees = new Array(size);

  for (var i = 0; i < size; ++i) {
    this$1._frees[i] = fn();
  }
};

Pool.prototype._expand = function _expand (size) {
    var this$1 = this;

  var old = this._frees;
  this._frees = new Array(size);

  var len = size - old.length;
  for (var i = 0; i < len; ++i) {
    this$1._frees[i] = this$1._fn();
  }

  for (var i$1 = len, j = 0; i$1 < size; ++i$1, ++j) {
    this$1._frees[i$1] = old[j];
  }

  this._idx += len;
};

Pool.prototype.alloc = function alloc () {
  // create some more space (expand by 20%, minimum 1)
  if (this._idx < 0) {
    this._expand(Math.round(this._frees.length * 1.2) + 1);
  }

  var ret = this._frees[this._idx];
  this._frees[this._idx] = null;
  --this._idx;

  return ret;
};

Pool.prototype.free = function free (obj) {
  ++this._idx;
  this._frees[this._idx] = obj;
};

// NOTE: you must have `_prev` and `_next` field in the object returns by `fn`

var LinkedArray = function LinkedArray(fn, size) {
  this._fn = fn;
  this._count = 0;
  this._head = null;
  this._tail = null;

  this._pool = new Pool(fn, size);
};

var prototypeAccessors$7 = { head: { configurable: true },tail: { configurable: true },length: { configurable: true } };

prototypeAccessors$7.head.get = function () {
  return this._head;
};

prototypeAccessors$7.tail.get = function () {
  return this._tail;
};

prototypeAccessors$7.length.get = function () {
  return this._count;
};

LinkedArray.prototype.add = function add () {
  var node = this._pool.alloc();

  if (!this._tail) {
    this._head = node;
  } else {
    this._tail._next = node;
    node._prev = this._tail;
  }
  this._tail = node;
  this._count += 1;

  return node;
};

LinkedArray.prototype.remove = function remove (node) {
  if (node._prev) {
    node._prev._next = node._next;
  } else {
    this._head = node._next;
  }

  if (node._next) {
    node._next._prev = node._prev;
  } else {
    this._tail = node._prev;
  }

  node._next = null;
  node._prev = null;
  this._pool.free(node);
  this._count -= 1;
};

LinkedArray.prototype.forEach = function forEach (fn, binder) {
    var this$1 = this;

  var cursor = this._head;
  if (!cursor) {
    return;
  }

  if (binder) {
    fn = fn.bind(binder);
  }

  var idx = 0;
  var next = cursor;

  while (cursor) {
    next = cursor._next;
    fn(cursor, idx, this$1);

    cursor = next;
    ++idx;
  }
};

Object.defineProperties( LinkedArray.prototype, prototypeAccessors$7 );

var RecyclePool = function RecyclePool(fn, size) {
  var this$1 = this;

  this._fn = fn;
  this._count = 0;
  this._data = new Array(size);

  for (var i = 0; i < size; ++i) {
    this$1._data[i] = fn();
  }
};

var prototypeAccessors$8 = { length: { configurable: true },data: { configurable: true } };

prototypeAccessors$8.length.get = function () {
  return this._count;
};

prototypeAccessors$8.data.get = function () {
  return this._data;
};

RecyclePool.prototype.reset = function reset () {
  this._count = 0;
};

RecyclePool.prototype.resize = function resize (size) {
    var this$1 = this;

  if (size > this._data.length) {
    for (var i = this._data.length; i < size; ++i) {
      this$1._data[i] = this$1._fn();
    }
  }
};

RecyclePool.prototype.add = function add () {
  if (this._count >= this._data.length) {
    this.resize(this._data.length * 2);
  }

  return this._data[this._count++];
};

RecyclePool.prototype.remove = function remove (idx) {
  if (idx >= this._count) {
    return;
  }

  var last = this._count - 1;
  var tmp = this._data[idx];
  this._data[idx] = this._data[last];
  this._data[last] = tmp;
  this._count -= 1;
};

RecyclePool.prototype.sort = function sort$1 (cmp) {
  return sort(this._data, 0, this._count, cmp);
};

Object.defineProperties( RecyclePool.prototype, prototypeAccessors$8 );

var _bufferPools = Array(8);
for (var i = 0; i < 8; ++i) {
  _bufferPools[i] = [];
}

function _nextPow16(v) {
  for (var i = 16; i <= (1 << 28); i *= 16) {
    if (v <= i) {
      return i;
    }
  }
  return 0;
}

function _log2(v) {
  var r, shift;
  r = (v > 0xFFFF) << 4; v >>>= r;
  shift = (v > 0xFF) << 3; v >>>= shift; r |= shift;
  shift = (v > 0xF) << 2; v >>>= shift; r |= shift;
  shift = (v > 0x3) << 1; v >>>= shift; r |= shift;
  return r | (v >> 1);
}

function _alloc(n) {
  var sz = _nextPow16(n);
  var bin = _bufferPools[_log2(sz) >> 2];
  if (bin.length > 0) {
    return bin.pop();
  }
  return new ArrayBuffer(sz);
}

function _free(buf) {
  _bufferPools[_log2(buf.byteLength) >> 2].push(buf);
}

var typedArrayPool = {
  alloc_int8: function alloc_int8(n) {
    var result = new Int8Array(_alloc(n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_uint8: function alloc_uint8(n) {
    var result = new Uint8Array(_alloc(n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_int16: function alloc_int16(n) {
    var result = new Int16Array(_alloc(2 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_uint16: function alloc_uint16(n) {
    var result = new Uint16Array(_alloc(2 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_int32: function alloc_int32(n) {
    var result = new Int32Array(_alloc(4 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_uint32: function alloc_uint32(n) {
    var result = new Uint32Array(_alloc(4 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_float32: function alloc_float32(n) {
    var result = new Float32Array(_alloc(4 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_float64: function alloc_float64(n) {
    var result = new Float64Array(_alloc(8 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_dataview: function alloc_dataview(n) {
    var result = new DataView(_alloc(n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  free: function free(array) {
    _free(array.buffer);
  },

  reset: function reset() {
    var _bufferPools = Array(8);
    for (var i = 0; i < 8; ++i) {
      _bufferPools[i] = [];
    }
  },
};



var memop = Object.freeze({
	CircularPool: CircularPool,
	FixedArray: FixedArray,
	LinkedArray: LinkedArray,
	Pool: Pool,
	RecyclePool: RecyclePool,
	TypedArrayPool: typedArrayPool
});

var Scene = function Scene() {
  this._lights = new FixedArray(16);
  this._models = new FixedArray(16);
  this._cameras = new FixedArray(16);
  this._debugCamera = null;

  // NOTE: we don't use pool for views (because it's less changed and it doesn't have poolID)
  this._views = [];
};

Scene.prototype._add = function _add (pool, item) {
  if (item._poolID !== -1) {
    return;
  }

  pool.push(item);
  item._poolID = pool.length - 1;
};

Scene.prototype._remove = function _remove (pool, item) {
  if (item._poolID === -1) {
    return;
  }

  pool.data[pool.length-1]._poolID = item._poolID;
  pool.fastRemove(item._poolID);
  item._poolID = -1;
};

Scene.prototype.reset = function reset () {
    var this$1 = this;

  for (var i = 0; i < this._models.length; ++i) {
    var model = this$1._models.data[i];
    model._viewID = -1;
  }
};

Scene.prototype.setDebugCamera = function setDebugCamera (cam) {
  this._debugCamera = cam;
};

// camera

Scene.prototype.getCameraCount = function getCameraCount () {
  return this._cameras.length;
};

Scene.prototype.getCamera = function getCamera (idx) {
  return this._cameras.data[idx];
};

Scene.prototype.addCamera = function addCamera (camera) {
  this._add(this._cameras, camera);
};

Scene.prototype.removeCamera = function removeCamera (camera) {
  this._remove(this._cameras, camera);
};

// model

Scene.prototype.getModelCount = function getModelCount () {
  return this._models.length;
};

Scene.prototype.getModel = function getModel (idx) {
  return this._models.data[idx];
};

Scene.prototype.addModel = function addModel (model) {
  this._add(this._models, model);
};

Scene.prototype.removeModel = function removeModel (model) {
  this._remove(this._models, model);
};

// light

Scene.prototype.getLightCount = function getLightCount () {
  return this._lights.length;
};

Scene.prototype.getLight = function getLight (idx) {
  return this._lights.data[idx];
};

Scene.prototype.addLight = function addLight (light) {
  this._add(this._lights, light);
};

Scene.prototype.removeLight = function removeLight (light) {
  this._remove(this._lights, light);
};

// view

Scene.prototype.addView = function addView (view) {
  if (this._views.indexOf(view) === -1) {
    this._views.push(view);
  }
};

Scene.prototype.removeView = function removeView (view) {
  var idx = this._views.indexOf(view);
  if (idx !== -1) {
    this._views.splice(idx, 1);
  }
};

/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

var mustache = {};

var objectToString = Object.prototype.toString;
var isArray = Array.isArray || function isArrayPolyfill(object) {
  return objectToString.call(object) === '[object Array]';
};

function isFunction(object) {
  return typeof object === 'function';
}

/**
 * More correct typeof string handling array
 * which normally returns typeof 'object'
 */
function typeStr(obj) {
  return isArray(obj) ? 'array' : typeof obj;
}

function escapeRegExp(string) {
  return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
}

/**
 * Null safe way of checking whether or not an object,
 * including its prototype, has a given property
 */
function hasProperty(obj, propName) {
  return obj != null && typeof obj === 'object' && (propName in obj);
}

// Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
// See https://github.com/janl/mustache.js/issues/189
var regExpTest = RegExp.prototype.test;
function testRegExp(re, string) {
  return regExpTest.call(re, string);
}

var nonSpaceRe = /\S/;
function isWhitespace(string) {
  return !testRegExp(nonSpaceRe, string);
}

var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml(string) {
  return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
    return entityMap[s];
  });
}

var whiteRe = /\s*/;
var spaceRe = /\s+/;
var equalsRe = /\s*=/;
var curlyRe = /\s*\}/;
var tagRe = /#|\^|\/|>|\{|&|=|!/;

/**
 * Breaks up the given `template` string into a tree of tokens. If the `tags`
 * argument is given here it must be an array with two string values: the
 * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
 * course, the default is to use mustaches (i.e. mustache.tags).
 *
 * A token is an array with at least 4 elements. The first element is the
 * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
 * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
 * all text that appears outside a symbol this element is "text".
 *
 * The second element of a token is its "value". For mustache tags this is
 * whatever else was inside the tag besides the opening symbol. For text tokens
 * this is the text itself.
 *
 * The third and fourth elements of the token are the start and end indices,
 * respectively, of the token in the original template.
 *
 * Tokens that are the root node of a subtree contain two more elements: 1) an
 * array of tokens in the subtree and 2) the index in the original template at
 * which the closing tag for that section begins.
 */
function parseTemplate(template, tags) {
  if (!template)
    { return []; }

  var sections = [];     // Stack to hold section tokens
  var tokens = [];       // Buffer to hold the tokens
  var spaces = [];       // Indices of whitespace tokens on the current line
  var hasTag = false;    // Is there a {{tag}} on the current line?
  var nonSpace = false;  // Is there a non-space char on the current line?

  // Strips all whitespace tokens array for the current line
  // if there was a {{#tag}} on it and otherwise only space.
  function stripSpace() {
    if (hasTag && !nonSpace) {
      while (spaces.length)
        { delete tokens[spaces.pop()]; }
    } else {
      spaces = [];
    }

    hasTag = false;
    nonSpace = false;
  }

  var openingTagRe, closingTagRe, closingCurlyRe;
  function compileTags(tagsToCompile) {
    if (typeof tagsToCompile === 'string')
      { tagsToCompile = tagsToCompile.split(spaceRe, 2); }

    if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
      { throw new Error('Invalid tags: ' + tagsToCompile); }

    openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
    closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
    closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
  }

  compileTags(tags || mustache.tags);

  var scanner = new Scanner(template);

  var start, type, value, chr, token, openSection;
  while (!scanner.eos()) {
    start = scanner.pos;

    // Match any text between tags.
    value = scanner.scanUntil(openingTagRe);

    if (value) {
      for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
        chr = value.charAt(i);

        if (isWhitespace(chr)) {
          spaces.push(tokens.length);
        } else {
          nonSpace = true;
        }

        tokens.push(['text', chr, start, start + 1]);
        start += 1;

        // Check for whitespace on the current line.
        if (chr === '\n')
          { stripSpace(); }
      }
    }

    // Match the opening tag.
    if (!scanner.scan(openingTagRe))
      { break; }

    hasTag = true;

    // Get the tag type.
    type = scanner.scan(tagRe) || 'name';
    scanner.scan(whiteRe);

    // Get the tag value.
    if (type === '=') {
      value = scanner.scanUntil(equalsRe);
      scanner.scan(equalsRe);
      scanner.scanUntil(closingTagRe);
    } else if (type === '{') {
      value = scanner.scanUntil(closingCurlyRe);
      scanner.scan(curlyRe);
      scanner.scanUntil(closingTagRe);
      type = '&';
    } else {
      value = scanner.scanUntil(closingTagRe);
    }

    // Match the closing tag.
    if (!scanner.scan(closingTagRe))
      { throw new Error('Unclosed tag at ' + scanner.pos); }

    token = [type, value, start, scanner.pos];
    tokens.push(token);

    if (type === '#' || type === '^') {
      sections.push(token);
    } else if (type === '/') {
      // Check section nesting.
      openSection = sections.pop();

      if (!openSection)
        { throw new Error('Unopened section "' + value + '" at ' + start); }

      if (openSection[1] !== value)
        { throw new Error('Unclosed section "' + openSection[1] + '" at ' + start); }
    } else if (type === 'name' || type === '{' || type === '&') {
      nonSpace = true;
    } else if (type === '=') {
      // Set the tags for the next time around.
      compileTags(value);
    }
  }

  // Make sure there are no open sections when we're done.
  openSection = sections.pop();

  if (openSection)
    { throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos); }

  return nestTokens(squashTokens(tokens));
}

/**
 * Combines the values of consecutive text tokens in the given `tokens` array
 * to a single token.
 */
function squashTokens(tokens) {
  var squashedTokens = [];

  var token, lastToken;
  for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
    token = tokens[i];

    if (token) {
      if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
        lastToken[1] += token[1];
        lastToken[3] = token[3];
      } else {
        squashedTokens.push(token);
        lastToken = token;
      }
    }
  }

  return squashedTokens;
}

/**
 * Forms the given array of `tokens` into a nested tree structure where
 * tokens that represent a section have two additional items: 1) an array of
 * all tokens that appear in that section and 2) the index in the original
 * template that represents the end of that section.
 */
function nestTokens(tokens) {
  var nestedTokens = [];
  var collector = nestedTokens;
  var sections = [];

  var token, section;
  for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
    token = tokens[i];

    switch (token[0]) {
      case '#':
      case '^':
        collector.push(token);
        sections.push(token);
        collector = token[4] = [];
        break;
      case '/':
        section = sections.pop();
        section[5] = token[2];
        collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
        break;
      default:
        collector.push(token);
    }
  }

  return nestedTokens;
}

/**
 * A simple string scanner that is used by the template parser to find
 * tokens in template strings.
 */
function Scanner(string) {
  this.string = string;
  this.tail = string;
  this.pos = 0;
}

/**
 * Returns `true` if the tail is empty (end of string).
 */
Scanner.prototype.eos = function eos() {
  return this.tail === '';
};

/**
 * Tries to match the given regular expression at the current position.
 * Returns the matched text if it can match, the empty string otherwise.
 */
Scanner.prototype.scan = function scan(re) {
  var match = this.tail.match(re);

  if (!match || match.index !== 0)
    { return ''; }

  var string = match[0];

  this.tail = this.tail.substring(string.length);
  this.pos += string.length;

  return string;
};

/**
 * Skips all text until the given regular expression can be matched. Returns
 * the skipped string, which is the entire tail if no match can be made.
 */
Scanner.prototype.scanUntil = function scanUntil(re) {
  var index = this.tail.search(re), match;

  switch (index) {
    case -1:
      match = this.tail;
      this.tail = '';
      break;
    case 0:
      match = '';
      break;
    default:
      match = this.tail.substring(0, index);
      this.tail = this.tail.substring(index);
  }

  this.pos += match.length;

  return match;
};

/**
 * Represents a rendering context by wrapping a view object and
 * maintaining a reference to the parent context.
 */
function Context(view, parentContext) {
  this.view = view;
  this.cache = { '.': this.view };
  this.parent = parentContext;
}

/**
 * Creates a new context using the given view with this context
 * as the parent.
 */
Context.prototype.push = function push(view) {
  return new Context(view, this);
};

/**
 * Returns the value of the given name in this context, traversing
 * up the context hierarchy if the value is absent in this context's view.
 */
Context.prototype.lookup = function lookup(name) {
  var cache = this.cache;

  var value;
  if (cache.hasOwnProperty(name)) {
    value = cache[name];
  } else {
    var context = this, names, index, lookupHit = false;

    while (context) {
      if (name.indexOf('.') > 0) {
        value = context.view;
        names = name.split('.');
        index = 0;

        /**
         * Using the dot notion path in `name`, we descend through the
         * nested objects.
         *
         * To be certain that the lookup has been successful, we have to
         * check if the last object in the path actually has the property
         * we are looking for. We store the result in `lookupHit`.
         *
         * This is specially necessary for when the value has been set to
         * `undefined` and we want to avoid looking up parent contexts.
         **/
        while (value != null && index < names.length) {
          if (index === names.length - 1)
            { lookupHit = hasProperty(value, names[index]); }

          value = value[names[index++]];
        }
      } else {
        value = context.view[name];
        lookupHit = hasProperty(context.view, name);
      }

      if (lookupHit)
        { break; }

      context = context.parent;
    }

    cache[name] = value;
  }

  if (isFunction(value))
    { value = value.call(this.view); }

  return value;
};

/**
 * A Writer knows how to take a stream of tokens and render them to a
 * string, given a context. It also maintains a cache of templates to
 * avoid the need to parse the same template twice.
 */
function Writer() {
  this.cache = {};
}

/**
 * Clears all cached templates in this writer.
 */
Writer.prototype.clearCache = function clearCache() {
  this.cache = {};
};

/**
 * Parses and caches the given `template` and returns the array of tokens
 * that is generated from the parse.
 */
Writer.prototype.parse = function parse(template, tags) {
  var cache = this.cache;
  var tokens = cache[template];

  if (tokens == null)
    { tokens = cache[template] = parseTemplate(template, tags); }

  return tokens;
};

/**
 * High-level method that is used to render the given `template` with
 * the given `view`.
 *
 * The optional `partials` argument may be an object that contains the
 * names and templates of partials that are used in the template. It may
 * also be a function that is used to load partial templates on the fly
 * that takes a single argument: the name of the partial.
 */
Writer.prototype.render = function render(template, view, partials) {
  var tokens = this.parse(template);
  var context = (view instanceof Context) ? view : new Context(view);
  return this.renderTokens(tokens, context, partials, template);
};

/**
 * Low-level method that renders the given array of `tokens` using
 * the given `context` and `partials`.
 *
 * Note: The `originalTemplate` is only ever used to extract the portion
 * of the original template that was contained in a higher-order section.
 * If the template doesn't use higher-order sections, this argument may
 * be omitted.
 */
Writer.prototype.renderTokens = function renderTokens(tokens, context, partials, originalTemplate) {
  var this$1 = this;

  var buffer = '';

  var token, symbol, value;
  for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
    value = undefined;
    token = tokens[i];
    symbol = token[0];

    if (symbol === '#') { value = this$1.renderSection(token, context, partials, originalTemplate); }
    else if (symbol === '^') { value = this$1.renderInverted(token, context, partials, originalTemplate); }
    else if (symbol === '>') { value = this$1.renderPartial(token, context, partials, originalTemplate); }
    else if (symbol === '&') { value = this$1.unescapedValue(token, context); }
    else if (symbol === 'name') { value = this$1.escapedValue(token, context); }
    else if (symbol === 'text') { value = this$1.rawValue(token); }

    if (value !== undefined)
      { buffer += value; }
  }

  return buffer;
};

Writer.prototype.renderSection = function renderSection(token, context, partials, originalTemplate) {
  var this$1 = this;

  var self = this;
  var buffer = '';
  var value = context.lookup(token[1]);

  // This function is used to render an arbitrary template
  // in the current context by higher-order sections.
  function subRender(template) {
    return self.render(template, context, partials);
  }

  if (!value) { return; }

  if (isArray(value)) {
    for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
      buffer += this$1.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
    }
  } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
    buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
  } else if (isFunction(value)) {
    if (typeof originalTemplate !== 'string')
      { throw new Error('Cannot use higher-order sections without the original template'); }

    // Extract the portion of the original template that the section contains.
    value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

    if (value != null)
      { buffer += value; }
  } else {
    buffer += this.renderTokens(token[4], context, partials, originalTemplate);
  }
  return buffer;
};

Writer.prototype.renderInverted = function renderInverted(token, context, partials, originalTemplate) {
  var value = context.lookup(token[1]);

  // Use JavaScript's definition of falsy. Include empty arrays.
  // See https://github.com/janl/mustache.js/issues/186
  if (!value || (isArray(value) && value.length === 0))
    { return this.renderTokens(token[4], context, partials, originalTemplate); }
};

Writer.prototype.renderPartial = function renderPartial(token, context, partials) {
  if (!partials) { return; }

  var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
  if (value != null)
    { return this.renderTokens(this.parse(value), context, partials, value); }
};

Writer.prototype.unescapedValue = function unescapedValue(token, context) {
  var value = context.lookup(token[1]);
  if (value != null)
    { return value; }
};

Writer.prototype.escapedValue = function escapedValue(token, context) {
  var value = context.lookup(token[1]);
  if (value != null)
    { return mustache.escape(value); }
};

Writer.prototype.rawValue = function rawValue(token) {
  return token[1];
};

mustache.name = 'mustache.js';
mustache.version = '2.3.0';
mustache.tags = ['{{', '}}'];

// All high-level mustache.* functions use this writer.
var defaultWriter = new Writer();

/**
 * Clears all cached templates in the default writer.
 */
mustache.clearCache = function clearCache() {
  return defaultWriter.clearCache();
};

/**
 * Parses and caches the given template in the default writer and returns the
 * array of tokens it contains. Doing this ahead of time avoids the need to
 * parse templates on the fly as they are rendered.
 */
mustache.parse = function parse(template, tags) {
  return defaultWriter.parse(template, tags);
};

/**
 * Renders the `template` with the given `view` and `partials` using the
 * default writer.
 */
mustache.render = function render(template, view, partials) {
  if (typeof template !== 'string') {
    throw new TypeError('Invalid template! Template should be a "string" ' +
      'but "' + typeStr(template) + '" was given as the first ' +
      'argument for mustache#render(template, view, partials)');
  }

  return defaultWriter.render(template, view, partials);
};

// This is here for backwards compatibility with 0.4.x.,
/*eslint-disable */ // eslint wants camel cased function name
mustache.to_html = function to_html(template, view, partials, send) {
  /*eslint-enable*/

  var result = mustache.render(template, view, partials);

  if (isFunction(send)) {
    send(result);
  } else {
    return result;
  }
};

// Export the escaping function so that the user may override it.
// See https://github.com/janl/mustache.js/issues/244
mustache.escape = escapeHtml;

// Export these mainly for testing, but also for advanced usage.
mustache.Scanner = Scanner;
mustache.Context = Context;
mustache.Writer = Writer;

var builtinChunks = {
  'skinning.vert': 'attribute vec4 a_weights;\nattribute vec4 a_joints;\nuniform sampler2D u_jointsTexture;\nuniform float u_jointsTextureSize;\nmat4 getBoneMatrix(const in float i) {\n  float size = u_jointsTextureSize;\n  float j = i * 4.0;\n  float x = mod(j, size);\n  float y = floor(j / size);\n  float dx = 1.0 / size;\n  float dy = 1.0 / size;\n  y = dy * (y + 0.5);\n  vec4 v1 = texture2D(u_jointsTexture, vec2(dx * (x + 0.5), y));\n  vec4 v2 = texture2D(u_jointsTexture, vec2(dx * (x + 1.5), y));\n  vec4 v3 = texture2D(u_jointsTexture, vec2(dx * (x + 2.5), y));\n  vec4 v4 = texture2D(u_jointsTexture, vec2(dx * (x + 3.5), y));\n  return mat4(v1, v2, v3, v4);\n}\nmat4 skinMatrix() {\n  return\n    getBoneMatrix(a_joints.x) * a_weights.x +\n    getBoneMatrix(a_joints.y) * a_weights.y +\n    getBoneMatrix(a_joints.z) * a_weights.z +\n    getBoneMatrix(a_joints.w) * a_weights.w\n    ;\n}',
  'unpack-normal.frag': 'vec3 unpackNormal(vec4 nmap) {\n  return nmap.xyz * 2.0 - 1.0;\n}',
};

var builtinTemplates = [
  {
    name: 'simple',
    vert: '\nattribute vec3 a_position;\nuniform mat4 model;\nuniform mat4 viewProj;\n{{#useTexture}}\n  attribute vec2 a_uv0;\n  varying vec2 uv0;\n{{/useTexture}}\nvoid main () {\n  vec4 pos = viewProj * model * vec4(a_position, 1);\n  {{#useTexture}}\n    uv0 = a_uv0;\n  {{/useTexture}}\n  gl_Position = pos;\n}',
    frag: '\n{{#useTexture}}\n  uniform sampler2D texture;\n  varying vec2 uv0;\n{{/useTexture}}\n{{#useColor}}\n  uniform vec4 color;\n{{/useColor}}\nvoid main () {\n  vec4 o = vec4(1, 1, 1, 1);\n  {{#useTexture}}\n    o *= texture2D(texture, uv0);\n  {{/useTexture}}\n  {{#useColor}}\n    o *= color;\n  {{/useColor}}\n  if (!gl_FrontFacing) {\n    o.rgb *= 0.5;\n  }\n  gl_FragColor = o;\n}',
    options: [
      { name: 'useTexture', },
      { name: 'useColor', } ],
  } ];

var _shdID = 0;

var ProgramLib = function ProgramLib(device, templates, chunks) {
  var this$1 = this;
  if ( templates === void 0 ) templates = [];
  if ( chunks === void 0 ) chunks = {};

  this._device = device;
  this._precision = "precision highp float;\n";

  // register templates
  this._templates = {};
  for (var i = 0; i < builtinTemplates.length; ++i) {
    var tmpl = builtinTemplates[i];
    this$1.define(tmpl.name, tmpl.vert, tmpl.frag, tmpl.options);
  }
  for (var i$1 = 0; i$1 < templates.length; ++i$1) {
    var tmpl$1 = templates[i$1];
    this$1.define(tmpl$1.name, tmpl$1.vert, tmpl$1.frag, tmpl$1.options);
  }

  // register chunks
  this._chunks = {};
  Object.assign(this._chunks, builtinChunks);
  Object.assign(this._chunks, chunks);

  this._cache = {};
};

/**
 * @param {string} name
 * @param {string} template
 * @param {Array} options
 *
 * @example:
 * programLib.define('foobar', vertTmpl, fragTmpl, [
 *   { name: 'shadow' },
 *   { name: 'lightCount', min: 1, max: 4 }
 * ]);
 */
ProgramLib.prototype.define = function define (name, vert, frag, options) {
  if (this._templates[name]) {
    console.warn(("Failed to define shader " + name + ": already exists."));
    return;
  }

  var id = ++_shdID;

  // calculate option mask offset
  var offset = 0;
  var loop = function ( i ) {
    var op = options[i];
    op._offset = offset;

    var cnt = 1;

    if (op.min !== undefined && op.max !== undefined) {
      cnt = Math.ceil((op.max - op.min) * 0.5);

      op._map = function (value) {
        return (value - this._min) << op._offset;
      }.bind(op);
    } else {
      op._map = function (value) {
        if (value) {
          return 1 << op._offset;
        }
        return 0;
      }.bind(op);
    }

    offset += cnt;

    op._offset = offset;
  };

    for (var i = 0; i < options.length; ++i) loop( i );

  vert = this._precision + vert;
  frag = this._precision + frag;

  // pre-parse the vs and fs template to speed up `mustache.render()` method
  mustache.parse(vert);
  mustache.parse(frag);

  // store it
  this._templates[name] = {
    id: id,
    name: name,
    vert: vert,
    frag: frag,
    options: options
  };
};

/**
 * @param {string} name
 * @param {Object} options
 */
ProgramLib.prototype.getKey = function getKey (name, options) {
  var tmpl = this._templates[name];
  var key = 0;
  for (var i = 0; i < tmpl.options.length; ++i) {
    var tmplOpts = tmpl.options[i];
    var value = options[tmplOpts.name];
    if (value === undefined) {
      continue;
    }

    key |= tmplOpts._map(value);
  }

  return key << 8 | tmpl.id;
};

/**
 * @param {string} name
 * @param {Object} options
 */
ProgramLib.prototype.getProgram = function getProgram (name, options) {
  var key = this.getKey(name, options);
  var program = this._cache[key];
  if (program) {
    return program;
  }

  // get template
  var tmpl = this._templates[name];
  var vert = mustache.render(tmpl.vert, options, this._chunks);
  var frag = mustache.render(tmpl.frag, options, this._chunks);

  program = new gfx.Program(this._device, {
    vert: vert,
    frag: frag
  });
  program.link();
  this._cache[key] = program;

  return program;
};

var _m3_tmp$1 = mat3.create();
var _m4_tmp$2 = mat4.create();

var _stageInfos = new RecyclePool(function () {
  return {
    stage: null,
    items: null,
  };
}, 8);

var _float2_pool = new RecyclePool(function () {
  return new Float32Array(2);
}, 8);

var _float3_pool = new RecyclePool(function () {
  return new Float32Array(3);
}, 8);

var _float4_pool = new RecyclePool(function () {
  return new Float32Array(4);
}, 8);

var _float9_pool = new RecyclePool(function () {
  return new Float32Array(9);
}, 8);

var _float16_pool = new RecyclePool(function () {
  return new Float32Array(16);
}, 8);

var _float64_pool = new RecyclePool(function () {
  return new Float32Array(64);
}, 8);

var _int2_pool = new RecyclePool(function () {
  return new Int32Array(2);
}, 8);

var _int3_pool = new RecyclePool(function () {
  return new Int32Array(3);
}, 8);

var _int4_pool = new RecyclePool(function () {
  return new Int32Array(4);
}, 8);

var _int64_pool = new RecyclePool(function () {
  return new Int32Array(64);
}, 8);

var _type2uniformValue = {};
_type2uniformValue[enums$1.PARAM_INT] = function (value) {
    return value;
  };
_type2uniformValue[enums$1.PARAM_INT2] = function (value) {
    return vec2.array(_int2_pool.add(), value);
  };
_type2uniformValue[enums$1.PARAM_INT3] = function (value) {
    return vec3.array(_int3_pool.add(), value);
  };
_type2uniformValue[enums$1.PARAM_INT4] = function (value) {
    return vec4.array(_int4_pool.add(), value);
  };
_type2uniformValue[enums$1.PARAM_FLOAT] = function (value) {
    return value;
  };
_type2uniformValue[enums$1.PARAM_FLOAT2] = function (value) {
    return vec2.array(_float2_pool.add(), value);
  };
_type2uniformValue[enums$1.PARAM_FLOAT3] = function (value) {
    return vec3.array(_float3_pool.add(), value);
  };
_type2uniformValue[enums$1.PARAM_FLOAT4] = function (value) {
    return vec4.array(_float4_pool.add(), value);
  };
_type2uniformValue[enums$1.PARAM_COLOR3] = function (value) {
    return color3.array(_float3_pool.add(), value);
  };
_type2uniformValue[enums$1.PARAM_COLOR4] = function (value) {
    return color4.array(_float4_pool.add(), value);
  };
_type2uniformValue[enums$1.PARAM_MAT2] = function (value) {
    return mat2.array(_float4_pool.add(), value);
  };
_type2uniformValue[enums$1.PARAM_MAT3] = function (value) {
    return mat3.array(_float9_pool.add(), value);
  };
_type2uniformValue[enums$1.PARAM_MAT4] = function (value) {
    return mat4.array(_float16_pool.add(), value);
  };

var _type2uniformArrayValue = {};
_type2uniformArrayValue[enums$1.PARAM_INT] = {
    func: function func (values) {
      var result = _int64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        result[i] = values[i];
      }
      return result;
    },
    size: 1,
  };
_type2uniformArrayValue[enums$1.PARAM_INT2] = {
    func: function func (values) {
      var result = _int64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        result[2 * i] = values[i].x;
        result[2 * i + 1] = values[i].y;
      }
      return result;
    },
    size: 2,
  };
_type2uniformArrayValue[enums$1.PARAM_INT3] = {
    func: undefined,
    size: 3,
  };
_type2uniformArrayValue[enums$1.PARAM_INT4] = {
    func: function func (values) {
      var result = _int64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        var v = values[i];
        result[4 * i] = v.x;
        result[4 * i + 1] = v.y;
        result[4 * i + 2] = v.z;
        result[4 * i + 3] = v.w;
      }
      return result;
    },
    size: 4,
  };
_type2uniformArrayValue[enums$1.PARAM_FLOAT] = {
    func: function func (values) {
      var result = _float64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        result[i] = values[i];
      }
      return result;
    },
    size: 1
  };
_type2uniformArrayValue[enums$1.PARAM_FLOAT2] = {
    func: function func (values) {
      var result = _float64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        result[2 * i] = values[i].x;
        result[2 * i + 1] = values[i].y;
      }
      return result;
    },
    size: 2,
  };
_type2uniformArrayValue[enums$1.PARAM_FLOAT3] = {
    func: undefined,
    size: 3,
  };
_type2uniformArrayValue[enums$1.PARAM_FLOAT4] = {
    func: function func (values) {
      var result = _float64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        var v = values[i];
        result[4 * i] = v.x;
        result[4 * i + 1] = v.y;
        result[4 * i + 2] = v.z;
        result[4 * i + 3] = v.w;
      }
      return result;
    },
    size: 4,
  };
_type2uniformArrayValue[enums$1.PARAM_COLOR3] = {
    func: undefined,
    size: 3,
  };
_type2uniformArrayValue[enums$1.PARAM_COLOR4] = {
    func: function func (values) {
      var result = _float64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        var v = values[i];
        result[4 * i] = v.r;
        result[4 * i + 1] = v.g;
        result[4 * i + 2] = v.b;
        result[4 * i + 3] = v.a;
      }
      return result;
    },
    size: 4,
  };
_type2uniformArrayValue[enums$1.PARAM_MAT2] = {
    func: function func (values) {
      var result = _float64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        var v = values[i];
        result[4 * i] = v.m00;
        result[4 * i + 1] = v.m01;
        result[4 * i + 2] = v.m02;
        result[4 * i + 3] = v.m03;
      }
      return result;
    },
    size: 4
  };
_type2uniformArrayValue[enums$1.PARAM_MAT3] = {
    func: undefined,
    size: 9
  };
_type2uniformArrayValue[enums$1.PARAM_MAT4] = {
    func: function func (values) {
      var result = _float64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        var v = values[i];
        result[16 * i] = v.m00;
        result[16 * i + 1] = v.m01;
        result[16 * i + 2] = v.m02;
        result[16 * i + 3] = v.m03;
        result[16 * i + 4] = v.m04;
        result[16 * i + 5] = v.m05;
        result[16 * i + 6] = v.m06;
        result[16 * i + 7] = v.m07;
        result[16 * i + 8] = v.m08;
        result[16 * i + 9] = v.m09;
        result[16 * i + 10] = v.m10;
        result[16 * i + 11] = v.m11;
        result[16 * i + 12] = v.m12;
        result[16 * i + 13] = v.m13;
        result[16 * i + 14] = v.m14;
        result[16 * i + 15] = v.m15;
      }
      return result;
    },
    size: 16
  };

var Base = function Base(device, opts) {
  var obj;

  this._device = device;
  this._programLib = new ProgramLib(device, opts.programTemplates, opts.programChunks);
  this._opts = opts;
  this._type2defaultValue = ( obj = {}, obj[enums$1.PARAM_INT] = 0, obj[enums$1.PARAM_INT2] = vec2.new(0, 0), obj[enums$1.PARAM_INT3] = vec3.new(0, 0, 0), obj[enums$1.PARAM_INT4] = vec4.new(0, 0, 0, 0), obj[enums$1.PARAM_FLOAT] = 0.0, obj[enums$1.PARAM_FLOAT2] = vec2.new(0, 0), obj[enums$1.PARAM_FLOAT3] = vec3.new(0, 0, 0), obj[enums$1.PARAM_FLOAT4] = vec4.new(0, 0, 0, 0), obj[enums$1.PARAM_COLOR3] = color3.new(0, 0, 0), obj[enums$1.PARAM_COLOR4] = color4.new(0, 0, 0, 1), obj[enums$1.PARAM_MAT2] = mat2.create(), obj[enums$1.PARAM_MAT3] = mat3.create(), obj[enums$1.PARAM_MAT4] = mat4.create(), obj[enums$1.PARAM_TEXTURE_2D] = opts.defaultTexture, obj[enums$1.PARAM_TEXTURE_CUBE] = opts.defaultTextureCube, obj );
  this._stage2fn = {};
  this._usedTextureUnits = 0;

  this._viewPools = new RecyclePool(function () {
    return new View();
  }, 8);

  this._drawItemsPools = new RecyclePool(function () {
    return {
      model: null,
      node: null,
      ia: null,
      effect: null,
      options: null,
    };
  }, 100);

  this._stageItemsPools = new RecyclePool(function () {
    return new RecyclePool(function () {
      return {
        model: null,
        node: null,
        ia: null,
        effect: null,
        options: null,
        technique: null,
        sortKey: -1,
      };
    }, 100);
  }, 16);
};

Base.prototype._resetTextuerUnit = function _resetTextuerUnit () {
  this._usedTextureUnits = 0;
};

Base.prototype._allocTextuerUnit = function _allocTextuerUnit () {
  var device = this._device;

  var unit = this._usedTextureUnits;
  if (unit >= device._caps.maxTextureUnits) {
    console.warn(("Trying to use " + unit + " texture units while this GPU supports only " + (device._caps.maxTextureUnits)));
  }

  this._usedTextureUnits += 1;
  return unit;
};

Base.prototype._registerStage = function _registerStage (name, fn) {
  this._stage2fn[name] = fn;
};

Base.prototype._reset = function _reset () {
  this._viewPools.reset();
  this._stageItemsPools.reset();
};

Base.prototype._requestView = function _requestView () {
  return this._viewPools.add();
};

Base.prototype._render = function _render (view, scene) {
    var this$1 = this;

  var device = this._device;

  // setup framebuffer
  device.setFrameBuffer(view._framebuffer);

  // setup viewport
  device.setViewport(
    view._rect.x,
    view._rect.y,
    view._rect.w,
    view._rect.h
  );

  // setup clear
  var clearOpts = {};
  if (view._clearFlags & enums$1.CLEAR_COLOR) {
    clearOpts.color = [
      view._color.r,
      view._color.g,
      view._color.b,
      view._color.a
    ];
  }
  if (view._clearFlags & enums$1.CLEAR_DEPTH) {
    clearOpts.depth = view._depth;
  }
  if (view._clearFlags & enums$1.CLEAR_STENCIL) {
    clearOpts.stencil = view._stencil;
  }
  device.clear(clearOpts);

  // get all draw items
  this._drawItemsPools.reset();

  for (var i = 0; i < scene._models.length; ++i) {
    var model = scene._models.data[i];

    // TODO: HACK: filter model by view
    if (view._cullingByID) {
      if (model._viewID !== view._id) {
        continue;
      }
    } else {
      if (model._viewID !== -1) {
        continue;
      }
    }

    for (var m = 0; m < model.drawItemCount; ++m) {
      var drawItem = this$1._drawItemsPools.add();
      model.extractDrawItem(drawItem, m);
    }
  }

  // TODO: update frustum
  // TODO: visbility test
  // frustum.update(view._viewProj);

  // dispatch draw items to different stage
  _stageInfos.reset();

  for (var i$1 = 0; i$1 < view._stages.length; ++i$1) {
    var stage = view._stages[i$1];
    var stageItems = this$1._stageItemsPools.add();
    stageItems.reset();

    for (var j = 0; j < this._drawItemsPools.length; ++j) {
      var drawItem$1 = this$1._drawItemsPools.data[j];
      var tech = drawItem$1.effect.getTechnique(stage);

      if (tech) {
        var stageItem = stageItems.add();
        stageItem.model = drawItem$1.model;
        stageItem.node = drawItem$1.node;
        stageItem.ia = drawItem$1.ia;
        stageItem.effect = drawItem$1.effect;
        stageItem.options = drawItem$1.options;
        stageItem.technique = tech;
        stageItem.sortKey = -1;
      }
    }

    var stageInfo = _stageInfos.add();
    stageInfo.stage = stage;
    stageInfo.items = stageItems;
  }

  // render stages
  for (var i$2 = 0; i$2 < _stageInfos.length; ++i$2) {
    var info = _stageInfos.data[i$2];
    var fn = this$1._stage2fn[info.stage];

    fn(view, info.items);
  }
};

Base.prototype._draw = function _draw (item) {
    var this$1 = this;

  var device = this._device;
  var programLib = this._programLib;
  var node = item.node;
    var ia = item.ia;
    var effect = item.effect;
    var technique = item.technique;
    var options = item.options;

  // reset the pool
  // NOTE: we can use drawCounter optimize this
  // TODO: should be configurable
  _float2_pool.reset();
  _float3_pool.reset();
  _float4_pool.reset();
  _float9_pool.reset();
  _float16_pool.reset();
  _float64_pool.reset();
  _int2_pool.reset();
  _int3_pool.reset();
  _int4_pool.reset();
  _int64_pool.reset();

  // set common uniforms
  // TODO: try commit this depends on effect
  // {
  node.getWorldMatrix(_m4_tmp$2);
  device.setUniform('model', mat4.array(_float16_pool.add(), _m4_tmp$2));

  mat3.transpose(_m3_tmp$1, mat3.invert(_m3_tmp$1, mat3.fromMat4(_m3_tmp$1, _m4_tmp$2)));
  device.setUniform('normalMatrix', mat3.array(_float9_pool.add(), _m3_tmp$1));
  // }

  // set technique uniforms
  for (var i = 0; i < technique._parameters.length; ++i) {
    var prop = technique._parameters[i];
    var param = effect.getValue(prop.name);

    if (param === undefined) {
      param = prop.val;
    }

    if (param === undefined) {
      param = this$1._type2defaultValue[prop.type];
    }

    if (param === undefined) {
      console.warn(("Failed to set technique property " + (prop.name) + ", value not found."));
      continue;
    }

    if (
      prop.type === enums$1.PARAM_TEXTURE_2D ||
      prop.type === enums$1.PARAM_TEXTURE_CUBE
    ) {
      if (prop.size !== undefined) {
        if (prop.size !== param.length) {
          console.error(("The length of texture array (" + (param.length) + ") is not corrent(expect " + (prop.size) + ")."));
          continue;
        }
        var slots = _int64_pool.add();
        for (var index = 0; index < param.length; ++index) {
          slots[index] = this$1._allocTextuerUnit();
        }
        device.setTextureArray(prop.name, param, slots);
      } else {
        device.setTexture(prop.name, param, this$1._allocTextuerUnit());
      }
    } else {
      var convertedValue = (void 0);
      if (prop.size !== undefined) {
        var convertArray = _type2uniformArrayValue[prop.type];
        if (convertArray.func === undefined) {
          console.error('Uniform array of color3/int3/float3/mat3 can not be supportted!');
          continue;
        }
        if (prop.size * convertArray.size > 64) {
          console.error('Uniform array is too long!');
          continue;
        }
        convertedValue = convertArray.func(param);
      } else {
        var convertFn = _type2uniformValue[prop.type];
        convertedValue = convertFn(param);
      }
      device.setUniform(prop.name, convertedValue);
    }
  }

  // for each pass
  for (var i$1 = 0; i$1 < technique._passes.length; ++i$1) {
    var pass = technique._passes[i$1];
    var count = ia.getPrimitiveCount();

    // set vertex buffer
    device.setVertexBuffer(0, ia._vertexBuffer);

    // set index buffer
    if (ia._indexBuffer) {
      device.setIndexBuffer(ia._indexBuffer);
    }

    // set primitive type
    device.setPrimitiveType(ia._primitiveType);

    // set program
    var program = programLib.getProgram(pass._programName, options);
    device.setProgram(program);

    // cull mode
    device.setCullMode(pass._cullMode);

    // blend
    if (pass._blend) {
      device.enableBlend();
      device.setBlendFuncSep(
        pass._blendSrc,
        pass._blendDst,
        pass._blendSrcAlpha,
        pass._blendDstAlpha
      );
      device.setBlendEqSep(
        pass._blendEq,
        pass._blendAlphaEq
      );
      device.setBlendColor32(pass._blendColor);
    }

    // depth test & write
    if (pass._depthTest) {
      device.enableDepthTest();
      device.setDepthFunc(pass._depthFunc);
    }
    if (pass._depthWrite) {
      device.enableDepthWrite();
    }

    // stencil
    if (pass._stencilTest) {
      device.enableStencilTest();

      // front
      device.setStencilFuncFront(
        pass._stencilFuncFront,
        pass._stencilRefFront,
        pass._stencilMaskFront
      );
      device.setStencilOpFront(
        pass._stencilFailOpFront,
        pass._stencilZFailOpFront,
        pass._stencilZPassOpFront,
        pass._stencilWriteMaskFront
      );

      // back
      device.setStencilFuncBack(
        pass._stencilFuncBack,
        pass._stencilRefBack,
        pass._stencilMaskBack
      );
      device.setStencilOpBack(
        pass._stencilFailOpBack,
        pass._stencilZFailOpBack,
        pass._stencilZPassOpBack,
        pass._stencilWriteMaskBack
      );
    }

    // draw pass
    device.draw(ia._start, count);

    this$1._resetTextuerUnit();
  }
};

var renderer = {
  // config
  addStage: config.addStage,

  // utils
  createIA: createIA,

  // classes
  Pass: Pass,
  Technique: Technique,
  Effect: Effect,
  InputAssembler: InputAssembler,
  View: View,

  Light: Light,
  Camera: Camera,
  Model: Model,
  Scene: Scene,

  Base: Base,
  ProgramLib: ProgramLib,
};
Object.assign(renderer, enums$1);

var KEY_NONE = 0;
var KEY_DOWN = 1;
var KEY_PRESSING = 2;
var KEY_UP = 3;

var TOUCH_START = 0;
var TOUCH_PRESSING = 1;
var TOUCH_END = 2;
var TOUCH_CANCEL = 3;

var _dragMask = null;

var Input = function Input(element, opts) {
  var this$1 = this;

  opts = opts || {};

  if (!_dragMask && opts.useMask) {
    _dragMask = document.createElement('div');
    _dragMask.classList.add('drag-mask');
    _dragMask.style.position = 'fixed';
    _dragMask.style.zIndex = '9999';
    _dragMask.style.top = '0';
    _dragMask.style.right = '0';
    _dragMask.style.bottom = '0';
    _dragMask.style.left = '0';
    _dragMask.oncontextmenu = function () { return false; };
  }

  this._opts = opts;
  this._element = element || document.body;
  this._globalEventInstalled = false;

  var ua = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
    this._hasTouch = true;
  }

  // mouse internal states
  this._pointerLocked = false;
  this._mouseGrabbed = false;

  this._bcr = element.getBoundingClientRect();

  // the mouse state
  this._mouse = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    prevX: 0,
    prevY: 0,

    // mouse wheel (delta)
    scrollX: 0,
    scrollY: 0,

    // buttons
    left: KEY_NONE,
    right: KEY_NONE,
    middle: KEY_NONE,
  };

  // the keyboard state
  this._keyboard = {
    // key-name: key-state (0: none, 1: down, 2: press, 3: up)
  };

  //the touch state
  this._touches = new RecyclePool(function () {
    return {
      id: -1, // touch.identifier
      phase: -1, // 0: START, 1: PRESSING, 2: END
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      prevX: 0,
      prevY: 0,
    };
  }, 16);

  // mousemove
  this._mousemoveHandle = function (event) {
    event.preventDefault();
    event.stopPropagation();

    this$1._mouse.dx = event.movementX;
    this$1._mouse.dy = event.movementY;

    if (this$1._pointerLocked) {
      this$1._mouse.x += event.movementX;
      this$1._mouse.y += event.movementY;
    } else {
      this$1._mouse.x = this$1._calcOffsetX(event.clientX);
      this$1._mouse.y = this$1._calcOffsetY(event.clientY);
    }
  };

  // mousewheel
  this._mousewheelHandle = function (event) {
    event.preventDefault();
    event.stopPropagation();

    this$1._mouse.scrollX = event.deltaX;
    this$1._mouse.scrollY = event.deltaY;
  };

  // mousedown
  this._mousedownHandle = function (event) {
    // NOTE: this will prevent mouse enter the text selection state.
    event.preventDefault();
    event.stopPropagation();

    if (this$1._opts.lock) {
      this$1._lock(true);
    }

    this$1._installGlobalEvents();
    this$1._element.focus();

    // handle mouse button
    switch (event.button) {
      // left mouse down
      case 0:
        // NOTE: do not reset KEY_DOWN when it already pressed
        if (this$1._mouse.left !== KEY_PRESSING) {
          this$1._mouse.left = KEY_DOWN;
        }
        break;

      // middle mouse down
      case 1:
        // NOTE: do not reset KEY_DOWN when it already pressed
        if (this$1._mouse.middle !== KEY_PRESSING) {
          this$1._mouse.middle = KEY_DOWN;
        }
        break;

      // right mouse down
      case 2:
        // NOTE: do not reset KEY_DOWN when it already pressed
        if (this$1._mouse.right !== KEY_PRESSING) {
          this$1._mouse.right = KEY_DOWN;
        }
        break;
    }
  };

  // mouseup
  this._mouseupHandle = function (event) {
    event.preventDefault();
    event.stopPropagation();

    // reset mouse position
    this$1._mouse.dx = event.movementX;
    this$1._mouse.dy = event.movementY;
    this$1._mouse.prevX = this$1._mouse.x = this$1._calcOffsetX(event.clientX);
    this$1._mouse.prevY = this$1._mouse.y = this$1._calcOffsetY(event.clientY);

    // handle mouse button
    switch (event.button) {
      // left mouse up
      case 0:
        this$1._mouse.left = KEY_UP;
        break;

      // middle mouse up
      case 1:
        this$1._mouse.middle = KEY_UP;
        break;

      // right mouse up
      case 2:
        this$1._mouse.right = KEY_UP;
        break;
    }
  };

  // mouseenter
  this._mouseenterHandle = function (event) {
    event.preventDefault();
    event.stopPropagation();

    this$1._mouse.dx = 0.0;
    this$1._mouse.dy = 0.0;
    this$1._mouse.prevX = this$1._mouse.x = this$1._calcOffsetX(event.clientX);
    this$1._mouse.prevY = this$1._mouse.y = this$1._calcOffsetY(event.clientY);
  };

  // mouseleave
  this._mouseleaveHandle = function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (this$1._mouseGrabbed) {
      return;
    }

    this$1._uninstallGlobalEvents();

    this$1._mouse.dx = event.movementX;
    this$1._mouse.dy = event.movementY;
    this$1._mouse.prevX = this$1._mouse.x = this$1._calcOffsetX(event.clientX);
    this$1._mouse.prevY = this$1._mouse.y = this$1._calcOffsetY(event.clientY);
  };

  // keydown
  this._keydownHandle = function (event) {
    event.stopPropagation();

    // NOTE: do not reset KEY_DOWN when it already pressed
    if (this$1._keyboard[event.key] !== KEY_PRESSING) {
      this$1._keyboard[event.key] = KEY_DOWN;
    }
  };

  // keyup
  this._keyupHandle = function (event) {
    event.stopPropagation();

    this$1._keyboard[event.key] = KEY_UP;
  };

  // touchstart
  this._touchstartHandle = function (event) {
    event.preventDefault();

    for (var i = 0; i < event.changedTouches.length; i++) {
      var touch = this$1._touches.add();
      touch.id = event.changedTouches[i].identifier;
      touch.phase = TOUCH_START;
      touch.x = this$1._calcOffsetX(event.changedTouches[i].clientX);
      touch.y = this$1._calcOffsetY(event.changedTouches[i].clientY);
      touch.dx = 0;
      touch.dy = 0;
      touch.prevX = 0;
      touch.prevY = 0;
    }
  };

  // touchmove
  this._touchmoveHandle = function (event) {
    event.preventDefault();

    for (var i = 0; i < this$1._touches.length; i++) {
      for (var j = 0; j < event.changedTouches.length; j++) {
        if (this$1._touches.data[i].id === event.changedTouches[j].identifier) {
          this$1._touches.data[i].phase = TOUCH_PRESSING;
          this$1._touches.data[i].x = this$1._calcOffsetX(event.changedTouches[j].clientX);
          this$1._touches.data[i].y = this$1._calcOffsetY(event.changedTouches[j].clientY);
          this$1._touches.data[i].dx = this$1._touches.data[i].x - this$1._touches.data[i].prevX;
          this$1._touches.data[i].dy = this$1._touches.data[i].y - this$1._touches.data[i].prevY;
        }
      }
    }
  };

  // touchend
  this._touchendHandle = function (event) {
    event.preventDefault();

    for (var i = 0; i < this$1._touches.length; i++) {
      for (var j = 0; j < event.changedTouches.length; j++) {
        if (this$1._touches.data[i].id === event.changedTouches[j].identifier) {
          this$1._touches.data[i].phase = TOUCH_END;
          this$1._touches.data[i].prevX = this$1._touches.data[i].x = this$1._calcOffsetX(event.changedTouches[j].clientX);
          this$1._touches.data[i].prevY = this$1._touches.data[i].y = this$1._calcOffsetY(event.changedTouches[j].clientY);
          this$1._touches.data[i].dx = 0;
          this$1._touches.data[i].dy = 0;
        }
      }
    }
  };

  // touchcancel
  this._touchcancelHandle = function (event) {
    event.preventDefault();

    for (var i = 0; i < this$1._touches.length; i++) {
      for (var j = 0; j < event.changedTouches.length; j++) {
        if (this$1._touches.data[i].id === event.changedTouches[j].identifier) {
          this$1._touches.data[i].phase = TOUCH_CANCEL;
          this$1._touches.data[i].prevX = this$1._touches.data[i].x = this$1._calcOffsetX(event.changedTouches[j].clientX);
          this$1._touches.data[i].prevY = this$1._touches.data[i].y = this$1._calcOffsetY(event.changedTouches[j].clientY);
          this$1._touches.data[i].dx = 0;
          this$1._touches.data[i].dy = 0;
        }
      }
    }
  };

  // contextmenu
  this._contextmenuHandle = function (event) {
    event.preventDefault();
    event.stopPropagation();
  };

  this._registerEvents();
};

var prototypeAccessors$9 = { hasTouch: { configurable: true },mouseX: { configurable: true },mouseY: { configurable: true },mouseDeltaX: { configurable: true },mouseDeltaY: { configurable: true },mousePrevX: { configurable: true },mousePreY: { configurable: true },mouseScrollX: { configurable: true },mouseScrollY: { configurable: true },mouseButtons: { configurable: true },touchCount: { configurable: true } };

Input.prototype.destroy = function destroy () {
  this._element.removeEventListener('mousedown', this._mousedownHandle);
  this._element.removeEventListener('mouseenter', this._mouseenterHandle);
  this._element.removeEventListener('mouseleave', this._mouseleaveHandle);
  this._element.removeEventListener('mousemove', this._mousemoveHandle);
  this._element.removeEventListener('mousewheel', this._mousewheelHandle, { passive: true });
  this._element.removeEventListener('keydown', this._keydownHandle);
  this._element.removeEventListener('keyup', this._keyupHandle);
  this._element.removeEventListener("touchstart", this._touchstartHandle);
  this._element.removeEventListener("touchend", this._touchendHandle);
  this._element.removeEventListener("touchcancel", this._touchcancelHandle);
  this._element.removeEventListener("touchmove", this._touchmoveHandle);

  this._element.removeEventListener('contextmenu', this._contextmenuHandle);

  this._uninstallGlobalEvents();
};

Input.prototype._registerEvents = function _registerEvents () {
  this._element.addEventListener('mousedown', this._mousedownHandle);
  this._element.addEventListener('mouseenter', this._mouseenterHandle);
  this._element.addEventListener('mouseleave', this._mouseleaveHandle);
  this._element.addEventListener('mousemove', this._mousemoveHandle);
  this._element.addEventListener('mousewheel', this._mousewheelHandle, { passive: false });
  this._element.addEventListener('keydown', this._keydownHandle);
  this._element.addEventListener('keyup', this._keyupHandle);
  this._element.addEventListener("touchstart", this._touchstartHandle, false);
  this._element.addEventListener("touchend", this._touchendHandle, false);
  this._element.addEventListener("touchcancel", this._touchcancelHandle, false);
  this._element.addEventListener("touchmove", this._touchmoveHandle, false);

  this._element.addEventListener('contextmenu', this._contextmenuHandle);
};

Input.prototype._installGlobalEvents = function _installGlobalEvents () {
  if (this._globalEventInstalled) {
    return;
  }

  document.addEventListener('mouseup', this._mouseupHandle);
  document.addEventListener('mousemove', this._mousemoveHandle);
  document.addEventListener('mousewheel', this._mousewheelHandle, { passive: true });

  if (this._opts.useMask) {
    _dragMask.style.cursor = this._opts.maskCursor || 'default';
    document.body.appendChild(_dragMask);
  }

  this._globalEventInstalled = true;
};

Input.prototype._uninstallGlobalEvents = function _uninstallGlobalEvents () {
  if (!this._globalEventInstalled) {
    return;
  }

  // if we have mouse key pressed, skip it
  if (
    (this._mouse.left !== KEY_NONE && this._mouse.left !== KEY_UP) ||
    (this._mouse.right !== KEY_NONE && this._mouse.right !== KEY_UP) ||
    (this._mouse.middle !== KEY_NONE && this._mouse.middle !== KEY_UP)
  ) {
    return;
  }

  // unlock mouse here
  this._lock(false);

  // if we are grabbing mouse, skip it
  if (this._mouseGrabbed) {
    return;
  }

  document.removeEventListener('mouseup', this._mouseupHandle);
  document.removeEventListener('mousemove', this._mousemoveHandle);
  document.removeEventListener('mousewheel', this._mousewheelHandle, { passive: true });

  if (this._opts.useMask) {
    _dragMask.remove();
  }

  this._globalEventInstalled = false;
};

// NOTE: in web-browser, requestPointerLock only works in mousedown event
Input.prototype._lock = function _lock (locked) {
  if (locked) {
    if (this._pointerLocked) {
      return;
    }

    if (this._element.requestPointerLock) {
      this._element.requestPointerLock();
      this._pointerLocked = true;
    }

    return;
  } else {
    if (!this._pointerLocked) {
      return;
    }

    if (document.exitPointerLock) {
      document.exitPointerLock();
      this._pointerLocked = false;
    }
  }
};

Input.prototype._calcOffsetX = function _calcOffsetX (clientX) {
  return clientX - this._bcr.left;
};

Input.prototype._calcOffsetY = function _calcOffsetY (clientY) {
  if (this._opts.invertY) {
    return this._bcr.height - (clientY - this._bcr.top);
  }

  return clientY - this._bcr.top;
};

/**
 * @property {boolean} hasTouch
 */
prototypeAccessors$9.hasTouch.get = function () {
  return this._hasTouch;
};

/**
 * @property {number} mouseX
 */
prototypeAccessors$9.mouseX.get = function () {
  return this._mouse.x;
};

/**
 * @property {number} mouseY
 */
prototypeAccessors$9.mouseY.get = function () {
  return this._mouse.y;
};

/**
 * @property {number} mouseDeltaX
 */
prototypeAccessors$9.mouseDeltaX.get = function () {
  return this._mouse.dx;
};

/**
 * @property {number} mouseDeltaY
 */
prototypeAccessors$9.mouseDeltaY.get = function () {
  return this._mouse.dy;
};

/**
 * @property {number} mousePrevX
 */
prototypeAccessors$9.mousePrevX.get = function () {
  return this._mouse.prevX;
};

/**
 * @property {number} mousePrevY
 */
prototypeAccessors$9.mousePreY.get = function () {
  return this._mouse.prevY;
};

/**
 * @property {number} mouseScrollX
 */
prototypeAccessors$9.mouseScrollX.get = function () {
  return this._mouse.scrollX;
};

/**
 * @property {number} mouseScrollY
 */
prototypeAccessors$9.mouseScrollY.get = function () {
  return this._mouse.scrollY;
};

/**
 * @property {number} mouseButtons - mouse buttons in pressing states
 */
prototypeAccessors$9.mouseButtons.get = function () {
  var buttons = 0;

  var btn = this._mouse.left;
  if (btn === KEY_DOWN || btn === KEY_PRESSING) {
    buttons |= 1;
  }

  btn = this._mouse.right;
  if (btn === KEY_DOWN || btn === KEY_PRESSING) {
    buttons |= 2;
  }

  btn = this._mouse.middle;
  if (btn === KEY_DOWN || btn === KEY_PRESSING) {
    buttons |= 4;
  }

  return buttons;
};

/**
 * @property {number} touchCount
 */
prototypeAccessors$9.touchCount.get = function () {
  return this._touches.length;
};

/**
 * @method getTouchInfo
 * @param {number} idx
 */
Input.prototype.getTouchInfo = function getTouchInfo (idx) {
  return this._touches.data[idx];
};

/**
 * @method reset
 *
 * Reset the input states.
 * NOTE: you should call this at the end of your frame.
 */
Input.prototype.reset = function reset () {
    var this$1 = this;

  // update mouse states
  this._mouse.prevX = this._mouse.x;
  this._mouse.prevY = this._mouse.y;

  this._mouse.dx = 0;
  this._mouse.dy = 0;

  this._mouse.scrollX = 0;
  this._mouse.scrollY = 0;

  if (this._mouse.left === KEY_DOWN) {
    this._mouse.left = KEY_PRESSING;
  } else if (this._mouse.left === KEY_UP) {
    this._mouse.left = KEY_NONE;
  }

  if (this._mouse.middle === KEY_DOWN) {
    this._mouse.middle = KEY_PRESSING;
  } else if (this._mouse.middle === KEY_UP) {
    this._mouse.middle = KEY_NONE;
  }

  if (this._mouse.right === KEY_DOWN) {
    this._mouse.right = KEY_PRESSING;
  } else if (this._mouse.right === KEY_UP) {
    this._mouse.right = KEY_NONE;
  }

  // update keyboard states
  for (var name in this$1._keyboard) {
    var state = this$1._keyboard[name];
    if (state === KEY_DOWN) {
      this$1._keyboard[name] = KEY_PRESSING;
    } else if (state === KEY_UP) {
      this$1._keyboard[name] = KEY_NONE;
    }
  }

  // update touch states
  for (var i = 0; i < this._touches.length; i++) {
    this$1._touches.data[i].prevX = this$1._touches.data[i].x;
    this$1._touches.data[i].prevY = this$1._touches.data[i].y;
    this$1._touches.data[i].dx = 0;
    this$1._touches.data[i].dy = 0;
    if (this$1._touches.data[i].phase === TOUCH_START) {
      this$1._touches.data[i].phase = TOUCH_PRESSING;
    }
    if (this$1._touches.data[i].phase === TOUCH_END || this$1._touches.data[i].phase === TOUCH_CANCEL) {
      this$1._touches.remove(i);
    }
  }

  // check if uninstall global events
  this._uninstallGlobalEvents();
};

/**
 * @method resize
 *
 * Update cached bounding client size.
 */
Input.prototype.resize = function resize () {
  this._bcr = this._element.getBoundingClientRect();
};

/**
 * @method grabMouse
 * @param {boolean} grabbed
 *
 * Keep tracing mouse move event when mouse leave the target element.
 */
Input.prototype.grabMouse = function grabMouse (grabbed) {
  this._mouseGrabbed = grabbed;

  if (grabbed) {
    this._installGlobalEvents();
  } else {
    this._uninstallGlobalEvents();
  }
};

/**
 * @method mousedown
 * @param {string} name - 'left', 'right' or 'middle'
 */
Input.prototype.mousedown = function mousedown (name) {
  var btn = this._mouse[name];
  if (btn !== undefined) {
    return btn === KEY_DOWN;
  }

  return false;
};

/**
 * @method mousepress
 * @param {string} name - 'left', 'right' or 'middle'
 */
Input.prototype.mousepress = function mousepress (name) {
  var btn = this._mouse[name];
  if (btn !== undefined) {
    return btn === KEY_DOWN || btn === KEY_PRESSING;
  }

  return false;
};

/**
 * @method mouseup
 * @param {string} name - 'left', 'right' or 'middle'
 */
Input.prototype.mouseup = function mouseup (name) {
  var btn = this._mouse[name];
  if (btn !== undefined) {
    return btn === KEY_UP;
  }

  return false;
};

/**
 * @method keydown
 * @param {string} name
 */
Input.prototype.keydown = function keydown (name) {
  return this._keyboard[name] === KEY_DOWN;
};

/**
 * @method keyup
 * @param {string} name
 */
Input.prototype.keyup = function keyup (name) {
  return this._keyboard[name] === KEY_UP;
};

/**
 * @method keypress
 * @param {string} name
 */
Input.prototype.keypress = function keypress (name) {
  return this._keyboard[name] === KEY_DOWN ||
    this._keyboard[name] === KEY_PRESSING;
};

Object.defineProperties( Input.prototype, prototypeAccessors$9 );

var Component = function Component() {
  this._enabled = true;
  this._destroyed = false;

  // engine internal data
  this._entity = null;
  this._engine = null;
};

var prototypeAccessors$10 = { enabled: { configurable: true },destroyed: { configurable: true },entity: { configurable: true } };

prototypeAccessors$10.enabled.get = function () {
  return this._entity.enabledInHierarchy && this._enabled;
};
prototypeAccessors$10.enabled.set = function (val) {
  if (this._enabled !== val) {
    this._enabled = val;

    if (val) {
      if (this.onEnable && this._entity.enabledInHierarchy) {
        this.onEnable();
      }
    } else {
      if (this.onDisable && this._entity.enabledInHierarchy) {
        this.onDisable();
      }
    }
  }
};

prototypeAccessors$10.destroyed.get = function () {
  return this._entity.destroyed || this._destroyed;
};

prototypeAccessors$10.entity.get = function () {
  return this._entity;
};

Component.prototype.destroy = function destroy () {
  if (this._destroyed) {
    return;
  }

  // mark as destroyed
  this._destroyed = true;

  // submit destroy request
  this._engine._destroyComp(this);
};

Object.defineProperties( Component.prototype, prototypeAccessors$10 );



/**
 * callbacks:
 *
 *  - onEnable()
 *  - onDisable()
 *  - onDestroy()
 *  - onClone(src)
 */

// REFERENCE: https://gist.github.com/jed/982883

function b(a) {
  return a           // if the placeholder was passed, return
    ? (              // a random number from 0 to 15
      a ^            // unless b is 8,
      Math.random()  // in which case
      * 16           // a random number from
      >> a / 4       // 8 to 11
    ).toString(16)   // in hexadecimal
    : (              // or otherwise a concatenated string:
      [1e7] +        // 10000000 +
      -1e3 +         // -1000 +
      -4e3 +         // -4000 +
      -8e3 +         // -80000000 +
      -1e11          // -100000000000,
    ).replace(       // replacing
      /[018]/g,      // zeroes, ones, and eights with
      b              // random hex digits
      );
}

var v3_a = vec3.create();
var q_a = quat.create();
var m3_a = mat3.create();
var m3_b = mat3.create();
var m4_a = mat4.create();

var Node = function Node(name) {
  this._id = b();
  this._enabled = true;
  this._parent = null;
  this._children = [];

  this.name = name || '';
  this.lpos = vec3.new(0, 0, 0);
  this.lscale = vec3.new(1, 1, 1);
  this.lrot = quat.new(0, 0, 0, 1);
};

var prototypeAccessors$12 = { enabled: { configurable: true },id: { configurable: true },parent: { configurable: true },children: { configurable: true } };

/**
 * @property {boolean} enabled
 * NOTE: This property will invoke `_onEnableChanged` if it exists.
 */
Node.mixin = function mixin (cls) {
  Object.getOwnPropertyNames(Node.prototype).forEach(function (name) {
    if (cls.prototype.hasOwnProperty(name) === false) {
      Object.defineProperty(
        cls.prototype,
        name,
        Object.getOwnPropertyDescriptor(Node.prototype, name)
      );
    }
  });
  cls.prototype.__initNode = function () {
    this._id = b();
    this._enabled = true;
    this._parent = null;
    this._children = [];

    this.name = '';
    this.lpos = vec3.new(0, 0, 0);
    this.lscale = vec3.new(1, 1, 1);
    this.lrot = quat.new(0, 0, 0, 1);
  };
};

prototypeAccessors$12.enabled.get = function () {
  return this._enabled;
};
prototypeAccessors$12.enabled.set = function (val) {
  if (this._enabled === val) {
    return;
  }

  this._enabled = val;

  if (this._onEnableChanged) {
    this._onEnableChanged();
  }
};

/**
 * @property {number} id
 * @readonly
 */
prototypeAccessors$12.id.get = function () {
  return this._id;
};

/**
 * @property parent
 * @readonly
 *
 * get parent
 */
prototypeAccessors$12.parent.get = function () {
  return this._parent;
};

/**
 * @property children
 *
 * get children
 */
prototypeAccessors$12.children.get = function () {
  return this._children;
};

// ===============================
// hierarchy
// ===============================

/**
 * @method setParent
 * @param {Node} newParent
 * @return {boolean}
 *
 * NOTE: This function will invoke `_onParentChanged` if it exists.
 */
Node.prototype.setParent = function setParent (newParent) {
    var this$1 = this;

  var oldParent = this._parent;

  // newParent is the current parent of this
  if (oldParent === newParent) {
    return false;
  }

  // make sure the newParent is not a child of this
  var cur = newParent;
  while (cur) {
    if (cur === this$1) {
      // console.warn(`Failed to set parent for ${this.name}: the new parent ${newParent.name} is its child.`);
      return false;
    }

    cur = cur._parent;
  }

  // remove this from its old parent (if it has)
  if (oldParent) {
    var len = oldParent._children.length;
    for (var i = 0; i < len; ++i) {
      if (oldParent._children[i] === this$1) {
        oldParent._children.splice(i, 1);
        break;
      }
    }
  }

  // append it to the new parent
  this._parent = newParent;
  if (newParent) {
    newParent._children.push(this);
  }

  // invoke _onParentChanged
  if (this._onParentChanged) {
    this._onParentChanged(oldParent, newParent);
  }

  return true;
};

/**
 * @method insertAt
 * @param {Node} node
 * @param {number} idx
 *
 * Insert `node` before the `idx` of children.
 * NOTE: This function will invoke `_onParentChanged` if it exists.
 */
Node.prototype.insertAt = function insertAt (idx, node) {
    var this$1 = this;

  if (!node) {
    return false;
  }

  // make sure the node is not the parent of this
  var cur = this;
  while (cur) {
    if (cur === node) {
      // console.warn(`Failed to append ${node.name}: it is the ancient of current node.`);
      return false;
    }

    cur = cur._parent;
  }

  var oldParent = node._parent;

  // 0 <= idx <= len
  var len = this._children.length;
  idx = idx < 0 ? 0 : idx > len ? len : idx;

  // remove node from its current parent
  if (oldParent) {
    len = oldParent._children.length;
    for (var i = 0; i < len; ++i) {
      if (oldParent._children[i] === node) {
        // if we already have the child
        if (oldParent === this$1) {
          // if its insert position didn't changed, don't do anything.
          if (i === idx || i === idx - 1) {
            return false;
          }

          if (i < idx - 1) {
            idx = idx - 1;
          }
        }

        oldParent._children.splice(i, 1);
        break;
      }
    }
  }

  // append the new node
  node._parent = this;
  this._children.splice(idx, 0, node);

  // invoke _onParentChanged
  if (node._onParentChanged && node._parent !== this) {
    node._onParentChanged(oldParent, this);
  }

  return true;
};

/**
 * @method append
 * @param {Node} node
 * @return {boolean}
 *
 * Append `node` at the end of children.
 * NOTE: This function will invoke `_onParentChanged` if it exists.
 */
Node.prototype.append = function append (node) {
    var this$1 = this;

  if (!node) {
    return false;
  }

  // make sure the node is not the parent of this
  var cur = this;
  while (cur) {
    if (cur === node) {
      // console.warn(`Failed to append ${node.name}: it is the ancient of current node.`);
      return false;
    }

    cur = cur._parent;
  }

  var oldParent = node._parent;

  // remove node from its current parent
  if (oldParent) {
    var len = oldParent._children.length;
    for (var i = 0; i < len; ++i) {
      if (oldParent._children[i] === node) {
        // if we already have the child and its insert position didn't changed, don't do anything.
        if (oldParent === this$1 && i === len - 1) {
          return false;
        }

        oldParent._children.splice(i, 1);
        break;
      }
    }
  }

  // append the new node
  node._parent = this;
  this._children.push(node);

  // invoke _onParentChanged
  if (node._onParentChanged && node._parent !== this) {
    node._onParentChanged(oldParent, this);
  }

  return true;
};

/**
 * @method remove
 *
 * Remove self from parent
 * NOTE: This function will invoke `_onParentChanged` if it exists.
 */
Node.prototype.remove = function remove () {
  if (this._parent) {
    this._parent.removeChild(this);
  }
};

/**
 * @method removeChild
 * @param {Node} node
 *
 * Remove child
 * NOTE: This function will invoke `_onParentChanged` if it exists.
 */
Node.prototype.removeChild = function removeChild (node) {
    var this$1 = this;

  var len = this._children.length;

  for (var i = 0; i < len; ++i) {
    if (this$1._children[i] === node) {
      this$1._children.splice(i, 1);
      node._parent = null;

      // invoke _onParentChanged
      if (node._onParentChanged) {
        node._onParentChanged(this$1, null);
      }

      return true;
    }
  }

  // console.warn(`Failed to remove node ${node.name}, can not find it.`);
  return false;
};

// ===============================
// transform helper
// ===============================

/**
 * @method getWorldPos
 * @param {vec3} pos
 * @param {vec3} [up] - default is (0,1,0)
 * @return {vec3}
 *
 * Set rotation by lookAt target point
 */
Node.prototype.lookAt = function lookAt (pos, up) {
  this.getWorldPos(v3_a);
  vec3.sub(v3_a, v3_a, pos); // NOTE: we use -z for view-dir
  vec3.normalize(v3_a, v3_a);
  quat.fromViewUp(q_a, v3_a, up);

  this.setWorldRot(q_a);
};

// ===============================
// transform
// ===============================

/**
 * @method getWorldPos
 * @param {vec3} out
 * @return {vec3}
 *
 * Calculate and return world position
 */
Node.prototype.getWorldPos = function getWorldPos (out) {
  vec3.copy(out, this.lpos);

  var cur = this._parent;
  while (cur) {
    // out = parent_lscale * lpos
    vec3.mul(out, out, cur.lscale);

    // out = parent_lrot * out
    vec3.transformQuat(out, out, cur.lrot);

    // out = out + lpos
    vec3.add(out, out, cur.lpos);

    cur = cur._parent;
  }

  return out;
};

/**
 * @method setWorldPos
 * @param {vec3} pos
 *
 * Set world position
 */
Node.prototype.setWorldPos = function setWorldPos (pos) {
  // NOTE: this is faster than invert world matrix and transform the point

  if (this._parent) {
    this._parent.invTransformPoint(this.lpos, pos);
    return;
  }

  vec3.copy(this.lpos, pos);
};

/**
 * @method getWorldRot
 * @param {quat} out
 * @return {quat}
 *
 * Calculate and return world rotation
 */
Node.prototype.getWorldRot = function getWorldRot (out) {
  quat.copy(out, this.lrot);

  // result = ... * parent.parent.lrot * parent.lrot * lrot
  var cur = this._parent;
  while (cur) {
    quat.mul(out, cur.lrot, out);

    cur = cur._parent;
  }

  return out;
};

/**
 * @method setWorldRot
 * @param {quat} rot
 *
 * Set world position
 */
Node.prototype.setWorldRot = function setWorldRot (rot) {
  // lrot = rot * inv(prarent.wrot);
  if (this._parent) {
    this._parent.getWorldRot(this.lrot);
    quat.conjugate(this.lrot, this.lrot);
    quat.mul(this.lrot, this.lrot, rot);

    return;
  }

  quat.copy(this.lrot, rot);
};

/**
 * @method getWorldScale
 * @param {quat} out
 * @return {quat}
 *
 * Calculate and return world rotation
 */
Node.prototype.getWorldScale = function getWorldScale (out) {
  // invRot = inv(world_rot)
  this.getWorldRot(q_a);
  quat.conjugate(q_a, q_a);
  mat3.fromQuat(out, q_a);

  // worldRotScale
  this.getWorldRS(m3_a);

  // invRot * worldRotScale
  mat3.mul(out, out, m3_a);

  return out;
};

/**
 * @method invTransformPoint
 * @param {vec3} out
 * @param {vec3} vec3
 *
 * Transforms position from world space to local space.
 */
Node.prototype.invTransformPoint = function invTransformPoint (out, pos) {
  if (this._parent) {
    this._parent.invTransformPoint(out, pos);
  } else {
    vec3.copy(out, pos);
  }

  // out = parent_inv_pos - lpos
  vec3.sub(out, out, this.lpos);

  // out = inv(lrot) * out
  quat.conjugate(q_a, this.lrot);
  vec3.transformQuat(out, out, q_a);

  // out = (1/scale) * out
  vec3.inverseSafe(v3_a, this.lscale);
  vec3.mul(out, out, v3_a);

  return out;
};

/**
 * @method getLocalMatrix
 * @param {mat4} out
 * @return {mat4}
 *
 * Calculate and return local transform
 */
Node.prototype.getLocalMatrix = function getLocalMatrix (out) {
  mat4.fromRTS(out, this.lrot, this.lpos, this.lscale);
  return out;
};

/**
 * @method getWorldMatrix
 * @param {mat4} out
 * @return {mat4}
 *
 * Calculate and return world transform
 */
Node.prototype.getWorldMatrix = function getWorldMatrix (out) {
  // out = ... * parent.parent.local * parent.local * local;
  this.getLocalMatrix(out);

  var cur = this._parent;
  while (cur) {
    cur.getLocalMatrix(m4_a);
    mat4.mul(out, m4_a, out);

    cur = cur._parent;
  }

  return out;
};

/**
 * @method getWorldRT
 * @param {mat4} out
 * @return {mat4}
 *
 * Calculate and return world transform without scale
 */
Node.prototype.getWorldRT = function getWorldRT (out) {
  this._getWorldPosAndRot(v3_a, q_a);
  mat4.fromRT(out, q_a, v3_a);

  return out;
};

/**
 * @method getWorldRS
 * @param {mat3} out
 *
 * Calculate and return world rotation and scale matrix
 */
Node.prototype.getWorldRS = function getWorldRS (out) {
  mat3.set(m3_a,
    this.lscale.x, 0, 0,
    0, this.lscale.y, 0,
    0, 0, this.lscale.z
  );
  mat3.fromQuat(m3_b, this.lrot);

  if (this._parent) {
    // parent_RS * rot * scale
    this._parent.getWorldRS(out);
    mat3.mul(out, out, m3_b);
    mat3.mul(out, out, m3_a);
  } else {
    // rot * scale
    mat3.mul(out, m3_b, m3_a);
  }

  return out;
};

/**
 * @method _getWorldPosAndRot
 * @param {vec3} opos
 * @param {vec3} orot
 *
 * Calculate and return world position
 */
Node.prototype._getWorldPosAndRot = function _getWorldPosAndRot (opos, orot) {
  vec3.copy(opos, this.lpos);
  quat.copy(orot, this.lrot);

  var cur = this._parent;
  while (cur) {
    // opos = parent_lscale * lpos
    vec3.mul(opos, opos, cur.lscale);

    // opos = parent_lrot * opos
    vec3.transformQuat(opos, opos, cur.lrot);

    // opos = opos + lpos
    vec3.add(opos, opos, cur.lpos);

    // orot = lrot * orot
    quat.mul(orot, cur.lrot, orot);

    cur = cur._parent;
  }
};

Object.defineProperties( Node.prototype, prototypeAccessors$12 );

/**
 * @method walk
 * @param {Node} node
 * @param {function} fn
 * @param {Node} fn.node
 * @param {Node} fn.parent
 * @param {number} fn.level
 */
function walk(node, fn, level) {
  if ( level === void 0 ) level = 0;

  level += 1;
  var len = node.children.length;

  for (var i = 0; i < len; ++i) {
    var child = node.children[i];
    var continueWalk = fn(child, node, level);

    if (continueWalk !== false) {
      walk(child, fn, level);
    }
  }
}

/**
 * @method walk2
 * @param {Node} node
 * @param {function} fn1
 * @param {Node} fn1.node
 * @param {Node} fn1.parent
 * @param {number} fn1.level
 *
 * fn1 is used when entering the node
 *
 * @param {function} fn2
 * @param {Node} fn2.node
 * @param {Node} fn2.parent
 * @param {number} fn2.level
 *
 * fn2 is used when leaving the node
 */
function walk2(node, fn1, fn2, level) {
  if ( level === void 0 ) level = 0;

  level += 1;
  var len = node.children.length;

  for (var i = 0; i < len; ++i) {
    var child = node.children[i];
    var continueWalk = fn1(child, node, level);

    if (continueWalk !== false) {
      walk2(child, fn1, fn2, level);
    }
    fn2(child, node, level);
  }
}

/**
 * @method flat
 * @param {Node} node
 */
function flat(node) {
  var out = [];

  out.push(node);
  walk(node, function (iter) {
    out.push(iter);
  });

  return out;
}

/**
 * @method replace
 * @param {Node} oldNode
 * @param {Node} newNode
 */
function replace(oldNode, newNode) {
  newNode.remove();

  var parent = oldNode._parent;
  if (!parent) {
    return;
  }

  oldNode._parent = null;
  newNode._parent = parent;

  var len = parent._children.length;
  for (var i = 0; i < len; ++i) {
    if (parent._children[i] === oldNode) {
      parent._children[i] = newNode;
      return;
    }
  }
}

/**
 * @method enable
 * @param {Node} node
 * @param {boolean} val
 * @param {function} fn
 */
function enable(node, val, fn) {
  if (node._enabled !== val) {
    node._enabled = val;

    if (fn) {
      fn(node, val);

      walk(node, function (n) {
        if (n._enabled) {
          fn(n, val);
          return true;
        }

        return false;
      });
    }
  }
}

/**
 * @method clone
 * @param {Node} node
 * @param {function} ctor
 * @param {function} fn
 * @return {Node}
 */
function clone(node, ctor, fn) {
  if ( ctor === void 0 ) ctor = Node;
  if ( fn === void 0 ) fn = null;

  var newNode = new ctor();
  newNode.name = node.name;
  vec3.copy(newNode.lpos, node.lpos);
  vec3.copy(newNode.lscale, node.lscale);
  quat.copy(newNode.lrot, node.lrot);

  // do user custom clone function
  if (fn) {
    fn(newNode, node);
  }

  return newNode;
}

/**
 * @method deepClone
 * @param {Node} node
 * @param {function} ctor
 * @param {function} fn
 * @return {Node}
 */
function deepClone(node, ctor, fn) {
  if ( ctor === void 0 ) ctor = Node;
  if ( fn === void 0 ) fn = null;

  var newNode = clone(node, ctor, fn);

  newNode._children = new Array(node._children.length);
  for (var i = 0; i < node._children.length; ++i) {
    var child = node._children[i];
    var newChild = deepClone(child, ctor, fn);
    newNode._children[i] = newChild;
    newChild._parent = newNode;
  }

  return newNode;
}

/**
 * @method enabledInHierarchy
 * @param {Node} node
 * @param {boolean} includeSelf
 */
function enabledInHierarchy(node, includeSelf) {
  if ( includeSelf === void 0 ) includeSelf = true;

  if (includeSelf && !node._enabled) {
    return false;
  }

  var cur = node._parent;
  while (cur) {
    if (!cur._enabled) {
      return false;
    }

    cur = cur._parent;
  }

  return true;
}

/**
 * @method find
 * @param {Node} root
 * @param {string} path
 */
function find(root, path) {
  var names = path.split('/');

  function _recurse(node, level) {
    var len = node.children.length;
    var name = names[level];

    for (var i = 0; i < len; ++i) {
      var child = node.children[i];

      if (child.name !== name) {
        continue;
      }

      if (level === names.length - 1) {
        return child;
      } else {
        return _recurse(child, level + 1);
      }
    }

    return null;
  }

  return _recurse(root, 0);
}

var utils = {
  walk: walk,
  walk2: walk2,
  flat: flat,
  replace: replace,
  enable: enable,
  clone: clone,
  deepClone: deepClone,
  enabledInHierarchy: enabledInHierarchy,
  find: find,
};

/**
 * @class Event
 */
var Event = function Event(name, opts) {
  if ( opts === void 0 ) opts = {};

  this.name = name;
  this.detail = opts.detail;
  this.bubbles = opts.bubbles;
  this.target = null;
  this.sender = null;

  this._stopped = false;
};

/**
 * @method stop
 *
 * Stop propgation
 */
Event.prototype.stop = function stop () {
  this._stopped = true;
};

// forked from: https://github.com/primus/eventemitter3

var has = Object.prototype.hasOwnProperty;

/**
 * An event-table is a plain object whose properties are event names.
 */
function _createTable() {
  var obj = Object.create(null);
  obj.__tmp__ = undefined;
  delete obj.__tmp__;

  return obj;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function _EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function _addListener(emitter, evt, fn, context, once) {
  var listener = new _EE(fn, context || emitter, once);

  if (!emitter._events[evt]) {
    emitter._events[evt] = listener;
    emitter._eventsCount++;
  } else if (!emitter._events[evt].fn) {
    emitter._events[evt].push(listener);
  } else {
    emitter._events[evt] = [emitter._events[evt], listener];
  }

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function _clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) {
    emitter._events = _createTable();
  } else {
    delete emitter._events[evt];
  }
}

/**
 * bubble event
 *
 * @param {Event} event
 * @private
 */
function _dispatchEvent(event) {
  var emitter = event.target;

  while (emitter) {
    emitter.emit(event.name, event);

    if (!event.bubbles || event._stopped) {
      break;
    }

    emitter = emitter.parent;
  }
}

/**
 * @class EventEmitter
 */
var EventEmitter = function EventEmitter() {
  this._events = _createTable();
  this._eventsCount = 0;
};

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 */
EventEmitter.mixin = function mixin (cls) {
  Object.getOwnPropertyNames(EventEmitter.prototype).forEach(function (name) {
    if (cls.prototype.hasOwnProperty(name) === false) {
      Object.defineProperty(
        cls.prototype,
        name,
        Object.getOwnPropertyDescriptor(EventEmitter.prototype, name)
      );
    }
  });
  cls.prototype.__initEventEmitter = function () {
    this._events = _createTable();
    this._eventsCount = 0;
  };
};

EventEmitter.prototype.eventNames = function eventNames () {
    var this$1 = this;

  var names = [], events, name;

  if (this._eventsCount === 0) {
    return names;
  }

  for (name in (events = this$1._events)) {
    if (has.call(events, name)) {
      names.push(name);
    }
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} evt The event name.
 * @param {Boolean} exists Only check if there are listeners.
 * @returns {(Array|Boolean)}
 */
EventEmitter.prototype.listeners = function listeners (evt, exists) {
  var available = this._events[evt];

  if (exists) {
    return !!available;
  }

  if (!available) {
    return [];
  }

  if (available.fn) {
    return [available.fn];
  }

  var l = available.length;
  var ee = new Array(l);

  for (var i = 0; i < l; ++i) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} evt The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 */
EventEmitter.prototype.emit = function emit (evt, a1, a2, a3, a4, a5) {
    var arguments$1 = arguments;
    var this$1 = this;

  if (!this._events[evt]) {
    return false;
  }

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) {
      this.off(evt, listeners.fn, undefined, true);
    }

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len - 1); i < len; i++) {
      args[i - 1] = arguments$1[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length, j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) {
        this$1.off(evt, listeners[i].fn, undefined, true);
      }

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) {
            for (j = 1, args = new Array(len - 1); j < len; j++) {
              args[j - 1] = arguments$1[j];
            }
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} evt The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on (evt, fn, context) {
  return _addListener(this, evt, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} evt The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once (evt, fn, context) {
  return _addListener(this, evt, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} evt The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.off = function off (evt, fn, context, once) {
  if (!this._events[evt]) {
    return this;
  }

  if (!fn) {
    _clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      _clearEvent(this, evt);
    }
  } else {
    var events = [];
    for (var i = 0, l = listeners.length; i < l; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) {
      this._events[evt] = events.length === 1 ? events[0] : events;
    } else {
      _clearEvent(this, evt);
    }
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [evt] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners (evt) {
  if (evt) {
    if (this._events[evt]) {
      _clearEvent(this, evt);
    }
  } else {
    this._events = _createTable();
    this._eventsCount = 0;
  }

  return this;
};

/**
 * @param {Event|string} evt
 * @param {object} [opts]
 */
EventEmitter.prototype.dispatch = function dispatch (evt, opts) {
  var event = evt;
  if (typeof evt === 'string') {
    event = new Event(evt, opts);
    event.target = this;
  }

  _dispatchEvent(event);
};

var _setParent = Node.prototype.setParent;

var Entity = function Entity(name) {
  this.__initNode();
  this.__initEventEmitter();

  this.name = name || '';
  // NOTE: _ancestorEnabled not include self
  this._ancestorEnabled = true;
  this._ready = false;
  this._destroyed = false;
  this._comps = [];

  // engine internal data
  this._engine = null;
  this._poolID = -1;
};

var prototypeAccessors$11 = { enabledInHierarchy: { configurable: true },ready: { configurable: true },destroyed: { configurable: true } };

prototypeAccessors$11.enabledInHierarchy.get = function () {
  return this._enabled && this._ancestorEnabled;
};

prototypeAccessors$11.ready.get = function () {
  return this._ready;
};

prototypeAccessors$11.destroyed.get = function () {
  return this._destroyed;
};

Entity.prototype.destroy = function destroy () {
    var this$1 = this;

  if (this._destroyed) {
    return;
  }

  // mark as destroyed
  this._destroyed = true;

  // recursively destroy child entities
  for (var i = 0; i < this._children.length; ++i) {
    var child = this$1._children[i];
    child.destroy();
  }

  // remove all components
  for (var i$1 = 0; i$1 < this._comps.length; ++i$1) {
    var comp = this$1._comps[i$1];
    comp.destroy();
  }

  // submit destroy request
  this._engine._destroyEntity(this);
};

Entity.prototype.setParent = function setParent (newParent) {
  // NOTE: if we destroy the entity,
  // we need to set parent to null to remove it from parent
  if (newParent === null && this._destroyed === false) {
    newParent = this._engine.activeLevel;
  }

  _setParent.call(this, newParent);
};

Entity.prototype._onEnableChanged = function _onEnableChanged () {
  if (this._ancestorEnabled) {
    // NOTE: we can not emit event during calculating the _enabledInHierarchy
    utils.walk(this, function (n) {
      n._ancestorEnabled = n._parent.enabledInHierarchy;
      return true;
    });

    if (this._ready) {
      this._engine._notifyEnableChanged(this, this._enabled);
    }
  }
};

Entity.prototype._onParentChanged = function _onParentChanged (oldParent, newParent) {
  // update _acestorEnabled
  var oldEnabledInHierarchy = this.enabledInHierarchy;

  if (!this._parent) {
    this._ancestorEnabled = true;
  } else {
    this._ancestorEnabled = this._parent.enabledInHierarchy;
  }

  var newEnabledInHierarchy = this.enabledInHierarchy;

  // don't do anything if we didn't ready
  if (this._ready) {
    // emit parent-changed event
    this.emit('parent-changed', oldParent, newParent);

    // if enabledInHierarchy changed
    if (oldEnabledInHierarchy !== newEnabledInHierarchy) {
      this._engine._notifyEnableChanged(this, newEnabledInHierarchy);
    }
  }
};

Entity.prototype.clone = function clone () {
  return this._engine.cloneEntity(this);
};

Entity.prototype.deepClone = function deepClone () {
  return this._engine.deepCloneEntity(this);
};

Entity.prototype.getComp = function getComp (classname) {
    var this$1 = this;

  var ctor = this._engine.getClass(classname);

  for (var i = 0; i < this._comps.length; ++i) {
    var comp = this$1._comps[i];
    if (comp instanceof ctor) {
      return comp;
    }
  }

  return null;
};

Entity.prototype.getComps = function getComps (classname) {
    var this$1 = this;

  var ctor = this._engine.getClass(classname);
  var results = [];

  for (var i = 0; i < this._comps.length; ++i) {
    var comp = this$1._comps[i];
    if (comp instanceof ctor) {
      results.push(comp);
    }
  }

  return results;
};

Entity.prototype.getCompsInChildren = function getCompsInChildren (classname) {
  var ctor = this._engine.getClass(classname);
  var results = [];

  utils.walk(this, function (n) {
    for (var i = 0; i < n._comps.length; ++i) {
      var comp = n._comps[i];
      if (comp instanceof ctor) {
        results.push(comp);
      }
    }
  });

  return results;
};

Entity.prototype.addComp = function addComp (classname) {
  var ctor = this._engine.getClass(classname);

  if (!ctor.__multiple__) {
    if (this.getComp(classname)) {
      return null;
    }
  }

  var comp = this._engine._createComp(ctor, this);
  this._comps.push(comp);

  return comp;
};

// call by engine
Entity.prototype._removeComp = function _removeComp (comp) {
    var this$1 = this;

  for (var i = 0; i < this._comps.length; ++i) {
    var c = this$1._comps[i];
    if (c === comp) {
      this$1._comps.splice(i, 1);
      return true;
    }
  }

  return false;
};

Object.defineProperties( Entity.prototype, prototypeAccessors$11 );

Node.mixin(Entity);
EventEmitter.mixin(Entity);

var Level = (function (Entity$$1) {
  function Level(engine, name) {
    Entity$$1.call(this, name);
    this._engine = engine;
  }

  if ( Entity$$1 ) Level.__proto__ = Entity$$1;
  Level.prototype = Object.create( Entity$$1 && Entity$$1.prototype );
  Level.prototype.constructor = Level;

  Level.prototype.addComp = function addComp () {
    console.warn('Can not add component in level');
  };

  return Level;
}(Entity));

var System = function System() {
  this._enabled = true;

  // set by engine
  this._id = '';
  this._engine = null;
  this._priority = 0;
  this._compClass = null;
};

System.prototype.finalize = function finalize () {
  // Example:
  // this._components = new FixedArray(this._poolSize);
};

System.prototype.add = function add (/*comp*/) {
  // Example:
  // this._components.push(comp);
};

System.prototype.remove = function remove (/*comp*/) {
  // Example:
  // for (let i = 0; i < this._components.length; ++i) {
  // let component = this._components.data[i];
  // if (component === comp) {
  //   this._components.fastRemove(i);
  //   break;
  // }
  // }
};

System.prototype.tick = function tick () {
  // Example:
  // for (let i = 0; i < this._components.length; ++i) {
  // let comp = this._components[i];
  // comp.update();
  // }
};

System.prototype.postTick = function postTick () {
  // Example:
  // for (let i = 0; i < this._components.length; ++i) {
  // let comp = this._components[i];
  // comp.postUpdate();
  // }
};

function _emitEnableChanged(ent, enabled) {
  if (enabled) {
    ent.emit('enable');

    for (var i = 0; i < ent._comps.length; ++i) {
      var comp = ent._comps[i];
      if (comp.onEnable) {
        comp.onEnable();
      }
    }
  } else {
    ent.emit('disable');

    for (var i$1 = 0; i$1 < ent._comps.length; ++i$1) {
      var comp$1 = ent._comps[i$1];
      if (comp$1.onDisable) {
        comp$1.onDisable();
      }
    }
  }
}

var Engine = function Engine(opts) {
  var this$1 = this;
  if ( opts === void 0 ) opts = {};

  var poolSize = opts.poolSize || 100;

  this._classes = {};
  this._systems = [];

  this._activeLevel = new Level();

  // NOTE: we don't use recycles pool here because reused entity may be refereced by others
  this._entities = new FixedArray(poolSize);
  this._newComponents = new FixedArray(poolSize);
  this._deadComponents = new FixedArray(poolSize);
  this._newEntities = new FixedArray(poolSize);
  this._deadEntities = new FixedArray(poolSize);

  //
  if (opts.systems) {
    for (var i = 0; i < opts.systems.length; ++i) {
      var info = opts.systems[i];
      this$1.registerSystem(
        info.id,
        info.system,
        info.component,
        info.priority
      );
    }
  }
  this._sortSystems();
};

var prototypeAccessors$13 = { activeLevel: { configurable: true } };

/**
 * @property {Level}
 */
prototypeAccessors$13.activeLevel.get = function () {
  return this._activeLevel;
};

/**
 * @param {string} name
 * @param {class} cls
 * @param {object} opts
 * @param {boolean} opts.multiple
 * @param {Array} opts.requires
 */
Engine.prototype.registerClass = function registerClass (name, cls, opts) {
    if ( opts === void 0 ) opts = {};

  cls.__classname__ = name;
  cls.__multiple__ = opts.multiple;
  cls.__requires__ = opts.requires;

  this._classes[name] = cls;
};

/**
 * @param {string} name
 */
Engine.prototype.getClass = function getClass (name) {
  return this._classes[name];
};

/**
 * @param {function|object} clsOrInst
 */
Engine.prototype.getClassName = function getClassName (clsOrInst) {
  if (typeof clsOrInst === 'function') {
    return clsOrInst.__classname__;
  }

  return clsOrInst.constructor.__classname__;
};

/**
 * @param {string} name
 * @param {Level} level
 */
Engine.prototype.createEntity = function createEntity (name, level) {
    if ( level === void 0 ) level = null;

  var ent = new Entity(name);
  ent._engine = this;

  var lv = level || this._activeLevel;
  if (lv) {
    ent.setParent(lv);
    if (lv === this._activeLevel) {
      this._newEntities.push(ent);
    }
  }

  return ent;
};

/**
 * @param {Entity} ent
 */
Engine.prototype.cloneEntity = function cloneEntity (ent) {
    var this$1 = this;

  // clone & deepClone will mute the event and component callback
  return utils.clone(ent, Entity, function (newEnt, src) {
    newEnt._engine = this$1;
    newEnt._enabled = src._enabled;

    // clone components
    for (var i = 0; i < src._comps.length; ++i) {
      var comp = src._comps[i];

      // skip destroyed component
      if (comp._destroyed) {
        continue;
      }

      // create & clone the component
      var newComp = new comp.constructor();
      newComp._engine = this$1;
      newComp._entity = newEnt;
      newComp._enabled = comp._enabled;

      // invoke onInit
      if (newComp.onInit) {
        newComp.onInit();
      }

      // invoke onClone
      if (newComp.onClone) {
        newComp.onClone(comp);
      }

      // add component to entity
      newEnt._comps.push(newComp);
    }

    this$1._newEntities.push(newEnt);
  });
};

/**
 * @param {Entity} ent
 */
Engine.prototype.deepCloneEntity = function deepCloneEntity (ent) {
    var this$1 = this;

  // clone & deepClone will mute the event and component callback
  return utils.deepClone(ent, Entity, function (newEnt, src) {
    newEnt._engine = this$1;
    newEnt._enabled = src._enabled;

    // clone components
    for (var i = 0; i < src._comps.length; ++i) {
      var comp = src._comps[i];

      // skip destroyed component
      if (comp._destroyed) {
        continue;
      }

      // create & clone the component
      var newComp = new comp.constructor();
      newComp._engine = this$1;
      newComp._entity = newEnt;
      newComp._enabled = comp._enabled;

      // invoke onInit
      if (newComp.onInit) {
        newComp.onInit();
      }

      // invoke onClone
      if (newComp.onClone) {
        newComp.onClone(comp);
      }

      // add component to entity
      newEnt._comps.push(newComp);
    }

    this$1._newEntities.push(newEnt);
  });
};

/**
 * @param {Level} level
 */
Engine.prototype.loadLevel = function loadLevel (level) {
    var this$1 = this;

  if (this._activeLevel) {
    utils.walk(this._activeLevel, function (ent) {
      ent.destroy();
    });
  }

  this._activeLevel = level;

  utils.walk(level, function (ent) {
    this$1._newEntities.push(ent);
  });
};

/**
 *
 */
Engine.prototype.tick = function tick () {
    var this$1 = this;

  // tick all systems
  for (var i = 0; i < this._systems.length; ++i) {
    var sys = this$1._systems[i];
    sys.tick();
  }

  // post-tick all systems
  for (var i$1 = 0; i$1 < this._systems.length; ++i$1) {
    var sys$1 = this$1._systems[i$1];
    sys$1.postTick();
  }

  // collect new/dead components from new entities
  for (var i$2 = 0; i$2 < this._newEntities.length; ++i$2) {
    var ent = this$1._newEntities.data[i$2];

    // NOTE: dead entity need to invoke onDestroy for its components
    if (ent._destroyed) {
      for (var c = 0; c < ent._comps.length; ++c) {
        this$1._deadComponents.push(ent._comps[c]);
      }
    } else {
      for (var c$1 = 0; c$1 < ent._comps.length; ++c$1) {
        this$1._newComponents.push(ent._comps[c$1]);
      }
    }
  }

  // handle new components
  for (var i$3 = 0; i$3 < this._newComponents.length; ++i$3) {
    var comp = this$1._newComponents.data[i$3];
    this$1._systemAddComp(comp);
  }

  // handle dead components
  for (var i$4 = 0; i$4 < this._deadComponents.length; ++i$4) {
    var comp$1 = this$1._deadComponents.data[i$4];

    // no need to remove comp from entity if it is destroyed
    if (comp$1._entity._destroyed === false) {
      comp$1._entity._removeComp(comp$1);
    }

    // if an entity is not ready, it never add its components to system
    if (comp$1._entity._ready) {
      this$1._systemRemoveComp(comp$1);
    }

    if (comp$1.onDestroy) {
      comp$1.onDestroy();
    }

    // de-reference
    comp$1._entity = null;
    comp$1._engine = null;
  }

  // handle new entities
  for (var i$5 = 0; i$5 < this._newEntities.length; ++i$5) {
    var ent$1 = this$1._newEntities.data[i$5];

    // skip dead entity
    if (ent$1._destroyed) {
      continue;
    }

    ent$1._poolID = this$1._entities.length;
    ent$1._ready = true;

    // manage it
    this$1._entities.push(ent$1);

    // emit ready event
    ent$1.emit('ready');

    // emit enable event and trigger cmoponents' onEnable callback
    if (ent$1.enabledInHierarchy) {
      _emitEnableChanged(ent$1, true);
    }
  }

  // handle dead entities
  for (var i$6 = 0; i$6 < this._deadEntities.length; ++i$6) {
    var ent$2 = this$1._deadEntities.data[i$6];

    // emit destroy event
    ent$2.emit('destroy');

    // removed from parent
    if (ent$2._parent && ent$2._parent._destroyed === false) {
      ent$2.setParent(null);
    }

    // unmanage it
    var lastEnt = this$1._entities.data[this$1._entities.length - 1];
    this$1._entities.fastRemove(ent$2._poolID);
    lastEnt._poolID = ent$2._poolID;

    // de-reference
    ent$2._poolID = -1;
    ent$2._engine = null;
    ent$2._parent = null;
    ent$2._children.length = 0;
    ent$2._comps.length = 0;
  }

  // reset pool
  this._newComponents.reset();
  this._deadComponents.reset();
  this._newEntities.reset();
  this._deadEntities.reset();
};

/**
 * @param {string} id
 * @param {string} systemCls
 * @param {string} compClsName
 * @param {number} priority
 */
Engine.prototype.registerSystem = function registerSystem (id, systemCls, compClsName, priority) {
    if ( priority === void 0 ) priority = 0;

  var sys = new systemCls();

  sys._id = id;
  sys._engine = this;
  sys._priority = priority;
  sys._compClass = this.getClass(compClsName);
  if (!sys._compClass) {
    console.warn(("Failed to get class " + compClsName + ", please register it first."));
  }

  sys.finalize();

  this._systems.push(sys);

  return sys;
};

/**
 * @param {string} id
 */
Engine.prototype.getSystem = function getSystem (id) {
    var this$1 = this;

  for (var i = 0; i < this._systems.length; ++i) {
    var sys = this$1._systems[i];
    if (sys.id === id) {
      return sys;
    }
  }

  return null;
};

// ====================
// internal
// ====================

Engine.prototype._destroyEntity = function _destroyEntity (ent) {
  // emit disable
  if (ent.enabledInHierarchy) {
    ent.emit('disable');
  }

  this._deadEntities.push(ent);
};

Engine.prototype._notifyEnableChanged = function _notifyEnableChanged (ent, enabled) {
  // emit event and trigger cmoponents' onEnable/onDisble callback at root
  _emitEnableChanged(ent, enabled);

  // recursively emit event trigger cmoponents' onEnable/onDisble callback in children
  utils.walk(ent, function (n) {
    if (n._enabled) {
      _emitEnableChanged(n, enabled);
      return true;
    }

    return false;
  });
};

Engine.prototype._createComp = function _createComp (ctor, ent) {
  var comp = new ctor();
  comp._engine = this;
  comp._entity = ent;

  // invoke onInit
  if (comp.onInit) {
    comp.onInit();
  }

  // invoke onEnable
  if (comp.onEnable && ent._ready && ent.enabledInHierarchy ) {
    comp.onEnable();
  }

  //
  if (ent._ready) {
    this._newComponents.push(comp);
  }

  return comp;
};

Engine.prototype._destroyComp = function _destroyComp (comp) {
  var ent = comp._entity;

  // invoke onDisable
  if (comp.onDisable && ent._ready && ent.enabledInHierarchy) {
    comp.onDisable();
  }

  //
  if (ent._ready) {
    this._deadComponents.push(comp);
  }
};

Engine.prototype._sortSystems = function _sortSystems () {
  this._systems.sort(function (a, b) {
    return a._priority - b._priority;
  });
};

Engine.prototype._systemAddComp = function _systemAddComp (comp) {
    var this$1 = this;

  for (var i = 0; i < this._systems.length; ++i) {
    var sys = this$1._systems[i];
    if (comp instanceof sys._compClass) {
      sys.add(comp);
    }
  }
};

Engine.prototype._systemRemoveComp = function _systemRemoveComp (comp) {
    var this$1 = this;

  for (var i = 0; i < this._systems.length; ++i) {
    var sys = this$1._systems[i];
    if (comp instanceof sys._compClass) {
      sys.remove(comp);
    }
  }
};

Object.defineProperties( Engine.prototype, prototypeAccessors$13 );

/**
 * @param {Array} indices
 */
function wireframe(indices) {
  var offsets = [[0, 1], [1, 2], [2, 0]];
  var lines = [];
  var lineIDs = {};

  for (var i = 0; i < indices.length; i += 3) {
    for (var k = 0; k < 3; ++k) {
      var i1 = indices[i + offsets[k][0]];
      var i2 = indices[i + offsets[k][1]];

      // check if we already have the line in our lines
      var id = (i1 > i2) ? ((i2 << 16) | i1) : ((i1 << 16) | i2);
      if (lineIDs[id] === undefined) {
        lineIDs[id] = 0;
        lines.push(i1, i2);
      }
    }
  }

  return lines;
}

/**
 * @param {Array} positions
 * @param {Array} normals
 * @param {Number} length
 */
function normals(positions, normals, length) {
  if ( length === void 0 ) length = 1;

  var verts = new Array(2 * positions.length);

  for (var i = 0; i < positions.length/3; ++i) {
    var i3 = 3*i;
    var i6 = 6*i;

    // line start
    verts[i6 + 0] = positions[i3 + 0];
    verts[i6 + 1] = positions[i3 + 1];
    verts[i6 + 2] = positions[i3 + 2];

    // line end
    verts[i6 + 3] = positions[i3 + 0] + normals[i3 + 0] * length;
    verts[i6 + 4] = positions[i3 + 1] + normals[i3 + 1] * length;
    verts[i6 + 5] = positions[i3 + 2] + normals[i3 + 2] * length;
  }

  return verts;
}

var temp1 = vec3.create();
var temp2 = vec3.create();
var temp3 = vec3.create();
var r = vec3.create();
var c0 = vec3.create();
var c1 = vec3.create();
var c2 = vec3.create();
var c3 = vec3.create();
var c4 = vec3.create();
var c5 = vec3.create();
var c6 = vec3.create();
var c7 = vec3.create();

/**
 * @param {Number} width
 * @param {Number} height
 * @param {Number} length
 * @param {Object} opts
 * @param {Number} opts.widthSegments
 * @param {Number} opts.heightSegments
 * @param {Number} opts.lengthSegments
 */
var box = function (width, height, length, opts) {
  if ( opts === void 0 ) opts = {};

  var ws = opts.widthSegments !== undefined ? opts.widthSegments : 1;
  var hs = opts.heightSegments !== undefined ? opts.heightSegments : 1;
  var ls = opts.lengthSegments !== undefined ? opts.lengthSegments : 1;

  var hw = width * 0.5;
  var hh = height * 0.5;
  var hl = length * 0.5;

  var corners = [
    vec3.set(c0, -hw, -hh,  hl),
    vec3.set(c1,  hw, -hh,  hl),
    vec3.set(c2,  hw,  hh,  hl),
    vec3.set(c3, -hw,  hh,  hl),
    vec3.set(c4,  hw, -hh, -hl),
    vec3.set(c5, -hw, -hh, -hl),
    vec3.set(c6, -hw,  hh, -hl),
    vec3.set(c7,  hw,  hh, -hl) ];

  var faceAxes = [
    [ 0, 1, 3 ], // FRONT
    [ 4, 5, 7 ], // BACK
    [ 3, 2, 6 ], // TOP
    [ 1, 0, 4 ], // BOTTOM
    [ 1, 4, 2 ], // RIGHT
    [ 5, 0, 6 ]  // LEFT
  ];

  var faceNormals = [
    [  0,  0,  1 ], // FRONT
    [  0,  0, -1 ], // BACK
    [  0,  1,  0 ], // TOP
    [  0, -1,  0 ], // BOTTOM
    [  1,  0,  0 ], // RIGHT
    [ -1,  0,  0 ]  // LEFT
  ];

  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];

  function _buildPlane (side, uSegments, vSegments) {
    var u, v;
    var ix, iy;
    var offset = positions.length / 3;
    var faceAxe = faceAxes[side];
    var faceNormal = faceNormals[side];

    for (iy = 0; iy <= vSegments; iy++) {
      for (ix = 0; ix <= uSegments; ix++) {
        u = ix / uSegments;
        v = iy / vSegments;

        vec3.lerp(temp1, corners[faceAxe[0]], corners[faceAxe[1]], u);
        vec3.lerp(temp2, corners[faceAxe[0]], corners[faceAxe[2]], v);
        vec3.sub(temp3, temp2, corners[faceAxe[0]]);
        vec3.add(r, temp1, temp3);

        positions.push(r.x, r.y, r.z);
        normals.push(faceNormal[0], faceNormal[1], faceNormal[2]);
        uvs.push(u, v);

        if ((ix < uSegments) && (iy < vSegments)) {
          var useg1 = uSegments + 1;
          var a = ix + iy * useg1;
          var b = ix + (iy + 1) * useg1;
          var c = (ix + 1) + (iy + 1) * useg1;
          var d = (ix + 1) + iy * useg1;

          indices.push(offset + a, offset + d, offset + b);
          indices.push(offset + d, offset + c, offset + b);
        }
      }
    }
  }

  _buildPlane(0, ws, hs); // FRONT
  _buildPlane(4, ls, hs); // RIGHT
  _buildPlane(1, ws, hs); // BACK
  _buildPlane(5, ls, hs); // LEFT
  _buildPlane(3, ws, ls); // BOTTOM
  _buildPlane(2, ws, ls); // TOP

  return {
    positions: positions,
    normals: normals,
    uvs: uvs,
    indices: indices,
  };
};

var temp1$1 = vec3.create();
var temp2$1 = vec3.create();

/**
 * @param {Number} radiusTop
 * @param {Number} radiusBottom
 * @param {Number} height
 * @param {Object} opts
 * @param {Number} opts.radialSegments
 * @param {Number} opts.heightSegments
 * @param {Boolean} opts.capped
 * @param {Number} opts.arc
 */
var cylinder = function (radiusTop, radiusBottom, height, opts) {
  if ( radiusTop === void 0 ) radiusTop = 0.5;
  if ( radiusBottom === void 0 ) radiusBottom = 0.5;
  if ( height === void 0 ) height = 1;
  if ( opts === void 0 ) opts = {};

  var halfHeight = height * 0.5;
  var radialSegments = opts.radialSegments || 8;
  var heightSegments = opts.heightSegments || 1;
  var capped = opts.capped !== undefined ? opts.capped : true;
  var arc = opts.arc || 2.0 * Math.PI;

  var cntCap = 0;
  if (!capped) {
    if (radiusTop > 0) {
      cntCap++;
    }

    if (radiusBottom > 0) {
      cntCap++;
    }
  }

  // calculate vertex count
  var vertCount = (radialSegments + 1) * (heightSegments + 1);
  if (capped) {
    vertCount += ((radialSegments + 1) * cntCap) + (radialSegments * cntCap);
  }

  // calculate index count
  var indexCount = radialSegments * heightSegments * 2 * 3;
  if (capped) {
    indexCount += radialSegments * cntCap * 3;
  }

  var indices = new Array(indexCount);
  var positions = new Array(vertCount * 3);
  var normals = new Array(vertCount * 3);
  var uvs = new Array(vertCount * 2);

  var index = 0;
  var indexOffset = 0;

  generateTorso();

  if (capped) {
    if (radiusBottom > 0) {
      generateCap(false);
    }

    if (radiusTop > 0) {
      generateCap(true);
    }
  }

  return {
    positions: positions,
    normals: normals,
    uvs: uvs,
    indices: indices,
  };

  // =======================
  // internal fucntions
  // =======================

  function generateTorso() {
    var indexArray = [];

    // this will be used to calculate the normal
    var slope = (radiusTop - radiusBottom) / height;

    // generate positions, normals and uvs
    for (var y = 0; y <= heightSegments; y++) {
      var indexRow = [];
      var v = y / heightSegments;

      // calculate the radius of the current row
      var radius = v * (radiusTop - radiusBottom) + radiusBottom;

      for (var x = 0; x <= radialSegments; ++x) {
        var u = x / radialSegments;
        var theta = u * arc;

        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        // vertex
        positions[3 * index] = radius * sinTheta;
        positions[3 * index + 1] = v * height - halfHeight;
        positions[3 * index + 2] = radius * cosTheta;

        // normal
        vec3.normalize(temp1$1, vec3.set(temp2$1, sinTheta, -slope, cosTheta));
        normals[3 * index] = temp1$1.x;
        normals[3 * index + 1] = temp1$1.y;
        normals[3 * index + 2] = temp1$1.z;

        // uv
        uvs[2 * index] = u;
        uvs[2 * index + 1] = v;

        // save index of vertex in respective row
        indexRow.push(index);

        // increase index
        ++index;
      }

      // now save positions of the row in our index array
      indexArray.push(indexRow);
    }

    // generate indices
    for (var y$1 = 0; y$1 < heightSegments; ++y$1) {
      for (var x$1 = 0; x$1 < radialSegments; ++x$1) {
        // we use the index array to access the correct indices
        var i1 = indexArray[y$1][x$1];
        var i2 = indexArray[y$1 + 1][x$1];
        var i3 = indexArray[y$1 + 1][x$1 + 1];
        var i4 = indexArray[y$1][x$1 + 1];

        // face one
        indices[indexOffset] = i1; ++indexOffset;
        indices[indexOffset] = i4; ++indexOffset;
        indices[indexOffset] = i2; ++indexOffset;

        // face two
        indices[indexOffset] = i4; ++indexOffset;
        indices[indexOffset] = i3; ++indexOffset;
        indices[indexOffset] = i2; ++indexOffset;
      }
    }
  }

  function generateCap(top) {
    var centerIndexStart, centerIndexEnd;

    var radius = top ? radiusTop : radiusBottom;
    var sign = top ? 1 : - 1;

    // save the index of the first center vertex
    centerIndexStart = index;

    // first we generate the center vertex data of the cap.
    // because the geometry needs one set of uvs per face,
    // we must generate a center vertex per face/segment

    for (var x = 1; x <= radialSegments; ++x) {
      // vertex
      positions[3 * index] = 0;
      positions[3 * index + 1] = halfHeight * sign;
      positions[3 * index + 2] = 0;

      // normal
      normals[3 * index] = 0;
      normals[3 * index + 1] = sign;
      normals[3 * index + 2] = 0;

      // uv
      uvs[2 * index] = 0.5;
      uvs[2 * index + 1] = 0.5;

      // increase index
      ++index;
    }

    // save the index of the last center vertex
    centerIndexEnd = index;

    // now we generate the surrounding positions, normals and uvs

    for (var x$1 = 0; x$1 <= radialSegments; ++x$1) {
      var u = x$1 / radialSegments;
      var theta = u * arc;

      var cosTheta = Math.cos(theta);
      var sinTheta = Math.sin(theta);

      // vertex
      positions[3 * index] = radius * sinTheta;
      positions[3 * index + 1] = halfHeight * sign;
      positions[3 * index + 2] = radius * cosTheta;

      // normal
      normals[3 * index] = 0;
      normals[3 * index + 1] = sign;
      normals[3 * index + 2] = 0;

      // uv
      uvs[2 * index] = 0.5 - (cosTheta * 0.5);
      uvs[2 * index + 1] = (sinTheta * 0.5 * sign) + 0.5;

      // increase index
      ++index;
    }

    // generate indices

    for (var x$2 = 0; x$2 < radialSegments; ++x$2) {
      var c = centerIndexStart + x$2;
      var i = centerIndexEnd + x$2;

      if (top) {
        // face top
        indices[indexOffset] = i + 1; ++indexOffset;
        indices[indexOffset] = c;     ++indexOffset;
        indices[indexOffset] = i;     ++indexOffset;
      } else {
        // face bottom
        indices[indexOffset] = c;     ++indexOffset;
        indices[indexOffset] = i + 1; ++indexOffset;
        indices[indexOffset] = i;     ++indexOffset;
      }
    }
  }
};

/**
 * @param {Number} radius
 * @param {Number} height
 * @param {Object} opts
 * @param {Number} opts.radialSegments
 * @param {Number} opts.heightSegments
 * @param {Boolean} opts.capped
 * @param {Number} opts.arc
 */
var cone = function (radius, height, opts) {
  if ( radius === void 0 ) radius = 0.5;
  if ( height === void 0 ) height = 1;
  if ( opts === void 0 ) opts = {};

  return cylinder(0, radius, height, opts);
};

var temp1$2 = vec3.create();
var temp2$2 = vec3.create();
var temp3$1 = vec3.create();
var r$1 = vec3.create();
var c00 = vec3.create();
var c10 = vec3.create();
var c01 = vec3.create();

/**
 * @param {Number} width
 * @param {Number} length
 * @param {Object} opts
 * @param {Number} opts.widthSegments
 * @param {Number} opts.lengthSegments
 */
var plane = function (width, length, opts) {
  if ( opts === void 0 ) opts = {};

  var uSegments = opts.widthSegments !== undefined ? opts.widthSegments : 5;
  var vSegments = opts.lengthSegments !== undefined ? opts.lengthSegments : 5;

  var hw = width * 0.5;
  var hl = length * 0.5;

  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];

  vec3.set(c00, -hw, 0,  hl);
  vec3.set(c10,  hw, 0,  hl);
  vec3.set(c01, -hw, 0, -hl);

  for (var y = 0; y <= vSegments; y++) {
    for (var x = 0; x <= uSegments; x++) {
      var u = x / uSegments;
      var v = y / vSegments;

      vec3.lerp(temp1$2, c00, c10, u);
      vec3.lerp(temp2$2, c00, c01, v);
      vec3.sub(temp3$1, temp2$2, c00);
      vec3.add(r$1, temp1$2, temp3$1);

      positions.push(r$1.x, r$1.y, r$1.z);
      normals.push(0, 1, 0);
      uvs.push(u, v);

      if ((x < uSegments) && (y < vSegments)) {
        var useg1 = uSegments + 1;
        var a = x + y * useg1;
        var b = x + (y + 1) * useg1;
        var c = (x + 1) + (y + 1) * useg1;
        var d = (x + 1) + y * useg1;

        indices.push(a, d, b);
        indices.push(d, c, b);
      }
    }
  }

  return {
    positions: positions,
    normals: normals,
    uvs: uvs,
    indices: indices,
  };
};

var positions = [
  -0.5, -0.5, 0, // bottom-left
  -0.5,  0.5, 0, // top-left
   0.5,  0.5, 0, // top-right
   0.5, -0.5, 0 ];

var normals$1 = [
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1 ];

var uvs = [
  0, 0,
  0, 1,
  1, 1,
  1, 0 ];

var indices = [
  0, 3, 1,
  3, 2, 1
];

var quad = function () {
  return {
    positions: positions,
    indices: indices,
    normals: normals$1,
    uvs: uvs,
  };
};

/**
 * @param {Number} radius
 * @param {Object} opts
 * @param {Number} opts.segments
 */
var sphere = function (radius, opts) {
  if ( radius === void 0 ) radius = 1;
  if ( opts === void 0 ) opts = {};

  var segments = opts.segments !== undefined ? opts.segments : 16;

  // lat === latitude
  // lon === longitude

  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];

  for (var lat = 0; lat <= segments; ++lat) {
    var theta = lat * Math.PI / segments;
    var sinTheta = Math.sin(theta);
    var cosTheta = -Math.cos(theta);

    for (var lon = 0; lon <= segments; ++lon) {
      var phi = lon * 2 * Math.PI / segments - Math.PI / 2.0;
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);

      var x = sinPhi * sinTheta;
      var y = cosTheta;
      var z = cosPhi * sinTheta;
      var u = lon / segments;
      var v = lat / segments;

      positions.push(x * radius, y * radius, z * radius);
      normals.push(x, y, z);
      uvs.push(u, v);


      if ((lat < segments) && (lon < segments)) {
        var seg1 = segments + 1;
        var a = seg1 * lat + lon;
        var b = seg1 * (lat + 1) + lon;
        var c = seg1 * (lat + 1) + lon + 1;
        var d = seg1 * lat + lon + 1;

        indices.push(a, d, b);
        indices.push(d, c, b);
      }
    }
  }

  return {
    positions: positions,
    indices: indices,
    normals: normals,
    uvs: uvs
  };
};

/**
 * @param {Number} radius
 * @param {Number} tube
 * @param {Object} opts
 * @param {Number} opts.radialSegments
 * @param {Number} opts.tubularSegments
 * @param {Number} opts.arc
 */
var torus = function (radius, tube, opts) {
  if ( radius === void 0 ) radius = 0.5;
  if ( tube === void 0 ) tube = 0.2;
  if ( opts === void 0 ) opts = {};

  var radialSegments = opts.radialSegments || 30;
  var tubularSegments = opts.tubularSegments || 20;
  var arc = opts.arc || 2.0 * Math.PI;

  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];

  for (var j = 0; j <= radialSegments; j++) {
    for (var i = 0; i <= tubularSegments; i++) {
      var u = i / tubularSegments;
      var v = j / radialSegments;

      var u1 = u * arc;
      var v1 = v * Math.PI * 2;

      // vertex
      var x = (radius + tube * Math.cos(v1)) * Math.sin(u1);
      var y = tube * Math.sin(v1);
      var z = (radius + tube * Math.cos(v1)) * Math.cos(u1);

      // this vector is used to calculate the normal
      var nx = Math.sin(u1) * Math.cos(v1);
      var ny = Math.sin(v1);
      var nz = Math.cos(u1) * Math.cos(v1);

      positions.push(x, y, z);
      normals.push(nx, ny, nz);
      uvs.push(u, v);

      if ((i < tubularSegments) && (j < radialSegments)) {
        var seg1 = tubularSegments + 1;
        var a = seg1 * j + i;
        var b = seg1 * (j + 1) + i;
        var c = seg1 * (j + 1) + i + 1;
        var d = seg1 * j + i + 1;

        indices.push(a, d, b);
        indices.push(d, c, b);
      }
    }
  }

  return {
    positions: positions,
    normals: normals,
    uvs: uvs,
    indices: indices,
  };
};



var primitives = Object.freeze({
	box: box,
	cone: cone,
	cylinder: cylinder,
	plane: plane,
	quad: quad,
	sphere: sphere,
	torus: torus,
	wireframe: wireframe,
	normals: normals
});

var _m4_tmp$3 = mat4.create();

var SkinningModel = (function (superclass) {
  function SkinningModel() {
    superclass.call(this);

    // set from skinning
    this._jointIndices = null;
    this._bindposes = null;

    // cloned from skinning
    this._skeleton = null;

    // caches
    this._jointsTexture = null;
    this._data = null;
    this._updateOpts = null;
  }

  if ( superclass ) SkinningModel.__proto__ = superclass;
  SkinningModel.prototype = Object.create( superclass && superclass.prototype );
  SkinningModel.prototype.constructor = SkinningModel;

  SkinningModel.prototype.setSkinning = function setSkinning (skinning) {
    this._jointIndices = skinning.jointIndices;
    this._bindposes = skinning.bindposes;
  };

  SkinningModel.prototype.setSkeleton = function setSkeleton (skeleton) {
    this._skeleton = skeleton;
  };

  SkinningModel.prototype.setJointsTexture = function setJointsTexture (texture) {
    if ( this._jointsTexture ) {
      this._jointsTexture.destroy();
    }

    this._jointsTexture = texture;

    if (this._jointsTexture) {
      this._updateCaches();
    }
  };

  SkinningModel.prototype.destroy = function destroy () {
    if (this._jointsTexture) {
      this._jointsTexture.destroy();
    }
  };

  SkinningModel.prototype._updateCaches = function _updateCaches () {
    var texture = this._jointsTexture;

    // resize data
    this._data = new Float32Array(texture._width * texture._height * 4);

    // update texture opts
    this._updateOpts = {
      x: 0,
      y: 0,
      width: texture._width,
      height: texture._height,
      level: 0,
      image: this._data,
    };
  };

  SkinningModel.prototype.updateMatrices = function updateMatrices () {
    var this$1 = this;

    var texture = this._jointsTexture;

    for (var i = 0; i < this._jointIndices.length; ++i) {
      var bindpose = this$1._bindposes[i];
      var idx = this$1._jointIndices[i];

      var worldMatrix = this$1._skeleton.getWorldMatrix(idx);
      mat4.multiply(_m4_tmp$3, worldMatrix, bindpose);

      this$1._data[16 * i + 0]  = _m4_tmp$3.m00;
      this$1._data[16 * i + 1]  = _m4_tmp$3.m01;
      this$1._data[16 * i + 2]  = _m4_tmp$3.m02;
      this$1._data[16 * i + 3]  = _m4_tmp$3.m03;
      this$1._data[16 * i + 4]  = _m4_tmp$3.m04;
      this$1._data[16 * i + 5]  = _m4_tmp$3.m05;
      this$1._data[16 * i + 6]  = _m4_tmp$3.m06;
      this$1._data[16 * i + 7]  = _m4_tmp$3.m07;
      this$1._data[16 * i + 8]  = _m4_tmp$3.m08;
      this$1._data[16 * i + 9]  = _m4_tmp$3.m09;
      this$1._data[16 * i + 10] = _m4_tmp$3.m10;
      this$1._data[16 * i + 11] = _m4_tmp$3.m11;
      this$1._data[16 * i + 12] = _m4_tmp$3.m12;
      this$1._data[16 * i + 13] = _m4_tmp$3.m13;
      this$1._data[16 * i + 14] = _m4_tmp$3.m14;
      this$1._data[16 * i + 15] = _m4_tmp$3.m15;
    }

    texture.updateSubImage(this._updateOpts);
  };

  return SkinningModel;
}(renderer.Model));

var LinesModel = (function (superclass) {
  function LinesModel() {
    superclass.call(this);

    this._dynamicIA = true;
    this.lines = new RecyclePool(function () {
      return {
        start: vec3.create(),
        end: vec3.create(),
        color: color3.create(),
        normal: vec3.create(),
      };
    }, 2000);
  }

  if ( superclass ) LinesModel.__proto__ = superclass;
  LinesModel.prototype = Object.create( superclass && superclass.prototype );
  LinesModel.prototype.constructor = LinesModel;

  LinesModel.prototype.addLine = function addLine (start, end, color, normal) {
    var line = this.lines.add();

    vec3.copy(line.start, start);
    vec3.copy(line.end, end);

    if (color) {
      color3.copy(line.color, color);
    }

    if (normal) {
      vec3.copy(line.normal, normal);
    }

    return line;
  };

  LinesModel.prototype.clear = function clear () {
    this.lines.reset();
  };

  return LinesModel;
}(renderer.Model));

//import GaussianBlur from './gaussian-blur';

var MAX_LINE_VERTS = 2000;

var _camPos = vec3.create();
var _camFwd = vec3.create();
var _v3_tmp1 = vec3.create();

var _a16_view = new Float32Array(16);
var _a16_proj = new Float32Array(16);
var _a16_viewProj = new Float32Array(16);
var _a16_lightViewProj = new Float32Array(16);
var _a3_camPos = new Float32Array(3);

var _lightOptions = [
  [],
  [{ id: 0 }],
  [{ id: 0 }, { id: 1 }],
  [{ id: 0 }, { id: 1 }, { id: 2 }],
  [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }] ];

var _lineData = new Float32Array(2000 * 6);

var ForwardRenderer = (function (superclass) {
  function ForwardRenderer(device, builtin) {
    superclass.call(this, device, builtin);
    this._directionalLights = [];
    this._pointLights = [];
    this._spotLights = [];
    this._shadowLights = [];
    this._sceneAmbient = new Float32Array([0.5, 0.5, 0.5]);

    this._registerStage('shadowcast', this._shadowStage.bind(this));
    this._registerStage('opaque', this._opaqueStage.bind(this));
    this._registerStage('transparent', this._transparentStage.bind(this));
    this._registerStage('2d', this._2dStage.bind(this));

    //this._blur = new GaussianBlur(device, this._programLib);

    this._lineIAs = new CircularPool(function () {
      return new renderer.InputAssembler(
        new gfx.VertexBuffer(
          device,
          new gfx.VertexFormat([
            { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
            { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_FLOAT32, num: 3 }
          ]),
          gfx.USAGE_DYNAMIC,
          _lineData,
          MAX_LINE_VERTS
        ),
        null,
        gfx.PT_LINES
      );
    }, 2);
  }

  if ( superclass ) ForwardRenderer.__proto__ = superclass;
  ForwardRenderer.prototype = Object.create( superclass && superclass.prototype );
  ForwardRenderer.prototype.constructor = ForwardRenderer;

  ForwardRenderer.prototype.updateLights = function updateLights (scene) {
    var this$1 = this;

    this._directionalLights.length = 0;
    this._pointLights.length = 0;
    this._spotLights.length = 0;
    this._shadowLights.length = 0;
    var lights = scene._lights;
    for (var i = 0; i < lights.length; ++i) {
      var light = lights.data[i];
      light.update(this$1._device);
      if (light.shadowType !== renderer.SHADOW_NONE) {
        this$1._shadowLights.push(light);
        var view = this$1._requestView();
        light.extractView(view, ['shadowcast']);
      }
      if (light._type === renderer.LIGHT_DIRECTIONAL) {
        this$1._directionalLights.push(light);
      } else if (light._type === renderer.LIGHT_POINT) {
        this$1._pointLights.push(light);
      } else {
        this$1._spotLights.push(light);
      }
    }
  };

  ForwardRenderer.prototype.render = function render (scene) {
    var this$1 = this;

    this._reset();

    // extract views from cameras, lights and so on
    var canvas = this._device._gl.canvas;

    // update lights, extract shadow view.
    this.updateLights(scene);

    if (scene._debugCamera) {
      var view = this._requestView();
      scene._debugCamera.extractView(view, canvas.width, canvas.height);
    } else {
      for (var i = 0; i < scene._cameras.length; ++i) {
        var view$1 = this$1._requestView();
        scene._cameras.data[i].extractView(view$1, canvas.width, canvas.height);
      }
    }

    // render by cameras
    for (var i$1 = 0; i$1 < this._viewPools.length; ++i$1) {
      var view$2 = this$1._viewPools.data[i$1];
      this$1._render(view$2, scene);
    }

    // render by views
    for (var i$2 = 0; i$2 < scene._views.length; ++i$2) {
      var view$3 = scene._views[i$2];
      this$1._render(view$3, scene);
    }
  };

  ForwardRenderer.prototype._submitLightUniforms = function _submitLightUniforms () {
    var this$1 = this;

    this._device.setUniform('sceneAmbient', this._sceneAmbient);

    if (this._directionalLights.length > 0) {
      for (var index = 0; index < this._directionalLights.length; ++index) {
        var light = this$1._directionalLights[index];
        this$1._device.setUniform(("dir_light" + index + "_direction"), light._directionUniform);
        this$1._device.setUniform(("dir_light" + index + "_color"), light._colorUniform);
      }
    }
    if (this._pointLights.length > 0) {
      for (var index$1 = 0; index$1 < this._pointLights.length; ++index$1) {
        var light$1 = this$1._pointLights[index$1];
        this$1._device.setUniform(("point_light" + index$1 + "_position"), light$1._positionUniform);
        this$1._device.setUniform(("point_light" + index$1 + "_color"), light$1._colorUniform);
        this$1._device.setUniform(("point_light" + index$1 + "_range"), light$1._range);
      }
    }

    if (this._spotLights.length > 0) {
      for (var index$2 = 0; index$2 < this._spotLights.length; ++index$2) {
        var light$2 = this$1._spotLights[index$2];
        this$1._device.setUniform(("spot_light" + index$2 + "_position"), light$2._positionUniform);
        this$1._device.setUniform(("spot_light" + index$2 + "_direction"), light$2._directionUniform);
        this$1._device.setUniform(("spot_light" + index$2 + "_color"), light$2._colorUniform);
        this$1._device.setUniform(("spot_light" + index$2 + "_range"), light$2._range);
        this$1._device.setUniform(("spot_light" + index$2 + "_spot"), light$2._spotUniform);
      }
    }
  };

  ForwardRenderer.prototype._submitShadowStageUniforms = function _submitShadowStageUniforms (view) {
    var light = view._shadowLight;
    this._device.setUniform('minDepth', light.shadowMinDepth);
    this._device.setUniform('maxDepth', light.shadowMaxDepth);
    this._device.setUniform('bias', light.shadowBias);
    this._device.setUniform('depthScale', light.shadowDepthScale);
  };

  ForwardRenderer.prototype._submitOtherStagesUniforms = function _submitOtherStagesUniforms () {
    var this$1 = this;

    for (var index = 0; index < this._shadowLights.length; ++index) {
      var light = this$1._shadowLights[index];
      this$1._device.setUniform(("lightViewProjMatrix_" + index), mat4.array(_a16_lightViewProj, light.viewProjMatrix));
      this$1._device.setUniform(("minDepth_" + index), light.shadowMinDepth);
      this$1._device.setUniform(("maxDepth_" + index), light.shadowMaxDepth);
      this$1._device.setUniform(("bias_" + index), light.shadowBias);
      this$1._device.setUniform(("depthScale_" + index), light.shadowDepthScale);
      this$1._device.setUniform(("darkness_" + index), light.shadowDarkness);
      this$1._device.setUniform(("frustumEdgeFalloff_" + index), light.frustumEdgeFalloff);
      this$1._device.setUniform(("texelSize_" + index), new Float32Array([1.0 / light.shadowResolution, 1.0 / light.shadowResolution]));
    }
  };

  ForwardRenderer.prototype._updateShaderOptions = function _updateShaderOptions (items) {
    var this$1 = this;

    for (var i = 0; i < items.length; ++i) {
      var item = items.data[i];
      var model = item.model;
      var options = item.options;

      options.directionalLightSlots = _lightOptions[Math.min(4, this$1._directionalLights.length)];
      options.pointLightSlots = _lightOptions[Math.min(4, this$1._pointLights.length)];
      options.spotLightSlots = _lightOptions[Math.min(4, this$1._spotLights.length)];

      options.shadowLightSlots = _lightOptions[Math.min(4, this$1._shadowLights.length)];

      if (model instanceof SkinningModel) {
        model.updateMatrices();
        options.useSkinning = true;
      } else {
        options.useSkinning = false;
      }
    }
  };

  ForwardRenderer.prototype._draw = function _draw (item) {
    var model = item.model;

    if (model instanceof SkinningModel) {
      this._device.setTexture('u_jointsTexture', model._jointsTexture, this._allocTextuerUnit());
      this._device.setUniform('u_jointsTextureSize', model._jointsTexture._width);
    }

    superclass.prototype._draw.call(this, item);
  };

  ForwardRenderer.prototype._2dStage = function _2dStage (view, items) {
    var this$1 = this;

    // update uniforms
    this._device.setUniform('view', mat4.array(_a16_view, view._matView));
    this._device.setUniform('proj', mat4.array(_a16_proj, view._matProj));
    this._device.setUniform('viewProj', mat4.array(_a16_viewProj, view._matViewProj));

    // sort items
    items.sort(function (a, b) {
      return a.model.sortKey - b.model.sortKey;
    });

    // draw it
    for (var i = 0; i < items.length; ++i) {
      var item = items.data[i];

      if (item.model.dynamicIA) {
        this$1._drawDynamic(item);
      } else {
        this$1._draw(item);
      }
    }
  };

  ForwardRenderer.prototype._shadowStage = function _shadowStage (view, items) {
    var this$1 = this;

    var programLib = this._programLib;
    this._device.setUniform('lightViewProjMatrix', mat4.array(_a16_viewProj, view._matViewProj));

    // update rendering
    this._submitLightUniforms();
    this._submitShadowStageUniforms(view);
    this._updateShaderOptions(items);

    // calculate sorting key
    for (var i = 0; i < items.length; ++i) {
      var item = items.data[i];
      item.sortKey = programLib.getKey(
        item.technique._passes[0]._programName,
        item.options
      );
    }

    // sort items
    items.sort(function (a, b) {
      var techA = a.technique;
      var techB = b.technique;

      if (techA._layer !== techB._layer) {
        return techA._layer - techB._layer;
      }

      if (techA._passes.length !== techB._passes.length) {
        return techA._passes.length - techB._passes.length;
      }

      return a.sortKey - b.sortKey;
    });

    // draw it
    for (var i$1 = 0; i$1 < items.length; ++i$1) {
      var item$1 = items.data[i$1];

      if (item$1.model.dynamicIA) {
        this$1._drawDynamic(item$1);
      } else {
        this$1._draw(item$1);
      }
    }

  };

  ForwardRenderer.prototype._opaqueStage = function _opaqueStage (view, items) {
    var this$1 = this;

    var programLib = this._programLib;
    view.getPosition(_camPos);

    // update uniforms
    this._device.setUniform('view', mat4.array(_a16_view, view._matView));
    this._device.setUniform('proj', mat4.array(_a16_proj, view._matProj));
    this._device.setUniform('viewProj', mat4.array(_a16_viewProj, view._matViewProj));
    this._device.setUniform('eye', vec3.array(_a3_camPos, _camPos));

    // update rendering
    this._submitLightUniforms();
    this._submitOtherStagesUniforms();
    this._updateShaderOptions(items);

    // calculate sorting key
    for (var i = 0; i < items.length; ++i) {
      var item = items.data[i];
      item.sortKey = programLib.getKey(
        item.technique._passes[0]._programName,
        item.options
      );
    }

    // sort items
    items.sort(function (a, b) {
      var techA = a.technique;
      var techB = b.technique;

      if (techA._layer !== techB._layer) {
        return techA._layer - techB._layer;
      }

      if (techA._passes.length !== techB._passes.length) {
        return techA._passes.length - techB._passes.length;
      }

      return a.sortKey - b.sortKey;
    });

    // draw it
    for (var i$1 = 0; i$1 < items.length; ++i$1) {
      var item$1 = items.data[i$1];

      for (var index = 0; index < this._shadowLights.length; ++index) {
        var light = this$1._shadowLights[index];
        this$1._device.setTexture(("shadowMap_" + index), light.shadowMap, this$1._allocTextuerUnit());
      }

      if (item$1.model.dynamicIA) {
        this$1._drawDynamic(item$1);
      } else {
        this$1._draw(item$1);
      }
    }
  };

  ForwardRenderer.prototype._transparentStage = function _transparentStage (view, items) {
    var this$1 = this;

    view.getPosition(_camPos);
    view.getForward(_camFwd);

    // update uniforms
    this._device.setUniform('view', mat4.array(_a16_view, view._matView));
    this._device.setUniform('proj', mat4.array(_a16_proj, view._matProj));
    this._device.setUniform('viewProj', mat4.array(_a16_viewProj, view._matViewProj));
    this._device.setUniform('eye', vec3.array(_a3_camPos, _camPos));

    // calculate zdist
    for (var i = 0; i < items.length; ++i) {
      var item = items.data[i];

      // TODO: we should use mesh center instead!
      item.node.getWorldPos(_v3_tmp1);

      vec3.sub(_v3_tmp1, _v3_tmp1, _camPos);
      item.sortKey = vec3.dot(_v3_tmp1, _camFwd);
    }

    // update rendering
    this._submitLightUniforms();
    this._submitOtherStagesUniforms();
    this._updateShaderOptions(items);

    // sort items
    items.sort(function (a, b) {
      if (a.technique._layer !== b.technique._layer) {
        return a.technique._layer - b.technique._layer;
      }

      return b.sortKey - a.sortKey;
    });

    // draw it
    for (var i$1 = 0; i$1 < items.length; ++i$1) {
      var item$1 = items.data[i$1];

      for (var index = 0; index < this._shadowLights.length; ++index) {
        var light = this$1._shadowLights[index];
        this$1._device.setTexture(("shadowMap_" + index), light.shadowMap, this$1._allocTextuerUnit());
      }

      this$1._draw(item$1);
    }
  };

  ForwardRenderer.prototype._drawDynamic = function _drawDynamic (item) {
    var this$1 = this;

    var model = item.model;
    var v = 0;

    if (model instanceof LinesModel) {
      for (var i = model.lines.length-1; i >= 0; --i) {
        // flush when verts exceeds
        if (v + 2 >= MAX_LINE_VERTS) {
          var lineIA = this$1._lineIAs.request();
          lineIA._vertexBuffer.update(0, _lineData);
          lineIA._start = 0;
          lineIA._count = i;

          item.ia = lineIA;
          this$1._draw(item);
          v = 0;
        }

        var line = model.lines.data[i];

        //
        var idx = v * 6;
        _lineData[idx] = line.start.x;
        _lineData[idx + 1] = line.start.y;
        _lineData[idx + 2] = line.start.z;
        _lineData[idx + 3] = line.color.r;
        _lineData[idx + 4] = line.color.g;
        _lineData[idx + 5] = line.color.b;

        _lineData[idx + 6] = line.end.x;
        _lineData[idx + 7] = line.end.y;
        _lineData[idx + 8] = line.end.z;
        _lineData[idx + 9] = line.color.r;
        _lineData[idx + 10] = line.color.g;
        _lineData[idx + 11] = line.color.b;

        v += 2;
      }

      // flush rest verts
      if (v > 0) {
        var lineIA$1 = this._lineIAs.request();
        lineIA$1._vertexBuffer.update(0, _lineData);
        lineIA$1._start = 0;
        lineIA$1._count = v;

        item.ia = lineIA$1;
        this._draw(item);
      }
    }
  };

  return ForwardRenderer;
}(renderer.Base));

function _createTable$1() {
  var obj = Object.create(null);
  obj.__tmp__ = undefined;
  delete obj.__tmp__;

  return obj;
}

function _wrapCallback(localID, callback) {
  return function (err, asset) {
    if (err) {
      if (callback) {
        callback(err);
      }
      return;
    }

    if (callback) {
      // if we are requesting subAsset, go get it.
      if (localID) {
        asset = asset.subAsset(localID);
        if (!asset) {
          callback(new Error(("subasset " + localID + " not found.")));
          return;
        }
      }
      callback(null, asset);
    }
  };
}

var AssetTask = (function (EventEmitter$$1) {
  function AssetTask() {
    EventEmitter$$1.call(this);
  }

  if ( EventEmitter$$1 ) AssetTask.__proto__ = EventEmitter$$1;
  AssetTask.prototype = Object.create( EventEmitter$$1 && EventEmitter$$1.prototype );
  AssetTask.prototype.constructor = AssetTask;

  AssetTask.prototype.run = function run (assetMng, uuid, info) {
    var this$1 = this;

    assetMng.loadUrls(info.type, info.urls, function (err, asset) {
      // remove loadings
      delete assetMng._loadings[uuid];

      // emit error
      if (err) {
        this$1.emit('loaded', err);
        return;
      }

      // emit loaded
      asset._uuid = uuid;
      asset._loaded = true;
      assetMng.add(uuid, asset);

      this$1.emit('loaded', null, asset);
    });
  };

  return AssetTask;
}(EventEmitter));

var AssetMng = function AssetMng(app) {
  this._app = app;
  this._loaders = _createTable$1(); // asset type to loader
  this._assetInfos = _createTable$1(); // uuid to asset-infos
  this._assets = _createTable$1(); // uuid to asset
  this._loadings = _createTable$1(); // uuid to loading tasks
};

AssetMng.prototype.registerLoader = function registerLoader (type, loader) {
  this._loaders[type] = loader;
};

AssetMng.prototype.registerAsset = function registerAsset (uuid, info) {
  if (this._assetInfos[uuid]) {
    console.warn(("asset " + uuid + " already registerred."));
    return;
  }

  this._assetInfos[uuid] = info;
};

AssetMng.prototype.add = function add (uuid, asset) {
  if (this._assets[uuid]) {
    console.warn(("Failed to add asset " + uuid + ", already exists."));
    return;
  }
  this._assets[uuid] = asset;
};

AssetMng.prototype.load = function load (uuid, callback) {
  // if this is a sub-asset
  var subIdx = uuid.indexOf('@');
  var localID;

  if (subIdx !== -1) {
    localID = uuid.substring(0, subIdx);
    uuid = uuid.substring(subIdx+1);
  }

  // check if asset loaded
  var asset = this._assets[uuid];
  if (asset) {
    // if we already loaded
    if (callback) {
      // if we are requesting subAsset, go get it.
      if (localID) {
        asset = asset.subAsset(localID);
        if (!asset) {
          callback(new Error(("subasset " + localID + " not found.")));
          return;
        }
      }

      callback(null, asset);
    }
    return;
  }

  // if this is a loading task
  var task = this._loadings[uuid];
  var taskCallback = _wrapCallback(localID, callback);
  if (task) {
    task.once('loaded', taskCallback);
    return;
  }

  // check if we have asset-info for loading asset
  var info = this._assetInfos[uuid];
  if (!info) {
    if (callback) {
      callback(new Error(("asset info " + uuid + " not found, please add it first.")));
    }
    return;
  }

  // create new task
  task = new AssetTask(this);
  this._loadings[uuid] = task;

  task.once('loaded', _wrapCallback(localID, callback));
  task.run(this, uuid, info);
};

AssetMng.prototype.loadUrls = function loadUrls (type, urls, callback) {
  var loader = this._loaders[type];
  if (!loader) {
    if (callback) {
      callback(new Error(("can not find loader for asset type " + type + ", please register it first.")));
    }

    return;
  }

  loader(this._app, urls, callback);
};

var chunks = {
  'common.frag': '// common module\n// constant value\n#define PI 3.14159265359\n#define PI2 6.28318530718\n#define EPSILON 1e-6\n#define LOG2 1.442695\n// common function\n#define saturate(a) clamp( a, 0.0, 1.0 )\n// gamma-correction\n// approximate version from http://chilliant.blogspot.com.au/2012/08/srgb-approximations-for-hlsl.html?m=1\n// also used by Unity builtin shaders(2017.2.0f3)\nvec3 gammaToLinearSpace(vec3 sRGB) { // TODO: use half maybe better.\n  return sRGB * (sRGB * (sRGB * 0.305306011 + 0.682171111) + 0.012522878);\n}\nvec3 linearToGammaSpace(vec3 lRGB) { // TODO: use half maybe better.\n  lRGB = max(lRGB, vec3(0.0));\n  return max(1.055 * pow(lRGB, vec3(0.416666667)) - vec3(0.055), vec3(0.0));\n}\n// exact version\nfloat gammaToLinearSpaceExact(float val) {\n  if (val <= 0.04045) {\n    return val / 12.92;\n  } else if (val < 1.0) {\n    return pow((val + 0.055) / 1.055, 2.4);\n  } else {\n    return pow(val, 2.2);\n  }\n}\nfloat linearToGammaSpaceExact(float val) {\n  if (val <= 0.0) {\n    return 0.0;\n  } else if (val <= 0.0031308) {\n    return 12.92 * val;\n  } else if (val < 1.0) {\n    return 1.055 * pow(val, 0.4166667) - 0.055;\n  } else {\n    return pow(val, 0.45454545);\n  }\n}\nvec4 packDepthToRGBA(float depth) {\n  vec4 ret = vec4(1.0, 255.0, 65025.0, 160581375.0) * depth;\n  ret = fract(ret);\n  ret -= ret.yzww * vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0);\n  return ret;\n}\nfloat unpackRGBAToDepth(vec4 color) {\n  return dot(color, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 160581375.0));\n}',
  'pbr_lighting.frag': 'struct LightInfo {\n  vec3 lightDir;\n  vec3 radiance;\n};\n{{#directionalLightSlots}}\n  uniform vec3 dir_light{{id}}_direction;\n  uniform vec3 dir_light{{id}}_color;\n{{/directionalLightSlots}}\n{{#pointLightSlots}}\n  uniform vec3 point_light{{id}}_position;\n  uniform vec3 point_light{{id}}_color;\n  uniform float point_light{{id}}_range;\n{{/pointLightSlots}}\n{{#spotLightSlots}}\n  uniform vec3 spot_light{{id}}_position;\n  uniform vec3 spot_light{{id}}_direction;\n  uniform vec3 spot_light{{id}}_color;\n  uniform vec2 spot_light{{id}}_spot;\n  uniform float spot_light{{id}}_range;\n{{/spotLightSlots}}\n// directional light\nLightInfo computeDirectionalLighting(\n  vec3 lightDirection,\n  vec3 lightColor\n) {\n  LightInfo ret;\n  ret.lightDir = -normalize(lightDirection);\n  ret.radiance = lightColor;\n  return ret;\n}\n// point light\nLightInfo computePointLighting(\n  vec3 lightPosition,\n  vec3 positionW,\n  vec3 lightColor,\n  float lightRange\n) {\n  LightInfo ret;\n  vec3 lightDir = lightPosition - positionW;\n  float attenuation = max(0., 1.0 - length(lightDir) / lightRange);\n  ret.lightDir = normalize(lightDir);\n  ret.radiance = lightColor * attenuation;\n  return ret;\n}\n// spot light\nLightInfo computeSpotLighting(\n  vec3 lightPosition,\n  vec3 positionW,\n  vec3 lightDirection,\n  vec3 lightColor,\n  vec2 lightSpot,\n  float lightRange\n) {\n  LightInfo ret;\n  vec3 lightDir = lightPosition - positionW;\n  float attenuation = max(0., 1.0 - length(lightDir) / lightRange);\n  float cosConeAngle = max(0., dot(lightDirection, -lightDir));\n  cosConeAngle = cosConeAngle < lightSpot.x ? 0.0 : cosConeAngle;\n  cosConeAngle = pow(cosConeAngle,lightSpot.y);\n  ret.lightDir = normalize(lightDir);\n  ret.radiance = lightColor * attenuation * cosConeAngle;\n  return ret;\n}',
  'phong_lighting.frag': 'struct LightInfo {\n  vec3 diffuse;\n  {{#useSpecular}}\n    vec3 specular;\n  {{/useSpecular}}\n};\nLightInfo computeDirectionalLighting(\n  vec3 lightDirection,\n  vec3 lightColor,\n  vec3 normal,\n  vec3 viewDirection,\n  float glossiness\n) {\n  LightInfo lightingResult;\n  float ndl = 0.0;\n  float ndh = 0.0;\n  vec3 lightDir = -normalize(lightDirection);\n  ndl = max(0.0, dot(normal, lightDir));\n  lightingResult.diffuse = lightColor * ndl;\n  {{#useSpecular}}\n    vec3 dirH = normalize(viewDirection + lightDir);\n    ndh = max(0.0, dot(normal, dirH));\n    ndh = (ndl == 0.0) ? 0.0: ndh;\n    ndh = pow(ndh, max(1.0, glossiness));\n    lightingResult.specular = lightColor * ndh;\n  {{/useSpecular}}\n  return lightingResult;\n}\nLightInfo computePointLighting(\n  vec3 lightPosition,\n  vec3 lightColor,\n  float lightRange,\n  vec3 normal,\n  vec3 positionW,\n  vec3 viewDirection,\n  float glossiness\n) {\n  LightInfo lightingResult;\n  float ndl = 0.0;\n  float ndh = 0.0;\n  vec3 lightDir = vec3(0, 0, 0);\n  float attenuation = 1.0;\n  lightDir = lightPosition - positionW;\n  attenuation = max(0., 1.0 - length(lightDir) / lightRange);\n  lightDir = normalize(lightDir);\n  ndl = max(0.0, dot(normal, lightDir));\n  lightingResult.diffuse = lightColor * ndl * attenuation;\n  {{#useSpecular}}\n    vec3 dirH = normalize(viewDirection + lightDir);\n    ndh = max(0.0, dot(normal, dirH));\n    ndh = (ndl == 0.0) ? 0.0: ndh;\n    ndh = pow(ndh, max(1.0, glossiness));\n    lightingResult.specular = lightColor * ndh * attenuation;\n  {{/useSpecular}}\n  return lightingResult;\n}\nLightInfo computeSpotLighting(\n  vec3 lightPosition,\n  vec3 lightDirection,\n  vec3 lightColor,\n  float lightRange,\n  vec2 lightSpot,\n  vec3 normal,\n  vec3 positionW,\n  vec3 viewDirection,\n  float glossiness\n) {\n  LightInfo lightingResult;\n  float ndl = 0.0;\n  float ndh = 0.0;\n  vec3 lightDir = vec3(0, 0, 0);\n  float attenuation = 1.0;\n  float cosConeAngle = 1.0;\n  lightDir = lightPosition - positionW;\n  attenuation = max(0., 1.0 - length(lightDir) / lightRange);\n  lightDir = normalize(lightDir);\n  cosConeAngle = max(0., dot(lightDirection, -lightDir));\n  cosConeAngle = cosConeAngle < lightSpot.x ? 0.0 : cosConeAngle;\n  cosConeAngle = pow(cosConeAngle,lightSpot.y);\n  ndl = max(0.0, dot(normal, lightDir));\n  lightingResult.diffuse = lightColor * ndl * attenuation * cosConeAngle;\n  {{#useSpecular}}\n    vec3 dirH = normalize(viewDirection + lightDir);\n    ndh = max(0.0, dot(normal, dirH));\n    ndh = (ndl == 0.0) ? 0.0: ndh;\n    ndh = pow(ndh, max(1.0, glossiness));\n    lightingResult.specular = lightColor * ndh * attenuation * cosConeAngle;\n  {{/useSpecular}}\n  return lightingResult;\n}\n{{#directionalLightSlots}}\n  uniform vec3 dir_light{{id}}_direction;\n  uniform vec3 dir_light{{id}}_color;\n{{/directionalLightSlots}}\n{{#pointLightSlots}}\n  uniform vec3 point_light{{id}}_position;\n  uniform vec3 point_light{{id}}_color;\n  uniform float point_light{{id}}_range;\n{{/pointLightSlots}}\n{{#spotLightSlots}}\n  uniform vec3 spot_light{{id}}_position;\n  uniform vec3 spot_light{{id}}_direction;\n  uniform vec3 spot_light{{id}}_color;\n  uniform float spot_light{{id}}_range;\n  uniform vec2 spot_light{{id}}_spot;\n{{/spotLightSlots}}\nLightInfo getPhongLighting(\n  vec3 normal,\n  vec3 positionW,\n  vec3 viewDirection,\n  float glossiness\n) {\n  LightInfo result;\n  result.diffuse = vec3(0, 0, 0);\n  {{#useSpecular}}\n    result.specular = vec3(0, 0, 0);\n  {{/useSpecular}}\n  LightInfo dirLighting;\n  {{#directionalLightSlots}}\n    dirLighting = computeDirectionalLighting(dir_light{{id}}_direction,dir_light{{id}}_color,normal, viewDirection, glossiness);\n    result.diffuse += dirLighting.diffuse;\n    {{#useSpecular}}\n      result.specular += dirLighting.specular;\n    {{/useSpecular}}\n  {{/directionalLightSlots}}\n  LightInfo pointLighting;\n  {{#pointLightSlots}}\n    pointLighting = computePointLighting(point_light{{id}}_position, point_light{{id}}_color, point_light{{id}}_range,\n                                         normal, positionW, viewDirection, glossiness);\n    result.diffuse += pointLighting.diffuse;\n    {{#useSpecular}}\n      result.specular += pointLighting.specular;\n    {{/useSpecular}}\n  {{/pointLightSlots}}\n  LightInfo spotLighting;\n  {{#spotLightSlots}}\n    spotLighting = computeSpotLighting(spot_light{{id}}_position, spot_light{{id}}_direction, spot_light{{id}}_color,\n                    spot_light{{id}}_range, spot_light{{id}}_spot,normal, positionW, viewDirection, glossiness);\n    result.diffuse += spotLighting.diffuse;\n    {{#useSpecular}}\n      result.specular += spotLighting.specular;\n    {{/useSpecular}}\n  {{/spotLightSlots}}\n  return result;\n}\n',
  'shadow_mapping.frag': '{{#shadowLightSlots}}\n  uniform sampler2D shadowMap_{{id}};\n  uniform float darkness_{{id}};\n  uniform float depthScale_{{id}};\n  uniform float frustumEdgeFalloff_{{id}};\n  uniform float bias_{{id}};\n  uniform vec2 texelSize_{{id}};\n  varying vec4 pos_lightspace_{{id}};\n  varying float vDepth_{{id}};\n{{/shadowLightSlots}}\nfloat computeShadow(sampler2D shadowMap, vec4 pos_lightspace, float bias) {\n  vec3 projCoords = pos_lightspace.xyz / pos_lightspace.w;\n  projCoords = projCoords * 0.5 + 0.5;\n  float closestDepth = unpackRGBAToDepth(texture2D(shadowMap, projCoords.xy));\n  float currentDepth = projCoords.z;\n  float shadow = (currentDepth - bias > closestDepth) ? 0.0 : 1.0;\n  return shadow;\n}\nfloat computeFallOff(float esm, vec2 coords, float frustumEdgeFalloff) {\n  float mask = smoothstep(1.0 - frustumEdgeFalloff, 1.0, clamp(dot(coords, coords), 0.0, 1.0));\n  return mix(esm, 1.0, mask);\n}\n// unused for float precision issue.\n// float computeShadowESM_Unused() {\n//   vec2 projCoords = pos_lightspace.xy / pos_lightspace.w;\n//   vec2 shadowUV = projCoords * 0.5 + vec2(0.5);\n//   if (shadowUV.x < 0.0 || shadowUV.x > 1.0 || shadowUV.y < 0.0 || shadowUV.y > 1.0) {\n//     return 1.0;\n//   }\n//   float currentDepth = clamp(vDepth, 0.0, 1.0);\n//   float closestDepth = unpackRGBAToDepth(texture2D(shadowMap, shadowUV));\n//   float esm = 1.0 - clamp(exp(min(87.0, depthScale * currentDepth)) * closestDepth, 0.0, darkness);\n//   return computeFallOff(esm, projCoords, frustumEdgeFalloff);\n// }\nfloat computeShadowESM(sampler2D shadowMap, vec4 pos_lightspace, float vDepth, float depthScale, float darkness, float frustumEdgeFalloff) {\n  vec2 projCoords = pos_lightspace.xy / pos_lightspace.w;\n  vec2 shadowUV = projCoords * 0.5 + vec2(0.5);\n  if (shadowUV.x < 0.0 || shadowUV.x > 1.0 || shadowUV.y < 0.0 || shadowUV.y > 1.0) {\n    return 1.0;\n  }\n  float currentDepth = clamp(vDepth, 0.0, 1.0);\n  float closestDepth = unpackRGBAToDepth(texture2D(shadowMap, shadowUV));\n  //float esm = clamp(exp(min(87.0, -depthScale * (currentDepth - closestDepth))), 1.0 - darkness, 1.0);\n  float esm = clamp(exp(-depthScale * (currentDepth - closestDepth)), 1.0 - darkness, 1.0);\n  return computeFallOff(esm, projCoords, frustumEdgeFalloff);\n}\nfloat computeShadowPCF(sampler2D shadowMap, vec4 pos_lightspace, float vDepth, float darkness, vec2 texelSize, float frustumEdgeFalloff) {\n  vec2 projCoords = pos_lightspace.xy / pos_lightspace.w;\n  vec2 shadowUV = projCoords * 0.5 + vec2(0.5);\n  if (shadowUV.x < 0.0 || shadowUV.x > 1.0 || shadowUV.y < 0.0 || shadowUV.y > 1.0) {\n    return 1.0;\n  }\n  float currentDepth = clamp(vDepth, 0.0, 1.0);\n  float visibility = 1.0;\n  vec2 poissonDisk[4];\n  poissonDisk[0] = vec2(-0.94201624, -0.39906216);\n  poissonDisk[1] = vec2(0.94558609, -0.76890725);\n  poissonDisk[2] = vec2(-0.094184101, -0.92938870);\n  poissonDisk[3] = vec2(0.34495938, 0.29387760);\n  if (unpackRGBAToDepth(texture2D(shadowMap, shadowUV + poissonDisk[0] * texelSize)) < currentDepth) visibility -= 0.25;\n  if (unpackRGBAToDepth(texture2D(shadowMap, shadowUV + poissonDisk[1] * texelSize)) < currentDepth) visibility -= 0.25;\n  if (unpackRGBAToDepth(texture2D(shadowMap, shadowUV + poissonDisk[2] * texelSize)) < currentDepth) visibility -= 0.25;\n  if (unpackRGBAToDepth(texture2D(shadowMap, shadowUV + poissonDisk[3] * texelSize)) < currentDepth) visibility -= 0.25;\n  return computeFallOff(min(1.0, visibility + 1.0 - darkness), projCoords, frustumEdgeFalloff);\n}',
};

var templates = [
  {
    name: 'gaussian_blur',
    vert: 'attribute vec2 a_position;\nattribute vec2 a_uv0;\nvarying vec2 uv;\nvoid main() {\n  uv = a_uv0;\n  gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);\n}',
    frag: '\nvarying vec2 uv;\nuniform sampler2D texture;\nuniform vec2 pixelSize;\n{{> common.frag}}\nfloat kGaussianBlur[10];\nfloat log_conv(float x0, float X, float y0, float Y) {\n  return ( X + log( x0 + (y0 * exp(Y - X) ) ) );\n}\nvoid main() {\n  kGaussianBlur[0] = 0.0882357;\n  kGaussianBlur[1] = 0.0957407;\n  kGaussianBlur[2] = 0.101786;\n  kGaussianBlur[3] = 0.106026;\n  kGaussianBlur[4] = 0.108212;\n  kGaussianBlur[5] = 0.108212;\n  kGaussianBlur[6] = 0.106026;\n  kGaussianBlur[7] = 0.101786;\n  kGaussianBlur[8] = 0.0957407;\n  kGaussianBlur[9] = 0.0882357;\n  float sample[10];\n  for (int i = 0; i < 10; ++i) {\n    float offset = float(i) - 4.5;\n    vec2 texCoord = vec2( uv.x + offset * pixelSize.x, uv.y + offset * pixelSize.y);\n    sample[i] = unpackRGBAToDepth(texture2D(texture, texCoord));\n  }\n  float sum = log_conv(kGaussianBlur[0], sample[0], kGaussianBlur[1], sample[1]);\n  for (int i = 2; i < 10; ++i) {\n    sum = log_conv(1.0, sum, kGaussianBlur[i], sample[i]);\n  }\n  gl_FragColor = packDepthToRGBA(sum);\n}\n',
    options: [
    ],
  },
  {
    name: 'grid',
    vert: '\nattribute vec2 a_uv0;\nattribute vec3 a_position;\nattribute vec3 a_normal;\nuniform mat4 model;\nuniform mat4 viewProj;\nvarying vec2 uv0;\nvarying vec4 pos_w;\n{{#useWorldPos}}\n  uniform mat3 normalMatrix;\n  varying vec3 normal_w;\n{{/useWorldPos}}\nvoid main () {\n  uv0 = a_uv0;\n  pos_w = model * vec4(a_position, 1);\n  {{#useWorldPos}}\n    normal_w = normalMatrix * a_normal;\n  {{/useWorldPos}}\n  gl_Position = viewProj * pos_w;\n}',
    frag: 'varying vec2 uv0;\nvarying vec4 pos_w;\n{{#useWorldPos}}\n  varying vec3 normal_w;\n{{/useWorldPos}}\nuniform vec2 tiling;\nuniform vec3 baseColorWhite;\nuniform vec3 baseColorBlack;\nuniform sampler2D basePattern;\nuniform vec2 basePatternTiling;\nuniform vec2 basePatternOffset;\nuniform vec4 subPatternColor;\nuniform sampler2D subPattern;\nuniform vec2 subPatternTiling;\nuniform vec2 subPatternOffset;\nuniform vec4 subPatternColor2;\nuniform sampler2D subPattern2;\nuniform vec2 subPattern2Tiling;\nuniform vec2 subPattern2Offset;\nvoid main () {\n  vec2 uv = uv0 * tiling;\n  vec2 uvBase = uv * basePatternTiling + basePatternOffset;\n  vec2 uvSub = uv * subPatternTiling + subPatternOffset;\n  vec2 uvSub2 = uv * subPattern2Tiling + subPattern2Offset;\n  {{#useWorldPos}}\n    vec3 dnormal_w = normalize(normal_w);\n    if (abs(dnormal_w.x)>0.5) { \n      uvBase = (pos_w.zy * tiling * basePatternTiling) + basePatternOffset;\n      uvSub = (pos_w.zy * tiling * subPatternTiling) + subPatternOffset;\n      uvSub2 = (pos_w.zy * tiling * subPattern2Tiling) + subPattern2Offset;\n    } else if (abs(dnormal_w.z)>0.5) { \n      uvBase = (pos_w.xy * tiling * basePatternTiling) + basePatternOffset;\n      uvSub = (pos_w.xy * tiling * subPatternTiling) + subPatternOffset;\n      uvSub2 = (pos_w.xy * tiling * subPattern2Tiling) + subPattern2Offset;\n    } else { \n      uvBase = (pos_w.xz * tiling * basePatternTiling) + basePatternOffset;\n      uvSub = (pos_w.xz * tiling * subPatternTiling) + subPatternOffset;\n      uvSub2 = (pos_w.xz * tiling * subPattern2Tiling) + subPattern2Offset;\n    }\n  {{/useWorldPos}}\n  vec4 texColBase = texture2D(basePattern, uvBase);\n  vec4 texColSub = texture2D(subPattern, uvSub);\n  vec4 texColSub2 = texture2D(subPattern2, uvSub2);\n  \n  \n  \n  vec4 color = vec4(baseColorWhite,1) * texColBase + vec4(baseColorBlack,1) * (1.0-texColBase);\n  color =\n    color * (1.0 - texColSub) +\n    (subPatternColor * subPatternColor.a + color * (1.0-subPatternColor.a)) * texColSub\n    ;\n  color =\n    color * (1.0 - texColSub2) +\n    (subPatternColor2 * subPatternColor2.a + color * (1.0-subPatternColor2.a)) * texColSub2\n    ;\n  \n  \n  gl_FragColor = color;\n}',
    options: [
      { name: 'useWorldPos', } ],
  },
  {
    name: 'line',
    vert: '\nattribute vec3 a_position;\nattribute vec3 a_color;\nuniform mat4 model;\nuniform mat4 viewProj;\nvarying vec3 color;\nvoid main () {\n  vec4 pos = viewProj * model * vec4(a_position, 1);\n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  color = a_color;\n  gl_Position = pos;\n}',
    frag: '\nvarying vec3 color;\nvoid main () {\n  gl_FragColor = vec4(color, 1.0);\n}',
    options: [
    ],
  },
  {
    name: 'matcap',
    vert: 'attribute vec3 a_position;\nattribute vec3 a_normal;\nuniform   mat4 model;\nuniform   mat4 viewProj;\nuniform   mat3 normalMatrix;\nvarying   vec2 matcapUV;\n{{#useMainTex}}\n  attribute vec2 a_uv0;\n  varying   vec2 uv0;\n{{/useMainTex}}\n{{#useSkinning}}\n  {{> skinning.vert}}\n{{/useSkinning}}\nvoid main(void){\n  {{#useMainTex}}\n    uv0 = a_uv0;\n  {{/useMainTex}}\n  vec4 pos = vec4(a_position, 1);\n  {{#useSkinning}}\n    mat4 skinMat = skinMatrix();\n    pos = skinMat * pos;\n  {{/useSkinning}}\n  pos = viewProj * model * pos;\n  gl_Position = pos;\n  vec4 normal = vec4(a_normal, 0);\n  {{#useSkinning}}\n    normal = skinMat * normal;\n  {{/useSkinning}}\n  normal = vec4(normalize(normalMatrix * normal.xyz), 0);\n  matcapUV = normal.xy;\n  matcapUV = matcapUV * 0.5 + 0.5;\n}',
    frag: 'precision mediump float;\nuniform sampler2D matcapTex;\nuniform float colorFactor;\nuniform vec4 color;\nvarying vec2 matcapUV;\n{{#useMainTex}}\n  varying vec2 uv0;\n  uniform sampler2D mainTex;\n{{/useMainTex}}\nvoid main(void){\n  vec4 col = vec4(1, 1, 1, 1);\n  col *= color;\n  {{#useMainTex}}\n    col *= texture2D(mainTex, uv0);\n  {{/useMainTex}}\n  vec4 matcapColor = texture2D(matcapTex, matcapUV);\n  gl_FragColor = col * colorFactor + matcapColor * (1.0 - colorFactor);\n}',
    options: [
      { name: 'useMainTex', },
      { name: 'useSkinning', } ],
  },
  {
    name: 'pbr',
    vert: 'attribute vec3 a_position;\nvarying vec3 pos_w;\nuniform mat4 model;\nuniform mat4 viewProj;\nuniform mat3 normalMatrix;\n{{#useNormal}}\n  attribute vec3 a_normal;\n  varying vec3 normal_w;\n{{/useNormal}}\n{{#useUV0}}\n  attribute vec2 a_uv0;\n  varying vec2 uv0;\n{{/useUV0}}\n{{#useSkinning}}\n  {{> skinning.vert}}\n{{/useSkinning}}\n{{#useShadowMap}}\n  {{#shadowLightSlots}}\n    uniform mat4 lightViewProjMatrix_{{id}};\n    \n    uniform float minDepth_{{id}};\n    uniform float maxDepth_{{id}};\n    varying vec4 pos_lightspace_{{id}};\n    varying float vDepth_{{id}};\n  {{/shadowLightSlots}}\n{{/useShadowMap}}\nvoid main () {\n  vec4 pos = vec4(a_position, 1);\n  {{#useSkinning}}\n    mat4 skinMat = skinMatrix();\n    pos = skinMat * pos;\n  {{/useSkinning}}\n  pos_w = (model * pos).xyz;\n  pos = viewProj * model * pos;\n  {{#useUV0}}\n    uv0 = a_uv0;\n  {{/useUV0}}\n  {{#useNormal}}\n    vec4 normal = vec4(a_normal, 0);\n    {{#useSkinning}}\n      normal = skinMat * normal;\n    {{/useSkinning}}\n    normal_w = normalMatrix * normal.xyz;\n    \n  {{/useNormal}}\n  {{#useShadowMap}}\n    {{#shadowLightSlots}}\n      pos_lightspace_{{id}} = lightViewProjMatrix_{{id}} * vec4(pos_w, 1.0);\n      vDepth_{{id}} = (pos_lightspace_{{id}}.z + minDepth_{{id}}) / (minDepth_{{id}} + maxDepth_{{id}});\n    {{/shadowLightSlots}}\n  {{/useShadowMap}}\n  gl_Position = pos;\n}',
    frag: '{{#useNormalTexture}}\n#extension GL_OES_standard_derivatives : enable\n{{/useNormalTexture}}\n{{#useTexLod}}\n#extension GL_EXT_shader_texture_lod: enable\n{{/useTexLod}}\n{{> common.frag}}\n{{#useShadowMap}}\n  {{> shadow_mapping.frag}}\n{{/useShadowMap}}\nvarying vec3 pos_w;\nuniform vec3 eye;\n{{#useNormal}}\n  varying vec3 normal_w;\n{{/useNormal}}\n{{#useUV0}}\n  varying vec2 uv0;\n{{/useUV0}}\n{{#useIBL}}\n  uniform samplerCube diffuseEnvTexture;\n  uniform samplerCube specularEnvTexture;\n  uniform sampler2D brdfLUT;\n  {{#useTexLod}}\n    uniform float maxReflectionLod;\n  {{/useTexLod}}\n{{/useIBL}}\nuniform vec3 albedo;\n{{#useAlbedoTexture}}\n  uniform vec2 albedoTiling;\n  uniform vec2 albedoOffset;\n  uniform sampler2D albedoTexture;\n{{/useAlbedoTexture}}\n{{#useMetalRoughnessTexture}}\n  uniform vec2 metalRoughnessTiling;\n  uniform vec2 metalRoughnessOffset;\n  uniform vec2 sampler2D metalRoughnessTexture;\n{{/useMetalRoughnessTexture}}\nuniform float metallic;\n{{#useMetallicTexture}}\n  uniform vec2 metallicTiling;\n  uniform vec2 metallicOffset;\n  uniform sampler2D metallicTexture;\n{{/useMetallicTexture}}\nuniform float roughness;\n{{#useRoughnessTexture}}\n  uniform vec2 roughnessTiling;\n  uniform vec2 roughnessOffset;\n  uniform sampler2D roughnessTexture;\n{{/useRoughnessTexture}}\nuniform float ao;\n{{#useAoTexture}}\n  uniform vec2 aoTiling;\n  uniform vec2 aoOffset;\n  uniform sampler2D aoTexture;\n{{/useAoTexture}}\n{{#useOpacity}}\n  uniform float opacity;\n  {{#useOpacityTexture}}\n    uniform vec2 opacityTiling;\n    uniform vec2 opacityOffset;\n    uniform sampler2D opacityTexture;\n  {{/useOpacityTexture}}\n{{/useOpacity}}\n{{#useAlphaTest}}\n  uniform float alphaTestThreshold;\n{{/useAlphaTest}}\n{{#useNormalTexture}}\n  uniform vec2 normalMapTiling;\n  uniform vec2 normalMapOffset;\n  uniform sampler2D normalTexture;\n  \n  vec3 getNormalFromTexture() {\n    vec3 tangentNormal = texture2D(normalTexture, uv0).rgb * 2.0 - 1.0;\n    vec3 q1  = dFdx(pos_w);\n    vec3 q2  = dFdy(pos_w);\n    vec2 uv  = uv0 * normalMapTiling + normalMapOffset;\n    vec2 st1 = dFdx(uv);\n    vec2 st2 = dFdy(uv);\n    vec3 N   = normalize(normal_w);\n    vec3 T   = normalize(q1*st2.t - q2*st1.t);\n    vec3 B   = -normalize(cross(N, T));\n    mat3 TBN = mat3(T, B, N);\n    return normalize(TBN * tangentNormal);\n  }\n{{/useNormalTexture}}\n{{> pbr_lighting.frag}}\nfloat distributionGGX(vec3 N, vec3 H, float roughness) {\n  float a = roughness * roughness;\n  float a2 = a * a;\n  float NdotH = max(dot(N, H), 0.0);\n  float NdotH2 = NdotH * NdotH;\n  float nom   = a2;\n  float denom = (NdotH2 * (a2 - 1.0) + 1.0);\n  denom = PI * denom * denom;\n  return nom / denom;\n}\nfloat geometrySchlickGGX(float NdotV, float roughness) {\n  float r = (roughness + 1.0);\n  float k = (r * r) / 8.0;\n  float nom   = NdotV;\n  float denom = NdotV * (1.0 - k) + k;\n  return nom / denom;\n}\nfloat geometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {\n  float NdotV = max(dot(N, V), 0.0);\n  float NdotL = max(dot(N, L), 0.0);\n  float ggx2 = geometrySchlickGGX(NdotV, roughness);\n  float ggx1 = geometrySchlickGGX(NdotL, roughness);\n  return ggx1 * ggx2;\n}\nvec3 fresnelSchlick(float cosTheta, vec3 F0) {\n  float fresnel = exp2((-5.55473 * cosTheta - 6.98316) * cosTheta);\n  return F0 + (1.0 - F0) * fresnel;\n}\nvec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness) {\n  float fresnel = exp2((-5.55473 * cosTheta - 6.98316) * cosTheta);\n  return F0 + (max(vec3(1.0 - roughness), F0) - F0) * fresnel;\n}\nvec3 brdf(LightInfo lightInfo, vec3 N, vec3 V, vec3 F0, vec3 albedo, float metallic, float roughness) {\n  vec3 H = normalize(V + lightInfo.lightDir);\n  float NDF = distributionGGX(N, H, roughness);\n  float G   = geometrySmith(N, V, lightInfo.lightDir, roughness);\n  vec3 F    = fresnelSchlick(max(dot(H, V), 0.0), F0);\n  vec3 nominator    = NDF * G * F;\n  float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, lightInfo.lightDir), 0.0) + 0.001; \n  vec3 specular = nominator / denominator;\n  \n  vec3 kS = F;\n  \n  \n  \n  vec3 kD = vec3(1.0) - kS;\n  \n  \n  \n  kD *= 1.0 - metallic;\n  float NdotL = max(dot(N, lightInfo.lightDir), 0.0);\n  return (kD * albedo / PI + specular) * lightInfo.radiance * NdotL;\n}\nvoid main() {\n  {{#useAlphaTest}}\n    if(opacity < alphaTestThreshold) discard;\n  {{/useAlphaTest}}\n  {{#useAlbedoTexture}}\n    vec2 albedoUV = uv0 * albedoTiling + albedoOffset;\n    vec3 albedo   = gammaToLinearSpace(texture2D(albedoTexture, albedoUV).rgb);\n  {{/useAlbedoTexture}}\n  {{#useMetalRoughnessTexture}} // if using metalroughness texture\n    \n    \n    vec2 metalRoughnessUV = uv0 * metalRoughnessTiling + metalRoughnessOffset;\n    vec3 metalRoughness = texture2D(metalRoughnessTexture, metalRoughnessUV).rgb;\n    float metallic = metalRoughness.b;\n    float roughness = metalRoughness.g;\n  {{/useMetalRoughnessTexture}}\n  {{^useMetalRoughnessTexture}} \n    {{#useMetallicTexture}}\n      vec2 metallicUV = uv0 * metallicTiling + metallicOffset;\n      float metallic  = texture2D(metallicTexture, metallicUV).r;\n    {{/useMetallicTexture}}\n    {{#useRoughnessTexture}}\n      vec2 roughnessUV = uv0 * roughnessTiling + roughnessOffset;\n      float roughness  = texture2D(roughnessTexture, roughnessUV).r;\n    {{/useRoughnessTexture}}\n  {{/useMetalRoughnessTexture}}\n  {{#useAoTexture}}\n    vec2 aoUV = uv0 * aoTiling + aoOffset;\n    float ao  = texture2D(aoTexture, aoUV).r;\n  {{/useAoTexture}}\n  vec3 N = normalize(normal_w);\n  {{#useNormalTexture}}\n    N = getNormalFromTexture();\n  {{/useNormalTexture}}\n  vec3 V = normalize(eye - pos_w);\n  \n  \n  vec3 F0 = vec3(0.04);\n  F0 = mix(F0, albedo, metallic);\n  \n  vec3 Lo = vec3(0.0);\n  \n  {{#pointLightSlots}}\n    LightInfo pointLight{{id}};\n    pointLight{{id}} = computePointLighting(point_light{{id}}_position, pos_w, point_light{{id}}_color, point_light{{id}}_range);\n    Lo += brdf(pointLight{{id}}, N, V, F0, albedo, metallic, roughness);\n  {{/pointLightSlots}}\n  \n  {{#directionalLightSlots}}\n    LightInfo directionalLight{{id}};\n    directionalLight{{id}} = computeDirectionalLighting(dir_light{{id}}_direction, dir_light{{id}}_color);\n    Lo += brdf(directionalLight{{id}}, N, V, F0, albedo, metallic, roughness);\n  {{/directionalLightSlots}}\n  \n  {{#spotLightSlots}}\n    LightInfo spotLight{{id}};\n    spotLight{{id}} = computeSpotLighting(spot_light{{id}}_position, pos_w, spot_light{{id}}_direction, spot_light{{id}}_color, spot_light{{id}}_spot, spot_light{{id}}_range);\n    Lo += brdf(spotLight{{id}}, N, V, F0, albedo, metallic, roughness);\n  {{/spotLightSlots}}\n  \n  vec3 ambient = vec3(0.03) * albedo * ao;\n  {{#useIBL}}\n    \n    vec3 F = fresnelSchlickRoughness(max(dot(N, V), 0.0), F0, roughness);\n    vec3 kS = F;\n    vec3 kD = vec3(1.0) - kS;\n    kD *= 1.0 - metallic;\n    vec3 diffuseEnv = textureCube(diffuseEnvTexture, N).rgb;\n    vec3 diffuse = diffuseEnv * albedo;\n    \n    vec3 R = reflect(-V, N);\n    {{#useTexLod}}\n      vec3 specularEnv = textureCubeLodEXT(specularEnvTexture, R, roughness * maxReflectionLod).rgb;\n    {{/useTexLod}}\n    {{^useTexLod}}\n      vec3 specularEnv = textureCube(specularEnvTexture, R).rgb;\n    {{/useTexLod}}\n    vec2 brdf  = texture2D(brdfLUT, vec2(max(dot(N, V), 0.0), roughness)).rg;\n    vec3 specular = specularEnv * (F * brdf.x + brdf.y);\n    ambient = (kD * diffuse + specular) * ao;\n  {{/useIBL}}\n  {{#useShadowMap}}\n    float shadow = 1.0;\n    {{#shadowLightSlots}}\n      shadow *= computeShadowESM(shadowMap_{{id}}, pos_lightspace_{{id}}, vDepth_{{id}}, depthScale_{{id}}, darkness_{{id}}, frustumEdgeFalloff_{{id}});\n    {{/shadowLightSlots}}\n    vec3 color = (ambient + Lo) * shadow;\n  {{/useShadowMap}}\n  {{^useShadowMap}}\n    vec3 color = ambient + Lo;\n  {{/useShadowMap}}\n  \n  color = color / (color + vec3(1.0));\n  \n  color = linearToGammaSpace(color);\n  {{#useOpacity}}\n    {{#useOpacityTexture}}\n      vec2 opacityUV = uv0 * opacityTiling + opacityOffset;\n      float opacity  = texture2D(opacityTexture, opacityUV).r;\n    {{/useOpacityTexture}}\n    gl_FragColor = vec4(color, opacity);\n  {{/useOpacity}}\n  {{^useOpacity}}\n    gl_FragColor = vec4(color, 1.0);\n  {{/useOpacity}}\n}',
    options: [
      { name: 'useNormal', },
      { name: 'useUV0', },
      { name: 'useSkinning', },
      { name: 'useNormalTexture', },
      { name: 'useAlbedoTexture', },
      { name: 'useMetalRoughnessTexture', },
      { name: 'useMetallicTexture', },
      { name: 'useRoughnessTexture', },
      { name: 'useAoTexture', },
      { name: 'useIBL', },
      { name: 'useTexLod', },
      { name: 'useOpacity', },
      { name: 'useOpacityTexture', },
      { name: 'useAlphaTest', },
      { name: 'useShadowMap', },
      { name: 'directionalLightSlots', },
      { name: 'pointLightSlots', },
      { name: 'spotLightSlots', },
      { name: 'shadowLightSlots', } ],
  },
  {
    name: 'phong',
    vert: 'attribute vec3 a_position;\nuniform mat4 model;\nuniform mat4 viewProj;\nuniform mat3 normalMatrix;\n{{#useUV0}}\n  attribute vec2 a_uv0;\n  varying vec2 uv0;\n{{/useUV0}}\n{{#useNormal}}\n  attribute vec3 a_normal;\n  varying vec3 normal_w;\n{{/useNormal}}\nvarying vec3 pos_w;\n{{#useSkinning}}\n  {{> skinning.vert}}\n{{/useSkinning}}\n{{#useShadowMap}}\n  uniform mat4 lightViewProjMatrix;\n  uniform float minDepth;\n  uniform float maxDepth;\n  varying vec4 pos_lightspace;\n  varying float vDepth;\n{{/useShadowMap}}\nvoid main () {\n  vec4 pos = vec4(a_position, 1);\n  {{#useSkinning}}\n    mat4 skinMat = skinMatrix();\n    pos = skinMat * pos;\n  {{/useSkinning}}\n  pos_w = (model * pos).xyz;\n  pos = viewProj * model * pos;\n  {{#useUV0}}\n    uv0 = a_uv0;\n  {{/useUV0}}\n  {{#useNormal}}\n    vec4 normal = vec4(a_normal, 0);\n    {{#useSkinning}}\n      normal = skinMat * normal;\n    {{/useSkinning}}\n    normal_w = normalMatrix * normal.xyz;\n    normal_w = normalize(normal_w);\n  {{/useNormal}}\n  {{#useShadowMap}}\n    pos_lightspace = lightViewProjMatrix * vec4(pos_w, 1.0);\n    vDepth = (pos_lightspace.z + minDepth) / (minDepth + maxDepth);\n  {{/useShadowMap}}\n  gl_Position = pos;\n}',
    frag: '{{#useNormalTexture}}\n#extension GL_OES_standard_derivatives : enable\n{{/useNormalTexture}}\n{{> common.frag}}\n{{#useUV0}}\n  varying vec2 uv0;\n{{/useUV0}}\n{{#useNormal}}\n  varying vec3 normal_w;\n{{/useNormal}}\n{{#useShadowMap}}\n  {{> shadow_mapping.frag}}\n{{/useShadowMap}}\nvarying vec3 pos_w;\nuniform vec3 eye;\nstruct phongMaterial\n{\n  vec3 diffuse;\n  vec3 emissive;\n  vec3 specular;\n  float glossiness;\n  float opacity;\n};\n{{#useDiffuse}}\n  uniform vec3 diffuseColor;\n  {{#useDiffuseTexture}}\n    uniform vec2 diffuseTiling;\n    uniform vec2 diffuseOffset;\n    uniform sampler2D diffuseTexture;\n  {{/useDiffuseTexture}}\n{{/useDiffuse}}\nuniform vec3 sceneAmbient;\n{{#useEmissive}}\n  uniform vec3 emissiveColor;\n  {{#useEmissiveTexture}}\n    uniform vec2 emissiveTiling;\n    uniform vec2 emissiveOffset;\n    uniform sampler2D emissiveTexture;\n  {{/useEmissiveTexture}}\n{{/useEmissive}}\n{{#useSpecular}}\n  uniform vec3 specularColor;\n  uniform float glossiness;\n  {{#useSpecularTexture}}\n    uniform vec2 specularTiling;\n    uniform vec2 specularOffset;\n    uniform sampler2D specularTexture;\n  {{/useSpecularTexture}}\n{{/useSpecular}}\n{{#useOpacity}}\n  uniform float opacity;\n  {{#useOpacityTexture}}\n    uniform vec2 opacityTiling;\n    uniform vec2 opacityOffset;\n    uniform sampler2D opacityTexture;\n  {{/useOpacityTexture}}\n{{/useOpacity}}\n{{#useNormalTexture}}\n  uniform vec2 normalMapTiling;\n  uniform vec2 normalMapOffset;\n  uniform sampler2D normalTexture;\n  uniform float normalScale;  \n  vec3 getNormal(vec3 pos, vec3 normal) {\n    vec3 q0 = vec3( dFdx( pos.x ), dFdx( pos.y ), dFdx( pos.z ) );\n    vec3 q1 = vec3( dFdy( pos.x ), dFdy( pos.y ), dFdy( pos.z ) );\n    vec2 uv = uv0 * normalMapTiling + normalMapOffset;\n    vec2 st0 = dFdx( uv.st );\n    vec2 st1 = dFdy( uv.st );\n    vec3 S = normalize( q0 * st1.t - q1 * st0.t );\n    vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n    vec3 N = normalize( normal );\n    vec3 mapN = texture2D(normalTexture, uv0).rgb * 2.0 - 1.0;\n    mapN.xy = 1.0 * mapN.xy;\n    mat3 tsn = mat3( S, T, N );\n    return normalize( tsn * mapN );\n  }\n{{/useNormalTexture}}\n{{#useAlphaTest}}\n  uniform float alphaTestThreshold;\n{{/useAlphaTest}}\nphongMaterial getPhongMaterial() {\n  phongMaterial result;\n  result.diffuse = vec3(0.8, 0.8, 0.8);\n  result.emissive = vec3(0.0, 0.0, 0.0);\n  result.specular = vec3(0.0, 0.0, 0.0);\n  result.glossiness = 10.0;\n  result.opacity = 1.0;\n  vec2 uv;\n  {{#useDiffuse}}\n    result.diffuse = diffuseColor;\n    {{#useDiffuseTexture}}\n      uv = uv0 * diffuseTiling + diffuseOffset;\n      result.diffuse = result.diffuse * texture2D(diffuseTexture, uv).rgb;\n    {{/useDiffuseTexture}}\n  {{/useDiffuse}}\n  {{#useEmissive}}\n    result.emissive = emissiveColor;\n    {{#useEmissiveTexture}}\n      uv = uv0 * emissiveTiling + emissiveOffset;\n      result.emissive = result.emissive * texture2D(emissiveTexture, uv).rgb;\n    {{/useEmissiveTexture}}\n  {{/useEmissive}}\n  {{#useSpecular}}\n    result.specular = specularColor;\n    result.glossiness = glossiness;\n    {{#useSpecularTexture}}\n      uv = uv0 * specularTiling + specularOffset;\n      result.specular = result.specular * texture2D(specularTexture, uv).rgb;\n    {{/useSpecularTexture}}\n  {{/useSpecular}}\n  {{#useOpacity}}\n    result.opacity = opacity;\n    {{#useOpacityTexture}}\n      uv = uv0 * opacityTiling + opacityOffset;\n      result.opacity = result.opacity * texture2D(opacityTexture, uv).a;\n    {{/useOpacityTexture}}\n  {{/useOpacity}}\n  return result;\n}\n{{> phong_lighting.frag}}\nvec4 composePhongShading(LightInfo lighting, phongMaterial mtl)\n{\n  vec4 o = vec4(0.0, 0.0, 0.0, 1.0);\n  \n  o.xyz = lighting.diffuse * mtl.diffuse;\n  {{#useEmissive}}\n    o.xyz += mtl.emissive;\n  {{/useEmissive}}\n  {{#useSpecular}}\n    o.xyz += lighting.specular * mtl.specular;\n  {{/useSpecular}}\n  {{#useOpacity}}\n    o.a = mtl.opacity;\n  {{/useOpacity}}\n  return o;\n}\nvoid main () {\n  LightInfo phongLighting;\n  vec3 viewDirection = normalize(eye - pos_w);\n  phongMaterial mtl = getPhongMaterial();\n  {{#useAlphaTest}}\n    if(mtl.opacity < alphaTestThreshold) discard;\n  {{/useAlphaTest}}\n  vec3 normal = normal_w;\n  {{#useNormalTexture}}\n    normal = getNormal(pos_w, normal);\n  {{/useNormalTexture}}\n  phongLighting = getPhongLighting(normal, pos_w, viewDirection, mtl.glossiness);\n  phongLighting.diffuse += sceneAmbient;\n  {{#useShadowMap}}\n    float shadow = computeShadowESM();\n    gl_FragColor = composePhongShading(phongLighting, mtl) * shadow;\n  {{/useShadowMap}}\n  {{^useShadowMap}}\n    gl_FragColor = composePhongShading(phongLighting, mtl);\n  {{/useShadowMap}}\n}',
    options: [
      { name: 'useSkinning', },
      { name: 'useNormal', },
      { name: 'directionalLightSlots', },
      { name: 'pointLightSlots', },
      { name: 'spotLightSlots', },
      { name: 'useUV0', },
      { name: 'useDiffuse', },
      { name: 'useDiffuseTexture', },
      { name: 'useAmbient', },
      { name: 'useEmissive', },
      { name: 'useEmissiveTexture', },
      { name: 'useSpecular', },
      { name: 'useSpecularTexture', },
      { name: 'useNormalTexture', },
      { name: 'useOpacity', },
      { name: 'useOpacityTexture', },
      { name: 'useAlphaTest', },
      { name: 'useShadowMap', } ],
  },
  {
    name: 'shadow_mapping_depth',
    vert: 'attribute vec3 a_position;\nuniform mat4 model;\nuniform mat4 lightViewProjMatrix;\nuniform float minDepth;\nuniform float maxDepth;\nuniform float bias;\nvarying float vDepth;\nvoid main() {\n  gl_Position = lightViewProjMatrix * model * vec4(a_position, 1.0);\n  \n  vDepth = ((gl_Position.z + minDepth) / (minDepth + maxDepth)) + bias;\n}',
    frag: 'uniform float depthScale;\nvarying float vDepth;\n{{> common.frag}}\nvoid main() {\n  \n  \n  gl_FragColor = packDepthToRGBA(vDepth);\n  \n  \n}',
    options: [
    ],
  },
  {
    name: 'skybox',
    vert: 'attribute vec3 a_position;\nuniform mat4 view;\nuniform mat4 proj;\nvarying vec3 viewDir;\nvoid main() {\n  mat4 viewNoTrans = view;\n  viewNoTrans[3][0] = viewNoTrans[3][1] = viewNoTrans[3][2] = 0.0;\n  gl_Position = proj * viewNoTrans * vec4(a_position, 1.0);\n  \n  \n  \n  \n  gl_Position.z = gl_Position.w - 0.00001;\n  viewDir = a_position;\n}\n',
    frag: 'varying vec3 viewDir;\nuniform samplerCube cubeMap;\nvoid main() {\n    gl_FragColor = textureCube(cubeMap, viewDir);\n}',
    options: [
    ],
  },
  {
    name: 'sprite',
    vert: 'attribute vec3 a_position;\nuniform mat4 model;\nuniform mat4 viewProj;\nattribute vec2 a_uv0;\nattribute vec4 a_color;\nvarying vec2 uv0;\nvarying vec4 color;\nvoid main () {\n  vec4 pos = vec4(a_position, 1);\n  pos = model * viewProj * pos;\n  vec4 uv = vec4(a_uv0, 0, 1);\n  uv0 = uv.xy;\n  color = a_color;\n  gl_Position = pos;\n}',
    frag: '\nuniform sampler2D mainTexture;\nvarying vec2 uv0;\nvarying vec4 color;\nvoid main () {\n  vec4 o = vec4(1, 1, 1, 1);\n  o *= texture2D(mainTexture, uv0);\n  o *= color;\n  gl_FragColor = o;\n}',
    options: [
    ],
  },
  {
    name: 'unlit',
    vert: 'attribute vec3 a_position;\nuniform mat4 model;\nuniform mat4 viewProj;\n{{#useTexture}}\n  attribute vec2 a_uv0;\n  varying vec2 uv0;\n{{/useTexture}}\n{{#useSkinning}}\n  {{> skinning.vert}}\n{{/useSkinning}}\nvoid main () {\n  vec4 pos = vec4(a_position, 1);\n  {{#useSkinning}}\n    pos = skinMatrix() * pos;\n  {{/useSkinning}}\n  pos = viewProj * model * pos;\n  {{#useTexture}}\n    uv0 = a_uv0;\n  {{/useTexture}}\n  gl_Position = pos;\n}',
    frag: '{{#useTexture}}\n  uniform sampler2D mainTexture;\n  varying vec2 uv0;\n{{/useTexture}}\n{{#useColor}}\n  uniform vec4 color;\n{{/useColor}}\nvoid main () {\n  vec4 o = vec4(1, 1, 1, 1);\n  {{#useTexture}}\n    o *= texture2D(mainTexture, uv0);\n  {{/useTexture}}\n  {{#useColor}}\n    o *= color;\n  {{/useColor}}\n  gl_FragColor = o;\n}',
    options: [
      { name: 'useTexture', },
      { name: 'useColor', },
      { name: 'useSkinning', } ],
  },
  {
    name: 'wireframe',
    vert: '\nattribute vec3 a_position;\nattribute vec3 a_normal;\nuniform mat4 model, viewProj;\nuniform mat3 normalMatrix;\nvarying vec3 position_w;\nvarying vec3 normal_w;\nvoid main () {\n  vec4 pos = vec4(a_position, 1);\n  position_w = (model * pos).xyz;\n  pos = viewProj * model * pos;\n  normal_w = normalMatrix * a_normal.xyz;\n  gl_Position = pos;\n}',
    frag: '\nuniform vec3 eye;\nuniform vec3 color;\nvarying vec3 position_w;\nvarying vec3 normal_w;\nvoid main () {\n  gl_FragColor = vec4(color, 1.0);\n  vec3 e2p = normalize(eye - position_w);\n  if (dot (normal_w, e2p) <= 0.0) {\n    gl_FragColor.rgb *= 0.6;\n  }\n}',
    options: [
    ],
  } ];

var Asset = function Asset() {
  this._uuid = '';
  this._name = '';
  this._loaded = false;

  // TODO
  // this._caches = {}; // downloaded caches (for reload)
};

var prototypeAccessors$14 = { uuid: { configurable: true },name: { configurable: true } };

prototypeAccessors$14.uuid.get = function () {
  return this._uuid;
};

prototypeAccessors$14.name.get = function () {
  return this._name;
};

/**
 * @param {number} localID
 * Overwrite this if you have sub-assets
 */
Asset.prototype.subAsset = function subAsset (/*localID*/) {
  return null;
};

Asset.prototype.unload = function unload () {
  this._loaded = false;
};

Asset.prototype.reload = function reload () {
};

Asset.prototype.clone = function clone () {
};

Object.defineProperties( Asset.prototype, prototypeAccessors$14 );

var Mesh = (function (Asset$$1) {
  function Mesh() {
    Asset$$1.call(this);

    this._subMeshes = null; // [renderer.InputAssemblers]
    this._skinning = null; // {jointIndices, bindposes}
  }

  if ( Asset$$1 ) Mesh.__proto__ = Asset$$1;
  Mesh.prototype = Object.create( Asset$$1 && Asset$$1.prototype );
  Mesh.prototype.constructor = Mesh;

  var prototypeAccessors = { skinning: { configurable: true },subMeshCount: { configurable: true } };

  Mesh.prototype.unload = function unload () {
    var this$1 = this;

    if (!this._loaded) {
      return;
    }

    // destroy vertex buffer
    this._subMeshes[0]._vertexBuffer.destroy();

    // destroy index buffers
    for (var i = 0; i < this._subMeshes.length; ++i) {
      var mesh = this$1._subMeshes[i];
      mesh._indexBuffer.destroy();
    }

    this._subMeshes = null;

    Asset$$1.prototype.unload.call(this);
  };

  prototypeAccessors.skinning.get = function () {
    return this._skinning;
  };

  prototypeAccessors.subMeshCount.get = function () {
    return this._subMeshes.length;
  };

  Mesh.prototype.getSubMesh = function getSubMesh (idx) {
    return this._subMeshes[idx];
  };

  Object.defineProperties( Mesh.prototype, prototypeAccessors );

  return Mesh;
}(Asset));

var Texture$2 = (function (Asset$$1) {
  function Texture() {
    Asset$$1.call(this);

    this._texture = null; // gfx.Texture2D | gfx.TextureCube
  }

  if ( Asset$$1 ) Texture.__proto__ = Asset$$1;
  Texture.prototype = Object.create( Asset$$1 && Asset$$1.prototype );
  Texture.prototype.constructor = Texture;

  return Texture;
}(Asset));

var Texture2D$2 = (function (Texture) {
  function Texture2D() {
    Texture.call(this);
    this._opts = {
      anisotropy: 1,
      wrapS: gfx.WRAP_REPEAT,
      wrapT: gfx.WRAP_REPEAT,
      minFilter: gfx.FILTER_LINEAR,
      magFilter: gfx.FILTER_LINEAR,
      mipFilter: gfx.FILTER_LINEAR,
    };
  }

  if ( Texture ) Texture2D.__proto__ = Texture;
  Texture2D.prototype = Object.create( Texture && Texture.prototype );
  Texture2D.prototype.constructor = Texture2D;

  var prototypeAccessors = { anisotropy: { configurable: true },wrapS: { configurable: true },wrapT: { configurable: true },minFilter: { configurable: true },magFilter: { configurable: true },mipFilter: { configurable: true } };

  Texture2D.prototype.unload = function unload () {
    if (!this._loaded) {
      return;
    }

    this._texture.destroy();
    Texture.prototype.unload.call(this);
  };

  prototypeAccessors.anisotropy.set = function (val) {
    this._opts.anisotropy = val;
  };
  prototypeAccessors.anisotropy.get = function () {
    return this._opts.anisotropy;
  };

  prototypeAccessors.wrapS.set = function (val) {
    this._opts.wrapS = val;
  };
  prototypeAccessors.wrapS.get = function () {
    return this._opts.wrapS;
  };

  prototypeAccessors.wrapT.set = function (val) {
    this._opts.wrapT = val;
  };
  prototypeAccessors.wrapT.get = function () {
    return this._opts.wrapT;
  };

  prototypeAccessors.minFilter.set = function (val) {
    this._opts.minFilter = val;
  };
  prototypeAccessors.minFilter.get = function () {
    return this._opts.minFilter;
  };

  prototypeAccessors.magFilter.set = function (val) {
    this._opts.magFilter = val;
  };
  prototypeAccessors.magFilter.get = function () {
    return this._opts.magFilter;
  };

  prototypeAccessors.mipFilter.set = function (val) {
    this._opts.mipFilter = val;
  };
  prototypeAccessors.mipFilter.get = function () {
    return this._opts.mipFilter;
  };

  Texture2D.prototype.commit = function commit () {
    this._texture.update(this._opts);
  };

  Object.defineProperties( Texture2D.prototype, prototypeAccessors );

  return Texture2D;
}(Texture$2));

var TextureCube$2 = (function (Texture) {
  function TextureCube() {
    Texture.call(this);
    this._opts = {
      anisotropy: 1,
      wrapS: gfx.WRAP_REPEAT,
      wrapT: gfx.WRAP_REPEAT,
      minFilter: gfx.FILTER_LINEAR,
      magFilter: gfx.FILTER_LINEAR,
      mipFilter: gfx.FILTER_LINEAR,
    };
  }

  if ( Texture ) TextureCube.__proto__ = Texture;
  TextureCube.prototype = Object.create( Texture && Texture.prototype );
  TextureCube.prototype.constructor = TextureCube;

  var prototypeAccessors = { anisotropy: { configurable: true },wrapS: { configurable: true },wrapT: { configurable: true },minFilter: { configurable: true },magFilter: { configurable: true },mipFilter: { configurable: true } };

  TextureCube.prototype.unload = function unload () {
    if (!this._loaded) {
      return;
    }

    this._texture.destroy();
    Texture.prototype.unload.call(this);
  };

  prototypeAccessors.anisotropy.set = function (val) {
    this._opts.anisotropy = val;
  };
  prototypeAccessors.anisotropy.get = function () {
    return this._opts.anisotropy;
  };

  prototypeAccessors.wrapS.set = function (val) {
    this._opts.wrapS = val;
  };
  prototypeAccessors.wrapS.get = function () {
    return this._opts.wrapS;
  };

  prototypeAccessors.wrapT.set = function (val) {
    this._opts.wrapT = val;
  };
  prototypeAccessors.wrapT.get = function () {
    return this._opts.wrapT;
  };

  prototypeAccessors.minFilter.set = function (val) {
    this._opts.minFilter = val;
  };
  prototypeAccessors.minFilter.get = function () {
    return this._opts.minFilter;
  };

  prototypeAccessors.magFilter.set = function (val) {
    this._opts.magFilter = val;
  };
  prototypeAccessors.magFilter.get = function () {
    return this._opts.magFilter;
  };

  prototypeAccessors.mipFilter.set = function (val) {
    this._opts.mipFilter = val;
  };
  prototypeAccessors.mipFilter.get = function () {
    return this._opts.mipFilter;
  };

  TextureCube.prototype.commit = function commit () {
    this._texture.update(this._opts);
  };

  Object.defineProperties( TextureCube.prototype, prototypeAccessors );

  return TextureCube;
}(Texture$2));

var damping = 10.0;
var moveSpeed = 10.0;

var v3_f = vec3.new(0, 0, -1);
var v3_r = vec3.new(1, 0, 0);
var v3_u = vec3.new(0, 1, 0);

var rot3x3 = mat3.create();

var front = vec3.create();
var right = vec3.create();
var up = vec3.create();
var front2 = vec3.create();
var right2 = vec3.create();

var OrbitCamera = function OrbitCamera(input) {
  this._input = input;
  this._node = new Node('debug-camera');
  vec3.set(this._node.lpos, 10, 10, 10);
  this._node.lookAt(vec3.new(0, 0, 0));

  this._df = 0;
  this._dr = 0;
  this._panX = 0;
  this._panY = 0;
  this._panZ = 0;
  this._rotX = 0;
  this._rotY = 0;

  this._curRot = quat.create();
  this._destRot = quat.create();

  this._curEye = vec3.create();
  this._destEye = vec3.create();

  this._node.getWorldRot(this._curRot);
  this._destRot = quat.clone(this._curRot);

  this._node.getWorldPos(this._curEye);
  this._destEye = vec3.clone(this._curEye);
};

OrbitCamera.prototype.reset = function reset () {
  this._df = 0;
  this._dr = 0;
  this._panX = 0;
  this._panY = 0;
  this._panZ = 0;
  this._rotX = 0;
  this._rotY = 0;

  this._node.getWorldRot(this._curRot);
  this._destRot = quat.clone(this._curRot);

  this._node.getWorldPos(this._curEye);
  this._destEye = vec3.clone(this._curEye);
};

OrbitCamera.prototype.tick = function tick (dt) {
  this._handleMouseAndKeyboard();
  var input = this._input;
  if (this._input.hasTouch) {
    this._handleTouches();
  }
  this._lerp(dt);
};

OrbitCamera.prototype._handleMouseAndKeyboard = function _handleMouseAndKeyboard () {
  var input = this._input;
  this._df = 0;
  this._dr = 0;
  this._panX = 0;
  this._panY = 0;
  this._panZ = 0;
  this._rotX = 0;
  this._rotY = 0;

  if (input.mousepress('left') && input.mousepress('right')) {
    var dx = input.mouseDeltaX;
    var dy = input.mouseDeltaY;

    this._panX = dx;
    this._panY = -dy;

  } else if (input.mousepress('left')) {
    var dx$1 = input.mouseDeltaX;
    var dy$1 = input.mouseDeltaY;

    this._rotY = -dx$1 * 0.002;
    this._panZ = -dy$1;

  } else if (input.mousepress('right')) {
    var dx$2 = input.mouseDeltaX;
    var dy$2 = input.mouseDeltaY;

    this._rotY = -dx$2 * 0.002;
    this._rotX = -dy$2 * 0.002;
  }

  if (input.keypress('w')) {
    this._df += 1;
  }
  if (input.keypress('s')) {
    this._df -= 1;
  }
  if (input.keypress('a')) {
    this._dr -= 1;
  }
  if (input.keypress('d')) {
    this._dr += 1;
  }

  if (input.mouseScrollY) {
    this._df -= input.mouseScrollY * 0.05;
  }
};

OrbitCamera.prototype._handleTouches = function _handleTouches () {
  var input = this._input;
  this._df = 0;
  this._dr = 0;
  this._panX = 0;
  this._panY = 0;
  this._panZ = 0;
  this._rotX = 0;
  this._rotY = 0;

  if (input.touchCount === 1) {
    var touch = input.getTouchInfo(0);
    var dx = touch.dx;
    var dy = touch.dy;

    if (touch.prevX === 0 && touch.prevY === 0) {
      dx = 0;
      dy = 0;
    }

    this._rotY = -dx * 0.001;
    this._rotX = -dy * 0.001;

  } else if (input.touchCount === 2) {
    var touch0 = input.getTouchInfo(0);
    var touch1 = input.getTouchInfo(1);
    var lenCur = Math.sqrt((touch0.x - touch1.x) * (touch0.x - touch1.x) + (touch0.y - touch1.y) * (touch0.y - touch1.y));
    var lenPrev = Math.sqrt((touch0.prevX - touch1.prevX) * (touch0.prevX - touch1.prevX) + (touch0.prevY - touch1.prevY) * (touch0.prevY - touch1.prevY));
    var dLen = Math.abs(lenCur - lenPrev);

    if ((touch0.dx != 0 || touch0.dy != 0) && (touch1.dx != 0 || touch1.dy != 0) && dLen < 100) {
      if (lenCur > lenPrev) {
        this._df += dLen;
      } else {
        this._df -= dLen;
      }
    }

    if (touch1.phase === 2 || touch0.phase === 2) {
      input.touchCount = 2;
    }

  } else if (input.touchCount === 3) {
    var touch0$1 = input.getTouchInfo(0);
    var dx$1 = touch0$1.dx;
    var dy$1 = touch0$1.dy;
    if (dx$1 < 100 && dy$1 < 100) {
      this._rotY = -dx$1 * 0.002;
      this._panZ = -dy$1;
    }
  }
};

OrbitCamera.prototype._lerp = function _lerp (dt) {
  var panX = this._panX;
  var panY = this._panY;
  var panZ = this._panZ;
  var eye = this._destEye;
  var rot = this._destRot;

  // calculate curRot
  quat.rotateX(rot, rot, this._rotX);
  quat.rotateAround(rot, rot, v3_u, this._rotY);
  quat.slerp(this._curRot, this._curRot, rot, dt * damping);

  // calculate curEye
  mat3.fromQuat(rot3x3, this._curRot);

  vec3.transformMat3(front, v3_f, rot3x3);
  vec3.transformMat3(up, v3_u, rot3x3);
  vec3.transformMat3(right, v3_r, rot3x3);

  //
  if (this._df !== 0) {
    vec3.scaleAndAdd(eye, eye, front, this._df * dt * moveSpeed);
  }

  if (this._dr !== 0) {
    vec3.scaleAndAdd(eye, eye, right, this._dr * dt * moveSpeed);
  }

  if (panZ !== 0) {
    vec3.copy(front2, front);
    front2.y = 0.0;
    vec3.normalize(front2, front2);
    vec3.scaleAndAdd(eye, eye, front2, panZ * dt * moveSpeed);
  }

  if (panX !== 0) {
    vec3.copy(right2, right);
    right2.y = 0.0;
    vec3.normalize(right2, right2);
    vec3.scaleAndAdd(eye, eye, right2, panX * dt * moveSpeed);
  }

  if (panY !== 0) {
    vec3.scaleAndAdd(eye, eye, v3_u, panY * dt * moveSpeed);
  }

  vec3.lerp(this._curEye, this._curEye, eye, dt * damping);

  //
  this._node.setWorldPos(this._curEye);
  this._node.setWorldRot(this._curRot);
};

var Material = (function (Asset$$1) {
  function Material() {
    Asset$$1.call(this);

    this._effect = null; // renderer.Effect
  }

  if ( Asset$$1 ) Material.__proto__ = Asset$$1;
  Material.prototype = Object.create( Asset$$1 && Asset$$1.prototype );
  Material.prototype.constructor = Material;

  Material.prototype.unload = function unload () {
    if (!this._loaded) {
      return;
    }

    // TODO: what should we do here ???

    Asset$$1.prototype.unload.call(this);
  };

  return Material;
}(Asset));

var ShaderMaterial = (function (Material$$1) {
  function ShaderMaterial(name, parameters, options) {
    if ( parameters === void 0 ) parameters = [];
    if ( options === void 0 ) options = [];

    Material$$1.call(this);

    var mainTech = new renderer.Technique(
      ['opaque'],
      parameters,
      [new renderer.Pass(name)]
    );
    this._effect = new renderer.Effect([mainTech], {}, options);
    this._mainTech = mainTech;
  }

  if ( Material$$1 ) ShaderMaterial.__proto__ = Material$$1;
  ShaderMaterial.prototype = Object.create( Material$$1 && Material$$1.prototype );
  ShaderMaterial.prototype.constructor = ShaderMaterial;

  ShaderMaterial.prototype.setStages = function setStages (stages) {
    this._mainTech.setStages(stages);
  };

  ShaderMaterial.prototype.setDepth = function setDepth (depthTest, depthWrite) {
    this._mainTech.passes[0].setDepth(depthTest, depthWrite);
  };

  ShaderMaterial.prototype.setValue = function setValue (name, val) {
    if (val instanceof Texture$2) {
      this._effect.setValue(name, val._texture);
    } else {
      this._effect.setValue(name, val);
    }
  };

  ShaderMaterial.prototype.setOption = function setOption (name, val) {
    this._effect.setOption(name, val);
  };

  return ShaderMaterial;
}(Material));

var _right = vec3.new(1, 0, 0);
var _up = vec3.new(0, 1, 0);
var _forward$1 = vec3.new(0, 0, 1);
var _v3_tmp = vec3.create();
var _v3_tmp2 = vec3.create();
var _c3_tmp = color3.create();

var DrawMng = function DrawMng(app) {
  this._app = app;

  this._lines = new LinkedArray(function () {
    return {
      start: vec3.create(),
      end: vec3.create(),
      color: color3.create(),
      duration: 0.0,
      depthTest: false,
      timer: 0.0,
      is2D: false,

      _prev: null,
      _next: null,
    };
  }, 2000);

  this._rects = new LinkedArray(function () {
    return {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      color: color3.create(),
      duration: 0.0,
      timer: 0.0,

      _prev: null,
      _next: null,
    };
  }, 2000);

  this._axesList = new LinkedArray(function () {
    return {
      pos: vec3.create(),
      up: vec3.create(),
      right: vec3.create(),
      forward: vec3.create(),
      duration: 0.0,
      depthTest: false,
      timer: 0.0,
      is2D: false,

      _prev: null,
      _next: null,
    };
  }, 2000);

  var materialWireframe = new ShaderMaterial(
    'wireframe', [
      { name: 'color', type: renderer.PARAM_COLOR3, } ], []
  );
  materialWireframe.setDepth(true, true);
  materialWireframe.setValue('color', color3.new(1, 1, 1));

  this._primitives = new LinkedArray(function () {
    return {
      model: (function () {
        var model = new renderer.Model();
        var node = new Node();
        model.setNode(node);
        model.addEffect(materialWireframe._effect);

        return model;
      })(),
      duration: 0.0,
      depthTest: false,
      timer: 0.0,

      _prev: null,
      _next: null,
    };
  }, 2000);

  var materialLine = new ShaderMaterial(
    'line', [], []
  );
  materialLine.setDepth(true, true);
  this._materialLine = materialLine;

  var linesModel = new LinesModel();
  linesModel.setDynamicIA(true);
  linesModel.setNode(new Node('debug-lines'));
  linesModel.addEffect(materialLine._effect);

  // TODO: https://github.com/cocos-creator/engine-3d/issues/108
  // lineModel.addInputAssembler(
  // new renderer.DynamicInputAssembler(
  //   new gfx.VertexBuffer(
  //     device,
  //     new gfx.VertexFormat([
  //       { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
  //       { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_FLOAT32, num: 3 }
  //     ]),
  //     gfx.USAGE_DYNAMIC,
  //     lineData,
  //     2000
  //   ),
  //   null,
  //   gfx.PT_LINES
  // )
  // );

  app.scene.addModel(linesModel);
  this._linesModel = linesModel;

  //
  var linesModel2D = new LinesModel();
  linesModel2D.setDynamicIA(true);
  linesModel2D.setNode(new Node('debug-lines-2d'));
  linesModel2D.addEffect(materialLine._effect);

  app.scene.addModel(linesModel2D);
  this._linesModel2D = linesModel2D;

  //
  var sphereData = sphere(1.0, {
    segments: 20,
  });
  sphereData.uvs = null;
  sphereData.indices = wireframe(sphereData.indices);
  this._sphereIA = renderer.createIA(app.device, sphereData);
  this._sphereIA._primitiveType = gfx.PT_LINES;
};

/**
 * @param {number} dt
 */
DrawMng.prototype.tick = function tick (dt, viewID) {
    var this$1 = this;

  this._linesModel.clear();
  this._linesModel2D.clear();
  this._linesModel2D._viewID = viewID;

  // lines
  this._lines.forEach(function (item) {
    if (item.timer > item.duration) {
      this$1._lines.remove(item);
      return;
    }

    if (item.is2D) {
      this$1._linesModel2D.addLine(item.start, item.end, item.color);
    } else if (item.depthTest) {
      this$1._linesModel.addLine(item.start, item.end, item.color);
    } else {
      console.warn('We have not support it yet');
      // this._linesModelNoDepth.addLine(start, end, color, duration);
    }

    item.timer += dt;
  });

  // rects
  this._rects.forEach(function (item) {
    if (item.timer > item.duration) {
      this$1._rects.remove(item);
      return;
    }

    this$1._linesModel2D.addLine(
      vec3.set(_v3_tmp, item.x, item.y, 0.0),
      vec3.set(_v3_tmp2, item.x, item.y + item.h, 0.0),
      item.color
    );
    this$1._linesModel2D.addLine(
      vec3.set(_v3_tmp, item.x, item.y + item.h, 0.0),
      vec3.set(_v3_tmp2, item.x + item.w, item.y + item.h, 0.0),
      item.color
    );
    this$1._linesModel2D.addLine(
      vec3.set(_v3_tmp, item.x + item.w, item.y + item.h, 0.0),
      vec3.set(_v3_tmp2, item.x + item.w, item.y, 0.0),
      item.color
    );
    this$1._linesModel2D.addLine(
      vec3.set(_v3_tmp, item.x + item.w, item.y, 0.0),
      vec3.set(_v3_tmp2, item.x, item.y, 0.0),
      item.color
    );

    item.timer += dt;
  });

  // axes list
  this._axesList.forEach(function (item) {
    if (item.timer > item.duration) {
      this$1._axesList.remove(item);
      return;
    }

    if (item.is2D) {
      this$1._linesModel2D.addLine(item.pos, item.up, color3.set(_c3_tmp, 1, 0, 0));
      this$1._linesModel2D.addLine(item.pos, item.right, color3.set(_c3_tmp, 0, 1, 0));
      this$1._linesModel2D.addLine(item.pos, item.forward, color3.set(_c3_tmp, 0, 0, 1));
    } else if (item.depthTest) {
      this$1._linesModel.addLine(item.pos, item.up, color3.set(_c3_tmp, 1, 0, 0));
      this$1._linesModel.addLine(item.pos, item.right, color3.set(_c3_tmp, 0, 1, 0));
      this$1._linesModel.addLine(item.pos, item.forward, color3.set(_c3_tmp, 0, 0, 1));
    } else {
      console.warn('We have not support it yet');
      // this._linesModelNoDepth.addLine(start, end, color, duration);
    }

    item.timer += dt;
  });

  // primitives
  this._primitives.forEach(function (item) {
    if (item.timer > item.duration) {
      item.model.clearInputAssemblers();
      this$1._app.scene.removeModel(item.model);

      this$1._primitives.remove(item);
      return;
    }

    item.timer += dt;
  });
};

DrawMng.prototype.addLine = function addLine (start, end, color, duration, depthTest, is2D) {
    if ( duration === void 0 ) duration = 0.0;
    if ( depthTest === void 0 ) depthTest = true;
    if ( is2D === void 0 ) is2D = false;

  var line = this._lines.add();

  vec3.copy(line.start, start);
  vec3.copy(line.end, end);
  color3.copy(line.color, color);
  line.duration = duration;
  line.depthTest = depthTest;
  line.timer = 0.0;
  line.is2D = is2D;

  if (is2D) {
    line.start.z = 0.0;
    line.end.z = 0.0;
  }
};

DrawMng.prototype.addRect2D = function addRect2D (x, y, width, height, color, duration) {
    if ( duration === void 0 ) duration = 0.0;

  var rect = this._rects.add();

  rect.x = x;
  rect.y = y;
  rect.w = width;
  rect.h = height;
  color3.copy(rect.color, color);
  rect.duration = duration;
  rect.timer = 0.0;
};

DrawMng.prototype.addAxes = function addAxes (pos, rotation, scale, duration, depthTest, is2D) {
    if ( duration === void 0 ) duration = 0.0;
    if ( depthTest === void 0 ) depthTest = true;
    if ( is2D === void 0 ) is2D = false;

  var axes = this._axesList.add();

  vec3.copy(axes.pos, pos);

  vec3.transformQuat(_v3_tmp, _right, rotation);
  vec3.scaleAndAdd(_v3_tmp, pos, _v3_tmp, scale),
  vec3.copy(axes.right, _v3_tmp);

  vec3.transformQuat(_v3_tmp, _up, rotation);
  vec3.scaleAndAdd(_v3_tmp, pos, _v3_tmp, scale),
  vec3.copy(axes.up, _v3_tmp);

  vec3.transformQuat(_v3_tmp, _forward$1, rotation);
  vec3.scaleAndAdd(_v3_tmp, pos, _v3_tmp, scale),
  vec3.copy(axes.forward, _v3_tmp);

  axes.duration = duration;
  axes.depthTest = depthTest;
  axes.timer = 0.0;
  axes.is2D = is2D;
};

DrawMng.prototype.addSphere = function addSphere (pos, radius, color, duration, depthTest) {
    if ( duration === void 0 ) duration = 0.0;
    if ( depthTest === void 0 ) depthTest = true;

  var primitive = this._primitives.add();
  primitive.model.addInputAssembler(this._sphereIA);
  vec3.copy(primitive.model._node.lpos, pos);
  vec3.set(primitive.model._node.lscale, radius, radius, radius);

  primitive.duration = duration;
  primitive.depthTest = depthTest;
  primitive.timer = 0.0;

  this._app.scene.addModel(primitive.model);
};

function createGrid(device, width, length, seg) {
  // create mesh
  var vertices = [];
  var hw = width * 0.5;
  var hl = length * 0.5;
  var dw = width / seg;
  var dl = length / seg;

  for (var x = -hw; x <= hw; x += dw) {
    vertices.push(x, 0, -hl);
    vertices.push(x, 0, hl);
  }

  for (var z = -hl; z <= hl; z += dl) {
    vertices.push(-hw, 0, z);
    vertices.push(hw, 0, z);
  }

  var ia = renderer.createIA(device, {
    positions: vertices
  });
  ia._primitiveType = gfx.PT_LINES;

  var material = new ShaderMaterial(
    'simple',
    [
      { name: 'color', type: renderer.PARAM_COLOR4, } ],
    [
      { name: 'useTexture', value: false },
      { name: 'useColor', value: true }
    ]
  );
  material.setDepth(true, true);
  material.setValue('color', color4.new(0.4, 0.4, 0.4, 1.0));

  var model = new renderer.Model();
  model.addInputAssembler(ia);
  model.addEffect(material._effect);
  model.setNode(new Node('debug-grid'));

  return model;
}

var Debugger = function Debugger(app) {
  this._state = 'sleep';
  this._app = app;
  this._drawMng = new DrawMng(app);

  // debug camera
  this._orbit = new OrbitCamera(app._input);
  this._camera = new renderer.Camera();
  this._camera.setColor(0.3, 0.3, 0.3, 1);
  this._camera.setNode(this._orbit._node);
  this._camera.setStages([
    'opaque',
    'transparent'
  ]);

  // debug view
  this._view2D = new renderer.View();
  this._view2D._clearFlags = 0;
  this._view2D._cullingByID = true;
  this._view2D._stages = [
    'opaque'
  ];

  // grid
  this._grid = createGrid(app.device, 100, 100, 100);
};

Debugger.prototype.start = function start () {
  if (this._state !== 'sleep') {
    return;
  }

  this._state = 'enter';
};

Debugger.prototype.stop = function stop () {
  if (this._state === 'sleep') {
    return;
  }

  this._state = 'fade2normal';
};

Debugger.prototype.tick = function tick () {
  if (this._state === 'sleep') {
    return;
  }

  var name = "_" + (this._state);
  var fn = this[name];
  if (!fn) {
    console.warn(("Unknown state " + (this._state)));
    return;
  }

  this[name]();
};

Debugger.prototype.commit = function commit () {
  var dt = this._app.deltaTime;

  // update draw-mng
  this._drawMng.tick(dt, this._view2D._id);
};

// ====================
// debug draw
// ====================

Debugger.prototype.drawLine = function drawLine (start, end, color, duration, depthTest) {
  this._drawMng.addLine(start, end, color, duration, depthTest, false);
};

Debugger.prototype.drawLine2D = function drawLine2D (start, end, color, duration) {
  this._drawMng.addLine(start, end, color, duration, false, true);
};

Debugger.prototype.drawRect = function drawRect (x, y, w, h, color, duration) {
  this._drawMng.addRect2D(x, y, w, h, color, duration);
};

Debugger.prototype.drawAxes = function drawAxes (pos, rotation, scale, duration, depthTest) {
  this._drawMng.addAxes(pos, rotation, scale, duration, depthTest, false);
};

Debugger.prototype.drawAxes2D = function drawAxes2D (pos, rotation, scale, duration) {
  this._drawMng.addAxes(pos, rotation, scale, duration, false, true);
};

Debugger.prototype.drawSphere = function drawSphere (pos, radius, color, duration, depthTest) {
  this._drawMng.addSphere(pos, radius, color, duration, depthTest);
};

// ====================
// internal states
// ====================

Debugger.prototype._enter = function _enter () {
  var mainCam = this._app.scene.getCamera(0);
  if (!mainCam) {
    return;
  }

  // setup debug camera
  vec3.copy(this._orbit._node.lpos, mainCam._node.lpos);
  quat.copy(this._orbit._node.lrot, mainCam._node.lrot);
  vec3.copy(this._orbit._node.lscale, mainCam._node.lscale);
  this._orbit.reset();
  this._app.scene.setDebugCamera(this._camera);

  //
  this._app.scene.addView(this._view2D);

  //
  this._app.scene.addModel(this._grid);

  //
  this._state = 'fade2debug';
};

Debugger.prototype._fade2debug = function _fade2debug () {
  this._state = 'debug';
};

Debugger.prototype._debug = function _debug () {
  var dt = this._app.deltaTime;
  var canvasWidth = this._app._canvas.width;
  var canvasHeight = this._app._canvas.height;

  // update orbit camera
  this._orbit.tick(dt);

  // update view
  mat4.ortho(this._view2D._matProj, 0, canvasWidth, 0, canvasHeight, -100, 100);
  mat4.copy(this._view2D._matViewProj, this._view2D._matProj);
  mat4.invert(this._view2D._matInvViewProj, this._view2D._matProj);
  this._view2D._rect.x = this._view2D._rect.y = 0;
  this._view2D._rect.w = canvasWidth;
  this._view2D._rect.h = canvasHeight;
};

Debugger.prototype._fade2normal = function _fade2normal () {
  this._state = 'exit';
};

Debugger.prototype._exit = function _exit () {
  this._app.scene.removeModel(this._grid);

  // restore runtime states
  this._app.scene.setDebugCamera(null);

  //
  this._app.scene.removeView(this._view2D);

  this._state = 'sleep';
};

function _binaryIndexOf(array, key) {
  var lo = 0;
  var hi = array.length - 1;
  var mid;

  while (lo <= hi) {
    mid = ((lo + hi) >> 1);
    var val = array[mid];

    if (val < key) {
      lo = mid + 1;
    } else if (val > key) {
      hi = mid - 1;
    } else {
      return mid;
    }
  }

  return lo;
}

var AnimationClip = (function (Asset$$1) {
  function AnimationClip() {
    Asset$$1.call(this);

    /**
     * framesList: [{
     *   name: '',
     *   times: [0.0, ...],
     *   jionts: [{ id: -1, translations: [], rotations: [], scales: [] }, ...],
     * }, ...]
     */
    this._framesList = null;
    this._length = 0.0;

    // TODO:
    // this._events = []
  }

  if ( Asset$$1 ) AnimationClip.__proto__ = Asset$$1;
  AnimationClip.prototype = Object.create( Asset$$1 && Asset$$1.prototype );
  AnimationClip.prototype.constructor = AnimationClip;

  var prototypeAccessors = { length: { configurable: true } };

  prototypeAccessors.length.get = function () {
    return this._length;
  };

  AnimationClip.prototype.sample = function sample (skeleton, t) {
    var this$1 = this;

    clamp(t, 0, this._length);

    for (var i = 0; i < this._framesList.length; ++i) {
      var frames = this$1._framesList[i];

      if (frames.times.length === 1) {
        for (var j = 0; j < frames.joints.length; ++j) {
          var jointFrames = frames.joints[j];
          var joint = skeleton._joints[jointFrames.id];

          if (jointFrames.translations) {
            vec3.copy(joint.lpos, jointFrames.translations[0]);
          }

          if (jointFrames.rotations) {
            quat.copy(joint.lrot, jointFrames.rotations[0]);
          }

          if (jointFrames.scales) {
            vec3.copy(joint.lscale, jointFrames.scales[0]);
          }
        }
      } else {
        var idx = _binaryIndexOf(frames.times, t);
        if (idx === 0) {
          for (var j$1 = 0; j$1 < frames.joints.length; ++j$1) {
            var jointFrames$1 = frames.joints[j$1];
            var joint$1 = skeleton._joints[jointFrames$1.id];

            if (jointFrames$1.translations) {
              vec3.copy(joint$1.lpos, jointFrames$1.translations[0]);
            }

            if (jointFrames$1.rotations) {
              quat.copy(joint$1.lrot, jointFrames$1.rotations[0]);
            }

            if (jointFrames$1.scales) {
              vec3.copy(joint$1.lscale, jointFrames$1.scales[0]);
            }
          }

          return;
        }

        var loIdx = Math.max(idx - 1, 0);
        var hiIdx = Math.min(idx, frames.times.length);
        var ratio = (t - frames.times[loIdx]) / (frames.times[hiIdx] - frames.times[loIdx]);

        for (var j$2 = 0; j$2 < frames.joints.length; ++j$2) {
          var jointFrames$2 = frames.joints[j$2];
          var joint$2 = skeleton._joints[jointFrames$2.id];

          if (jointFrames$2.translations) {
            var a = jointFrames$2.translations[loIdx];
            var b = jointFrames$2.translations[hiIdx];

            vec3.lerp(joint$2.lpos, a, b, ratio);
          }

          if (jointFrames$2.rotations) {
            var a$1 = jointFrames$2.rotations[loIdx];
            var b$1 = jointFrames$2.rotations[hiIdx];

            quat.slerp(joint$2.lrot, a$1, b$1, ratio);
          }

          if (jointFrames$2.scales) {
            var a$2 = jointFrames$2.scales[loIdx];
            var b$2 = jointFrames$2.scales[hiIdx];

            vec3.lerp(joint$2.lscale, a$2, b$2, ratio);
          }
        }
      }
    }

    skeleton.updateMatrices();
  };

  Object.defineProperties( AnimationClip.prototype, prototypeAccessors );

  return AnimationClip;
}(Asset));

var Skeleton = function Skeleton() {
  this._root = null;
  this._joints = null;
  this._matrices = null;
};

Skeleton.prototype.setRoot = function setRoot (root) {
    var this$1 = this;

  this._root = root;
  this._joints = utils.flat(this._root);
  this._matrices = new Array(this._joints.length);

  for (var i = 0; i < this._joints.length; ++i) {
    this$1._matrices[i] = mat4.create();
  }
  this.updateMatrices();
};

Skeleton.prototype.blend = function blend (fromSkel, toSkel, alpha) {
    var this$1 = this;

  for (var i = 0; i < this._joints.length; ++i) {
    var joint = this$1._joints[i];
    var jointFrom = fromSkel._joints[i];
    var jointTo = toSkel._joints[i];

    vec3.lerp(joint.lpos, jointFrom.lpos, jointTo.lpos, alpha);
    vec3.lerp(joint.lscale, jointFrom.lscale, jointTo.lscale, alpha);
    quat.slerp(joint.lrot, jointFrom.lrot, jointTo.lrot, alpha);
  }
};

Skeleton.prototype.updateMatrices = function updateMatrices () {
    var this$1 = this;

  for (var i = 0; i < this._joints.length; ++i) {
    this$1._joints[i].getWorldMatrix(this$1._matrices[i]);
  }
};

Skeleton.prototype.getWorldMatrix = function getWorldMatrix (i) {
  return this._matrices[i];
};

Skeleton.prototype.clone = function clone () {
  var newSkeleton = new Skeleton();
  newSkeleton.setRoot(utils.deepClone(this._root));

  return newSkeleton;
};

var Joints = (function (Asset$$1) {
  function Joints() {
    Asset$$1.call(this);

    this._nodes = null;
  }

  if ( Asset$$1 ) Joints.__proto__ = Asset$$1;
  Joints.prototype = Object.create( Asset$$1 && Asset$$1.prototype );
  Joints.prototype.constructor = Joints;

  Joints.prototype.instantiate = function instantiate () {
    var joints = gltfUtils.createNodes(this._nodes);

    // create skeleton
    var skeleton = new Skeleton();
    skeleton.setRoot(joints[0]);

    return skeleton;
  };

  return Joints;
}(Asset));

var _type2size = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16,
};

var _compType2Array = {
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
  var acc = gltf.accessors[accessorID];
  var bufView = gltf.bufferViews[acc.bufferView];

  var num = _type2size[acc.type];
  var typedArray = _compType2Array[acc.componentType];
  var result = new typedArray(bin, bufView.byteOffset + acc.byteOffset, acc.count * num);

  return result;
}

/**
 * @param {Array} gltfNodes
 */
function createNodes(gltfNodes) {
  var nodes = new Array(gltfNodes.length);

  for (var i = 0; i < gltfNodes.length; ++i) {
    var gltfNode = gltfNodes[i];
    var node = new Node(gltfNode.name);

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

  for (var i$1 = 0; i$1 < gltfNodes.length; ++i$1) {
    var gltfNode$1 = gltfNodes[i$1];
    var node$1 = nodes[i$1];

    if ( gltfNode$1.children ) {
      for (var j = 0; j < gltfNode$1.children.length; ++j) {
        var index = gltfNode$1.children[j];
        node$1.append(nodes[index]);
      }
    }
  }

  return nodes;
}

/**
 * @param {Array} gltfNodes
 */
function createEntities(app, gltfNodes) {
  var nodes = new Array(gltfNodes.length);

  for (var i = 0; i < gltfNodes.length; ++i) {
    var gltfNode = gltfNodes[i];
    var node = app.createEntity(gltfNode.name);

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

  for (var i$1 = 0; i$1 < gltfNodes.length; ++i$1) {
    var gltfNode$1 = gltfNodes[i$1];
    var node$1 = nodes[i$1];

    if ( gltfNode$1.children ) {
      for (var j = 0; j < gltfNode$1.children.length; ++j) {
        var index = gltfNode$1.children[j];
        node$1.append(nodes[index]);
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

  var gltfMesh = gltf.meshes[index];
  var accessors = gltf.accessors;
  var attributes = gltfMesh.primitives[0].attributes;
  var vbView = null;

  // create mesh-asset
  var meshAsset = new Mesh();
  meshAsset._name = gltfMesh.name;
  meshAsset._subMeshes = new Array(gltfMesh.primitives.length);

  // create vertex-format
  var vfmt = [];
  var vcount = 0;

  if (attributes.POSITION !== undefined) {
    var acc = accessors[attributes.POSITION];
    vfmt.push({ name: gfx.ATTR_POSITION, type: acc.componentType, num: _type2size[acc.type] });

    vcount = acc.count;
    vbView = gltf.bufferViews[acc.bufferView];
  }

  if (attributes.NORMAL !== undefined) {
    var acc$1 = accessors[attributes.NORMAL];
    vfmt.push({ name: gfx.ATTR_NORMAL, type: acc$1.componentType, num: _type2size[acc$1.type] });
  }

  if (attributes.TANGENT !== undefined) {
    var acc$2 = accessors[attributes.TANGENT];
    vfmt.push({ name: gfx.ATTR_TANGENT, type: acc$2.componentType, num: _type2size[acc$2.type] });
  }

  if (attributes.TEXCOORD_0 !== undefined) {
    var acc$3 = accessors[attributes.TEXCOORD_0];
    vfmt.push({ name: gfx.ATTR_UV0, type: acc$3.componentType, num: _type2size[acc$3.type] });
  }

  if (attributes.TEXCOORD_1 !== undefined) {
    var acc$4 = accessors[attributes.TEXCOORD_1];
    vfmt.push({ name: gfx.ATTR_UV1, type: acc$4.componentType, num: _type2size[acc$4.type] });
  }

  if (attributes.TEXCOORD_2 !== undefined) {
    var acc$5 = accessors[attributes.TEXCOORD_2];
    vfmt.push({ name: gfx.ATTR_UV2, type: acc$5.componentType, num: _type2size[acc$5.type] });
  }

  if (attributes.TEXCOORD_3 !== undefined) {
    var acc$6 = accessors[attributes.TEXCOORD_3];
    vfmt.push({ name: gfx.ATTR_UV3, type: acc$6.componentType, num: _type2size[acc$6.type] });
  }

  if (attributes.COLOR_0 !== undefined) {
    var acc$7 = accessors[attributes.COLOR_0];
    vfmt.push({ name: gfx.ATTR_COLOR0, type: acc$7.componentType, num: _type2size[acc$7.type] });
  }

  if (attributes.JOINTS_0 !== undefined) {
    var acc$8 = accessors[attributes.JOINTS_0];
    vfmt.push({ name: gfx.ATTR_JOINTS, type: acc$8.componentType, num: _type2size[acc$8.type] });
  }

  if (attributes.WEIGHTS_0 !== undefined) {
    var acc$9 = accessors[attributes.WEIGHTS_0];
    vfmt.push({ name: gfx.ATTR_WEIGHTS, type: acc$9.componentType, num: _type2size[acc$9.type] });
  }

  // create vertex-buffer
  var vbData = new Uint8Array(bin, vbView.byteOffset, vbView.byteLength);
  var vb = new gfx.VertexBuffer(
    device,
    new gfx.VertexFormat(vfmt),
    gfx.USAGE_STATIC,
    vbData,
    vcount
  );

  // create index-buffer
  for (var i = 0; i < gltfMesh.primitives.length; ++i) {
    var primitive = gltfMesh.primitives[i];
    var ib = null;

    if (primitive.indices !== undefined) {
      var ibAcc = accessors[primitive.indices];
      var ibView = gltf.bufferViews[ibAcc.bufferView];
      var ibData = new Uint8Array(bin, ibView.byteOffset, ibView.byteLength);

      ib = new gfx.IndexBuffer(
        device,
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
    for (var i$1 = 0; i$1 < gltf.skins.length; ++i$1) {
      if (gltf.skins[i$1].name === gltfMesh.name) {
        meshAsset._skinning = createSkinning(gltf, bin, i$1);
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

  var gltfSkin = gltf.skins[index];

  // extract bindposes mat4 data
  var accessor = gltf.accessors[gltfSkin.inverseBindMatrices];
  var bufView = gltf.bufferViews[accessor.bufferView];
  var data = new Float32Array(bin, bufView.byteOffset + accessor.byteOffset, accessor.count * 16);
  var bindposes = new Array(accessor.count);

  for (var i = 0; i < accessor.count; ++i) {
    bindposes[i] = mat4.new(
      data[16 * i + 0 ], data[16 * i + 1 ], data[16 * i + 2 ], data[16 * i + 3 ],
      data[16 * i + 4 ], data[16 * i + 5 ], data[16 * i + 6 ], data[16 * i + 7 ],
      data[16 * i + 8 ], data[16 * i + 9 ], data[16 * i + 10], data[16 * i + 11],
      data[16 * i + 12], data[16 * i + 13], data[16 * i + 14], data[16 * i + 15]
    );
  }

  return {
    jointIndices: gltfSkin.joints,
    bindposes: bindposes,
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

  var gltfAnimation = gltf.animations[index];
  var framesList = [];
  var maxLength = -1;

  for (var i = 0; i < gltfAnimation.channels.length; ++i) {
    var gltfChannel = gltfAnimation.channels[i];
    var inputAcc = gltf.accessors[gltfChannel.input];

    // find frames by input name
    var frames = (void 0);
    for (var j = 0; j < framesList.length; ++j) {
      if (framesList[j].name === inputAcc.name) {
        frames = framesList[j];
        break;
      }
    }

    // if not found, create one
    if (!frames) {
      var inArray = createArray(gltf, bin, gltfChannel.input);
      var inputs = new Array(inArray.length);
      for (var i$1 = 0; i$1 < inArray.length; ++i$1) {
        var t = inArray[i$1];
        inputs[i$1] = t;

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
    var jointFrames = (void 0);
    for (var j$1 = 0; j$1 < frames.joints.length; ++j$1) {
      if (frames.joints[j$1].id === gltfChannel.node) {
        jointFrames = frames.joints[j$1];
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

    var outArray = createArray(gltf, bin, gltfChannel.output);
    if (gltfChannel.path === 'translation') {
      var cnt = outArray.length / 3;
      jointFrames.translations = new Array(cnt);
      for (var i$2 = 0; i$2 < cnt; ++i$2) {
        jointFrames.translations[i$2] = vec3.new(
          outArray[3 * i$2 + 0],
          outArray[3 * i$2 + 1],
          outArray[3 * i$2 + 2]
        );
      }
    } else if (gltfChannel.path === 'rotation') {
      var cnt$1 = outArray.length / 4;
      jointFrames.rotations = new Array(cnt$1);
      for (var i$3 = 0; i$3 < cnt$1; ++i$3) {
        jointFrames.rotations[i$3] = quat.new(
          outArray[4 * i$3 + 0],
          outArray[4 * i$3 + 1],
          outArray[4 * i$3 + 2],
          outArray[4 * i$3 + 3]
        );
      }
    } else if (gltfChannel.path === 'scale') {
      var cnt$2 = outArray.length / 3;
      jointFrames.scales = new Array(cnt$2);
      for (var i$4 = 0; i$4 < cnt$2; ++i$4) {
        jointFrames.scales[i$4] = vec3.new(
          outArray[3 * i$4 + 0],
          outArray[3 * i$4 + 1],
          outArray[3 * i$4 + 2]
        );
      }
    }
  }

  var animClip = new AnimationClip();
  animClip._name = gltfAnimation.name;
  animClip._framesList = framesList;
  animClip._length = maxLength;

  return animClip;
}

/**
 * @param {object} gltf
 */
function createJoints (gltf) {
  var joints = new Joints();
  joints._name = gltf.joints[0].name;
  joints._nodes = gltf.joints;

  return joints;
}

var gltfUtils = {
  createArray: createArray,
  createNodes: createNodes,
  createEntities: createEntities,
  createMesh: createMesh,
  createSkinning: createSkinning,
  createAnimationClip: createAnimationClip,
  createJoints: createJoints,
};

/**
 * (c) 2016 Mikola Lysenko. MIT License
 * https://github.com/regl-project/resl
 */

/* global XMLHttpRequest */
var configParameters = [
  'manifest',
  'onDone',
  'onProgress',
  'onError'
];

var manifestParameters = [
  'type',
  'src',
  'stream',
  'credentials',
  'parser'
];

var parserParameters = [
  'onData',
  'onDone'
];

var STATE_ERROR = -1;
var STATE_DATA = 0;
var STATE_COMPLETE = 1;

function raise(message) {
  throw new Error('resl: ' + message);
}

function checkType(object, parameters, name) {
  Object.keys(object).forEach(function (param) {
    if (parameters.indexOf(param) < 0) {
      raise('invalid parameter "' + param + '" in ' + name);
    }
  });
}

function Loader(name, cancel) {
  this.state = STATE_DATA;
  this.ready = false;
  this.progress = 0;
  this.name = name;
  this.cancel = cancel;
}

function resl(config) {
  if (typeof config !== 'object' || !config) {
    raise('invalid or missing configuration');
  }

  checkType(config, configParameters, 'config');

  var manifest = config.manifest;
  if (typeof manifest !== 'object' || !manifest) {
    raise('missing manifest');
  }

  function getFunction(name) {
    if (name in config) {
      var func = config[name];
      if (typeof func !== 'function') {
        raise('invalid callback "' + name + '"');
      }
      return func;
    }
    return null;
  }

  var onDone = getFunction('onDone');
  if (!onDone) {
    raise('missing onDone() callback');
  }

  var onProgress = getFunction('onProgress');
  var onError = getFunction('onError');

  var assets = {};

  var state = STATE_DATA;

  function loadXHR(request) {
    var name = request.name;
    var stream = request.stream;
    var binary = request.type === 'binary';
    var parser = request.parser;

    var xhr = new XMLHttpRequest();
    var asset = null;

    var loader = new Loader(name, cancel);

    if (stream) {
      xhr.onreadystatechange = onReadyStateChange;
    } else {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          onReadyStateChange();
        }
      };
    }

    if (binary) {
      xhr.responseType = 'arraybuffer';
    }

    function onReadyStateChange() {
      if (xhr.readyState < 2 ||
        loader.state === STATE_COMPLETE ||
        loader.state === STATE_ERROR) {
        return;
      }
      if (xhr.status !== 200) {
        return abort('error loading resource "' + request.name + '"');
      }
      if (xhr.readyState > 2 && loader.state === STATE_DATA) {
        var response;
        if (request.type === 'binary') {
          response = xhr.response;
        } else {
          response = xhr.responseText;
        }
        if (parser.data) {
          try {
            asset = parser.data(response);
          } catch (e) {
            return abort(e);
          }
        } else {
          asset = response;
        }
      }
      if (xhr.readyState > 3 && loader.state === STATE_DATA) {
        if (parser.done) {
          try {
            asset = parser.done();
          } catch (e) {
            return abort(e);
          }
        }
        loader.state = STATE_COMPLETE;
      }
      assets[name] = asset;
      loader.progress = 0.75 * loader.progress + 0.25;
      loader.ready =
        (request.stream && !!asset) ||
        loader.state === STATE_COMPLETE;
      notifyProgress();
    }

    function cancel() {
      if (loader.state === STATE_COMPLETE || loader.state === STATE_ERROR) {
        return;
      }
      xhr.onreadystatechange = null;
      xhr.abort();
      loader.state = STATE_ERROR;
    }

    // set up request
    if (request.credentials) {
      xhr.withCredentials = true;
    }
    xhr.open('GET', request.src, true);
    xhr.send();

    return loader;
  }

  function loadElement(request, element) {
    var name = request.name;
    var parser = request.parser;

    var loader = new Loader(name, cancel);
    var asset = element;

    function handleProgress() {
      if (loader.state === STATE_DATA) {
        if (parser.data) {
          try {
            asset = parser.data(element);
          } catch (e) {
            return abort(e);
          }
        } else {
          asset = element;
        }
      }
    }

    function onProgress(e) {
      handleProgress();
      assets[name] = asset;
      if (e.lengthComputable) {
        loader.progress = Math.max(loader.progress, e.loaded / e.total);
      } else {
        loader.progress = 0.75 * loader.progress + 0.25;
      }
      notifyProgress(name);
    }

    function onComplete() {
      handleProgress();
      if (loader.state === STATE_DATA) {
        if (parser.done) {
          try {
            asset = parser.done();
          } catch (e) {
            return abort(e);
          }
        }
        loader.state = STATE_COMPLETE;
      }
      loader.progress = 1;
      loader.ready = true;
      assets[name] = asset;
      removeListeners();
      notifyProgress('finish ' + name);
    }

    function onError() {
      abort('error loading asset "' + name + '"');
    }

    if (request.stream) {
      element.addEventListener('progress', onProgress);
    }
    if (request.type === 'image') {
      element.addEventListener('load', onComplete);
    } else {
      var canPlay = false;
      var loadedMetaData = false;
      element.addEventListener('loadedmetadata', function () {
        loadedMetaData = true;
        if (canPlay) {
          onComplete();
        }
      });
      element.addEventListener('canplay', function () {
        canPlay = true;
        if (loadedMetaData) {
          onComplete();
        }
      });
    }
    element.addEventListener('error', onError);

    function removeListeners() {
      if (request.stream) {
        element.removeEventListener('progress', onProgress);
      }
      if (request.type === 'image') {
        element.addEventListener('load', onComplete);
      } else {
        element.addEventListener('canplay', onComplete);
      }
      element.removeEventListener('error', onError);
    }

    function cancel() {
      if (loader.state === STATE_COMPLETE || loader.state === STATE_ERROR) {
        return;
      }

      loader.state = STATE_ERROR;
      removeListeners();
      element.src = '';
    }

    // set up request
    if (request.credentials) {
      element.crossOrigin = 'use-credentials';
    } else {
      element.crossOrigin = 'anonymous';
    }
    element.src = request.src;

    return loader;
  }

  var loaders = {
    text: loadXHR,
    binary: function (request) {
      // TODO use fetch API for streaming if supported
      return loadXHR(request);
    },
    image: function (request) {
      return loadElement(request, document.createElement('img'));
    },
    video: function (request) {
      return loadElement(request, document.createElement('video'));
    },
    audio: function (request) {
      return loadElement(request, document.createElement('audio'));
    }
  };

  // First we parse all objects in order to verify that all type information
  // is correct
  var pending = Object.keys(manifest).map(function (name) {
    var request = manifest[name];
    if (typeof request === 'string') {
      request = {
        src: request
      };
    } else if (typeof request !== 'object' || !request) {
      raise('invalid asset definition "' + name + '"');
    }

    checkType(request, manifestParameters, 'asset "' + name + '"');

    function getParameter(prop, accepted, init) {
      var value = init;
      if (prop in request) {
        value = request[prop];
      }
      if (accepted.indexOf(value) < 0) {
        raise('invalid ' + prop + ' "' + value + '" for asset "' + name + '", possible values: ' + accepted);
      }
      return value;
    }

    function getString(prop, required, init) {
      var value = init;
      if (prop in request) {
        value = request[prop];
      } else if (required) {
        raise('missing ' + prop + ' for asset "' + name + '"');
      }
      if (typeof value !== 'string') {
        raise('invalid ' + prop + ' for asset "' + name + '", must be a string');
      }
      return value;
    }

    function getParseFunc(name, dflt) {
      if (name in request.parser) {
        var result = request.parser[name];
        if (typeof result !== 'function') {
          raise('invalid parser callback ' + name + ' for asset "' + name + '"');
        }
        return result;
      } else {
        return dflt;
      }
    }

    var parser = {};
    if ('parser' in request) {
      if (typeof request.parser === 'function') {
        parser = {
          data: request.parser
        };
      } else if (typeof request.parser === 'object' && request.parser) {
        checkType(request.parser, parserParameters, 'parser for asset "' + name + '"');
        if (!('onData' in request.parser)) {
          raise('missing onData callback for parser in asset "' + name + '"');
        }
        parser = {
          data: getParseFunc('onData'),
          done: getParseFunc('onDone')
        };
      } else {
        raise('invalid parser for asset "' + name + '"');
      }
    }

    return {
      name: name,
      type: getParameter('type', Object.keys(loaders), 'text'),
      stream: !!request.stream,
      credentials: !!request.credentials,
      src: getString('src', true, ''),
      parser: parser
    };
  }).map(function (request) {
    return (loaders[request.type])(request);
  });

  function abort(message) {
    if (state === STATE_ERROR || state === STATE_COMPLETE) {
      return;
    }
    state = STATE_ERROR;
    pending.forEach(function (loader) {
      loader.cancel();
    });
    if (onError) {
      if (typeof message === 'string') {
        onError(new Error('resl: ' + message));
      } else {
        onError(message);
      }
    } else {
      console.error('resl error:', message);
    }
  }

  function notifyProgress(message) {
    if (state === STATE_ERROR || state === STATE_COMPLETE) {
      return;
    }

    var progress = 0;
    var numReady = 0;
    pending.forEach(function (loader) {
      if (loader.ready) {
        numReady += 1;
      }
      progress += loader.progress;
    });

    if (numReady === pending.length) {
      state = STATE_COMPLETE;
      onDone(assets);
    } else {
      if (onProgress) {
        onProgress(progress / pending.length, message);
      }
    }
  }

  if (pending.length === 0) {
    setTimeout(function () {
      notifyProgress('done');
    }, 1);
  }
}

var meshLoader = function (app, urls, callback) {
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

    onDone: function onDone(data) {
      var gltf = data.gltf;
      var bin = data.bin;

      if (!gltf.meshes.length) {
        callback(new Error('No mesh in the gltf.'));
        return;
      }

      var meshAsset = gltfUtils.createMesh(app.device, gltf, bin, 0);
      callback(null, meshAsset);
    }
  });
};

var enums$2 = {
  // blend type
  BLEND_NONE: 0,
  BLEND_NORMAL: 1,

  // wrap mode
  WRAP_REPEAT: gfx.WRAP_REPEAT,
  WRAP_CLAMP: gfx.WRAP_CLAMP,
  WRAP_MIRROR: gfx.WRAP_MIRROR,

  // filter mode
  FILTER_NEAREST: gfx.FILTER_NEAREST,
  FILTER_LINEAR: gfx.FILTER_LINEAR,

  // animation blend mode
  ANIM_BLEND: 0,
  ANIM_ADDITIVE: 1,

  // animation wrap mode
  ANIM_WRAP_ONCE: 0,
  ANIM_WRAP_LOOP: 1,
  ANIM_WRAP_PINGPONG: 2,
  ANIM_WRAP_CLAMP: 3,

  // anchor
  ANCHOR_CENTER: 0,
  ANCHOR_TOP_LEFT: 1,
  ANCHOR_TOP_RIGHT: 2,
  ANCHOR_MID_LEFT: 3,
  ANCHOR_MID_RIGHT: 4,
  ANCHOR_BOTTOM_LEFT: 5,
  ANCHOR_BOTTOM_RIGHT: 6,

  // sprite type
  SPRITE_SIMPLE: 0,
  SPRITE_SLICED: 1,

  // text alignment for horizontal and vertical
  TEXT_ALIGN_LEFT: 0,
  TEXT_ALIGN_CENTER: 1,
  TEXT_ALIGN_RIGHT: 2,
  TEXT_ALIGN_BOTTOM: 3,
  TEXT_ALIGN_TOP: 4,
};

var PhongMaterial = (function (Material$$1) {
  function PhongMaterial() {
    Material$$1.call(this);
    var mainTech = new renderer.Technique(
      ['opaque'],
      [
        { name: 'diffuseColor', type: renderer.PARAM_COLOR3 },
        { name: 'diffuseTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'emissiveColor', type: renderer.PARAM_COLOR3 },
        { name: 'emissiveTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'specularColor', type: renderer.PARAM_COLOR3 },
        { name: 'specularTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'glossiness', type: renderer.PARAM_FLOAT },
        { name: 'opacity', type: renderer.PARAM_FLOAT },
        { name: 'opacityTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'normalTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'alphaTestThreshold', type: renderer.PARAM_FLOAT },
        { name: 'diffuseTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'diffuseOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'emissiveTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'emissiveOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'opacityTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'opacityOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'specularTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'specularOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'normalMapTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'normalMapOffset', type: renderer.PARAM_FLOAT2 }
      ],
      [new renderer.Pass('phong')]
    );

    var passShadow = new renderer.Pass('shadow_mapping_depth');
    passShadow.setDepth(true,true);
    passShadow.setCullMode(gfx.CULL_BACK);
    var shadowTech = new renderer.Technique(
      ['shadowcast'],
      [
        //{ name: 'shadowMap', type: renderer.PARAM_TEXTURE_2D },
      ],
      [passShadow]
    );

    this._effect = new renderer.Effect(
      [
        mainTech,
        shadowTech
      ],
      {},
      [
        { name: 'useNormal', value: true },
        { name: 'useUV0', value: true },
        { name: 'useDiffuse', value: true },
        { name: 'useDiffuseTexture', value: false },
        { name: 'useEmissive', value: false },
        { name: 'useEmissiveTexture', value: false },
        { name: 'useSpecular', value: false },
        { name: 'useSpecularTexture', value: false },
        { name: 'useNormalTexture', value: false },
        { name: 'useOpacity', value: false },
        { name: 'useOpacityTexture', value: false },
        { name: 'useAlphaTest', value: false },
        { name: 'useShadowMap', value: true } ]
    );

    this._mainTech = mainTech;
    this._diffuseTexture = null;
    this._emissiveTexture = null;
    this._opacityTexture = null;
    this._specularTexture = null;
    this._normalTexture = null;

    this.blendType = enums$2.BLEND_NONE;
    this.diffuseColor = color3.new(0.8, 0.8, 0.8);
    this.emissiveColor = color3.create();

    this.opacity = 1.0;
    this.alphaTestThreshold = 0.0;

    this.specularColor = color3.create();
    this.glossiness = 10.0;
    this.diffuseTiling = vec2.new(1, 1);
    this.specularTiling = vec2.new(1, 1);
    this.emissiveTiling = vec2.new(1, 1);
    this.opacityTiling = vec2.new(1, 1);
    this.normalTiling = vec2.new(1, 1);

    this.diffuseOffset = vec2.new(0, 0);
    this.specularOffset = vec2.new(0, 0);
    this.emissiveOffset = vec2.new(0, 0);
    this.opacityOffset = vec2.new(0, 0);
    this.normalOffset = vec2.new(0, 0);
  }

  if ( Material$$1 ) PhongMaterial.__proto__ = Material$$1;
  PhongMaterial.prototype = Object.create( Material$$1 && Material$$1.prototype );
  PhongMaterial.prototype.constructor = PhongMaterial;

  var prototypeAccessors = { blendType: { configurable: true },diffuseColor: { configurable: true },diffuseTexture: { configurable: true },diffuseTiling: { configurable: true },diffuseOffset: { configurable: true },useDiffuseTexture: { configurable: true },emissiveColor: { configurable: true },emissiveTexture: { configurable: true },emissiveTiling: { configurable: true },emissiveOffset: { configurable: true },useEmissive: { configurable: true },useEmissiveTexture: { configurable: true },opacity: { configurable: true },opacityTexture: { configurable: true },opacityTiling: { configurable: true },opacityOffset: { configurable: true },useOpacity: { configurable: true },useOpacityTexture: { configurable: true },alphaTestThreshold: { configurable: true },useAlphaTest: { configurable: true },useSpecular: { configurable: true },useSpecularTexture: { configurable: true },specularColor: { configurable: true },glossiness: { configurable: true },specularTexture: { configurable: true },specularTiling: { configurable: true },specularOffset: { configurable: true },useNormalTexture: { configurable: true },normalTexture: { configurable: true },normalTiling: { configurable: true },normalOffset: { configurable: true },useShadowMap: { configurable: true } };

  prototypeAccessors.blendType.get = function () {
    return this._blendType;
  };
  prototypeAccessors.blendType.set = function (val) {
    if (this._blendType === val) {
      return;
    }

    var pass = this._mainTech.passes[0];
    this._blendType = val;

    if (val === enums$2.BLEND_NONE) {
      this._mainTech.setStages(['opaque']);
      pass._blend = false;
      pass.setDepth(true, true);
    } else if (val === enums$2.BLEND_NORMAL) {
      this._mainTech.setStages(['transparent']);
      pass.setDepth(true, false);
      pass.setBlend(
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_ONE, gfx.BLEND_ONE
      );
    }
  };

  prototypeAccessors.diffuseColor.set = function (val) {
    this._effect.setValue('diffuseColor', val);
  };

  prototypeAccessors.diffuseTexture.set = function (val) {
    this._diffuseTexture = val;
    this._effect.setValue('diffuseTexture', val._texture);
  };

  prototypeAccessors.diffuseTiling.set = function (val) {
    this._effect.setValue('diffuseTiling', val);
  };

  prototypeAccessors.diffuseOffset.set = function (val) {
    this._effect.setValue('diffuseOffset', val);
  };

  prototypeAccessors.useDiffuseTexture.set = function (val) {
    this._effect.setOption('useDiffuseTexture', val);
  };

  prototypeAccessors.emissiveColor.set = function (val) {
    this._effect.setValue('emissiveColor', val);
  };

  prototypeAccessors.emissiveTexture.set = function (val) {
    this._emissiveTexture = val;
    this._effect.setValue('emissiveTexture', val._texture);
  };

  prototypeAccessors.emissiveTiling.set = function (val) {
    this._effect.setValue('emissiveTiling', val);
  };

  prototypeAccessors.emissiveOffset.set = function (val) {
    this._effect.setValue('emissiveOffset', val);
  };

  prototypeAccessors.useEmissive.set = function (val) {
    this._effect.setOption('useEmissive', val);
  };

  prototypeAccessors.useEmissiveTexture.set = function (val) {
    this._effect.setOption('useEmissiveTexture', val);
    if (val === true) {
      this.useEmissive = val;
    }
  };

  prototypeAccessors.opacity.set = function (val) {
    this._effect.setValue('opacity', val);
  };

  prototypeAccessors.opacityTexture.set = function (val) {
    this._opacityTexture = val;
    this._effect.setValue('opacityTexture', val._texture);
  };

  prototypeAccessors.opacityTiling.set = function (val) {
    this._effect.setValue('opacityTiling', val);
  };

  prototypeAccessors.opacityOffset.set = function (val) {
    this._effect.setValue('opacityOffset', val);
  };

  prototypeAccessors.useOpacity.set = function (val) {
    this._effect.setOption('useOpacity', val);
  };

  prototypeAccessors.useOpacityTexture.set = function (val) {
    this._effect.setOption('useOpacityTexture', val);
    if (val === true) {
      this.useOpacity = val;
    }
  };

  prototypeAccessors.alphaTestThreshold.set = function (val) {
    this._effect.setValue('alphaTestThreshold', val);
  };

  prototypeAccessors.useAlphaTest.set = function (val) {
    this._effect.setOption('useAlphaTest', val);
  };

  prototypeAccessors.useSpecular.set = function (val) {
    this._effect.setOption('useSpecular', val);
  };

  prototypeAccessors.useSpecularTexture.set = function (val) {
    this._effect.setOption('useSpecularTexture', val);
  };

  prototypeAccessors.specularColor.set = function (val) {
    this._effect.setValue('specularColor', val);
  };

  prototypeAccessors.glossiness.set = function (val) {
    this._effect.setValue('glossiness', val);
  };

  prototypeAccessors.specularTexture.set = function (val) {
    this._specularTexture = val;
    this._effect.setValue('specularTexture', val._texture);
  };

  prototypeAccessors.specularTiling.set = function (val) {
    this._effect.setValue('specularTiling', val);
  };

  prototypeAccessors.specularOffset.set = function (val) {
    this._effect.setValue('specularOffset', val);
  };

  prototypeAccessors.useNormalTexture.set = function (val) {
    this._effect.setOption('useNormalTexture', val);
  };

  prototypeAccessors.normalTexture.set = function (val) {
    this._normalTexture = val;
    this._effect.setValue('normalTexture', val._texture);
  };

  prototypeAccessors.normalTiling.set = function (val) {
    this._effect.setValue('normalMapTiling', val);
  };

  prototypeAccessors.normalOffset.set = function (val) {
    this._effect.setValue('normalMapOffset', val);
  };

  prototypeAccessors.useShadowMap.set = function (val) {
    this._effect.setOption('useShadowMap', val);
  };

  Object.defineProperties( PhongMaterial.prototype, prototypeAccessors );

  return PhongMaterial;
}(Material));

var MatcapMaterial = (function (Material$$1) {
  function MatcapMaterial() {
    Material$$1.call(this);
    var pass = new renderer.Pass('matcap');
    pass.setDepth(true,true);

    var mainTech = new renderer.Technique(
      ['opaque'],
      [
        { name: 'mainTex', type: renderer.PARAM_TEXTURE_2D },
        { name: 'matcapTex', type: renderer.PARAM_TEXTURE_2D },
        { name: 'colorFactor', type: renderer.PARAM_FLOAT },
        { name: 'color', type: renderer.PARAM_COLOR4 } ],
      [pass]
    );

    this._effect = new renderer.Effect(
      [mainTech],
      {},
      [
        { name: 'useMainTex', value: true },
        { name: 'useSkinning', value: true} ]
    );
    this._mainTex = null;
    this._matcapTex = null;
    this._colorFactor = 0.5;
    this._color = color4.new(1.0, 1.0, 1.0, 1.0);
  }

  if ( Material$$1 ) MatcapMaterial.__proto__ = Material$$1;
  MatcapMaterial.prototype = Object.create( Material$$1 && Material$$1.prototype );
  MatcapMaterial.prototype.constructor = MatcapMaterial;

  var prototypeAccessors = { mainTex: { configurable: true },matcapTex: { configurable: true },colorFactor: { configurable: true },color: { configurable: true },useMainTex: { configurable: true },useSkinning: { configurable: true } };

  prototypeAccessors.mainTex.get = function () {
    return this._mainTex;
  };

  prototypeAccessors.matcapTex.get = function () {
    return this._matcapTex;
  };

  prototypeAccessors.colorFactor.get = function () {
    return this._colorFactor;
  };

  prototypeAccessors.mainTex.set = function (val) {
    if (this._mainTex === val) {
      return;
    }
    this._mainTex = val;
    this._effect.setValue('mainTex', val._texture);
  };

  prototypeAccessors.matcapTex.set = function (val) {
    if (this._matcapTex === val) {
      return;
    }
    this._matcapTex = val;
    this._effect.setValue('matcapTex', val._texture);
  };

  prototypeAccessors.colorFactor.set = function (val) {
    if (this._colorFactor === val) {
      return;
    }
    this._colorFactor = val;
    this._effect.setValue('colorFactor', val);
  };

  prototypeAccessors.color.set = function (val) {
    if (this._color === val) {
      return;
    }
    this._color = val;
    this._effect.setValue('color',val);
  };

  prototypeAccessors.useMainTex.set = function (val) {
    this._effect.setOption('useMainTex', val);
  };

  prototypeAccessors.useSkinning.set = function (val) {
    this._effect.setOption('useSkinning', val);
  };

  Object.defineProperties( MatcapMaterial.prototype, prototypeAccessors );

  return MatcapMaterial;
}(Material));

var PbrMaterial = (function (Material$$1) {
  function PbrMaterial() {
    Material$$1.call(this);
    var passPbr = new renderer.Pass('pbr');
    passPbr.setDepth(true,true);

    var mainTech = new renderer.Technique(
      ['opaque'],
      [
        { name: 'albedo', type: renderer.PARAM_COLOR3 },
        { name: 'albedoTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'albedoOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'albedoTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'metalRoughnessTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'metalRoughnessOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'metallic', type: renderer.PARAM_FLOAT },
        { name: 'metallicTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'metallicOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'metallicTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'roughness', type: renderer.PARAM_FLOAT },
        { name: 'roughnessTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'roughnessOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'roughnessTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'ao', type: renderer.PARAM_FLOAT },
        { name: 'aoTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'aoOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'aoTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'normalMapTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'normalMapOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'normalTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'diffuseEnvTexture', type: renderer.PARAM_TEXTURE_CUBE },
        { name: 'specularEnvTexture', type: renderer.PARAM_TEXTURE_CUBE },
        { name: 'brdfLUT', type: renderer.PARAM_TEXTURE_2D },
        { name: 'maxReflectionLod', type: renderer.PARAM_FLOAT },
        { name: 'opacity', type: renderer.PARAM_FLOAT },
        { name: 'opacityTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'opacityOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'opacityTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'alphaTestThreshold', type: renderer.PARAM_FLOAT } ],
      [passPbr]
    );

    var passShadow = new renderer.Pass('shadow_mapping_depth');
    passShadow.setDepth(true,true);
    passShadow.setCullMode(gfx.CULL_BACK);
    var shadowTech = new renderer.Technique(
      ['shadowcast'],
      [
        //{ name: 'shadowMap', type: renderer.PARAM_TEXTURE_2D },
      ],
      [passShadow]
    );

    // TODO: add blend type?
    this._effect = new renderer.Effect(
      [mainTech, shadowTech],
      {},
      [
        { name: 'useNormal', value: true },
        { name: 'useUV0', value: true },
        { name: 'useSkinning', value: false },
        { name: 'useNormalTexture', value: false },
        { name: 'useAlbedoTexture', value: false },
        { name: 'useMetalRoughnessTexture', value: false },
        { name: 'useMetallicTexture', value: false },
        { name: 'useRoughnessTexture', value: false },
        { name: 'useAoTexture', value: false },
        { name: 'useIBL', value: false },
        { name: 'useTexLod', value: false },
        { name: 'useOpacity', value: false },
        { name: 'useOpacityTexture', value: false },
        { name: 'useAlphaTest', value: false },
        { name: 'useShadowMap', value: true } ]
    );

    this._mainTech = mainTech;
    this.blendType = enums$2.BLEND_NONE;
    this._normalTexture = null;
    this._albedoTexture = null;
    this._metallicTexture = null;
    this._roughnessTexture = null;
    this._diffuseEnvTexture = null;
    this._specularEnvTexture = null;
    this._brdfLUT = null;
    this._opacityTexture = null;

    this.albedo = color3.new(0.8, 0.8, 0.8);
    this.metallic = 1.0;
    this.roughness = 0.5;
    this.ao = 0.2;

    this.opacity = 1.0;
    this.alphaTestThreshold = 0.0;

    this.albedoTiling = vec2.new(1, 1);
    this.metalRoughnessTiling = vec2.new(1, 1);
    this.metallicTiling = vec2.new(1, 1);
    this.roughnessTiling = vec2.new(1, 1);
    this.aoTiling = vec2.new(1, 1);
    this.normalTiling = vec2.new(1, 1);
    this.opacityTiling = vec2.new(1, 1);

    this.albedoOffset = vec2.new(0, 0);
    this.metalRoughnessOffset = vec2.new(0, 0);
    this.metallicOffset = vec2.new(0, 0);
    this.roughnessOffset = vec2.new(0, 0);
    this.aoOffset = vec2.new(0, 0);
    this.normalOffset = vec2.new(0, 0);
    this.opacityOffset = vec2.new(0, 0);

    this.maxReflectionLod = 9.0;

    this._shadowMap = null;
  }

  if ( Material$$1 ) PbrMaterial.__proto__ = Material$$1;
  PbrMaterial.prototype = Object.create( Material$$1 && Material$$1.prototype );
  PbrMaterial.prototype.constructor = PbrMaterial;

  var prototypeAccessors = { blendType: { configurable: true },albedo: { configurable: true },albedoTexture: { configurable: true },albedoTiling: { configurable: true },albedoOffset: { configurable: true },useAlbedoTexture: { configurable: true },metallic: { configurable: true },metallicTexture: { configurable: true },metallicTiling: { configurable: true },metallicOffset: { configurable: true },useMetallicTexture: { configurable: true },roughness: { configurable: true },roughnessTexture: { configurable: true },roughnessTiling: { configurable: true },roughnessOffset: { configurable: true },useRoughnessTexture: { configurable: true },ao: { configurable: true },aoTexture: { configurable: true },aoTiling: { configurable: true },aoOffset: { configurable: true },useAoTexture: { configurable: true },normalTexture: { configurable: true },normalTiling: { configurable: true },normalOffset: { configurable: true },useNormalTexture: { configurable: true },diffuseEnvTexture: { configurable: true },specularEnvTexture: { configurable: true },brdfLUT: { configurable: true },useIBL: { configurable: true },useTexLod: { configurable: true },maxReflectionLod: { configurable: true },opacity: { configurable: true },opacityTexture: { configurable: true },opacityTiling: { configurable: true },opacityOffset: { configurable: true },useOpacity: { configurable: true },useOpacityTexture: { configurable: true },alphaTestThreshold: { configurable: true },useShadowMap: { configurable: true },shadowMap: { configurable: true } };

  prototypeAccessors.blendType.get = function () {
    return this._blendType;
  };
  prototypeAccessors.blendType.set = function (val) {
    if (this._blendType === val) {
      return;
    }

    var pass = this._mainTech.passes[0];
    this._blendType = val;

    if (val === enums$2.BLEND_NONE) {
      this._mainTech.setStages(['opaque']);
      pass._blend = false;
      pass.setDepth(true, true);
    } else if (val === enums$2.BLEND_NORMAL) {
      this._mainTech.setStages(['transparent']);
      pass.setDepth(true, false);
      pass.setBlend(
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_ONE, gfx.BLEND_ZERO
      );
    }
  };

  prototypeAccessors.albedo.set = function (val) {
    this._effect.setValue('albedo', val);
  };

  prototypeAccessors.albedoTexture.set = function (val) {
    this._albedoTexture = val;
    this._effect.setValue('albedoTexture', val._texture);
  };

  prototypeAccessors.albedoTiling.set = function (val) {
    this._effect.setValue('albedoTiling', val);
  };

  prototypeAccessors.albedoOffset.set = function (val) {
    this._effect.setValue('albedoOffset', val);
  };

  prototypeAccessors.useAlbedoTexture.set = function (val) {
    this._effect.setOption('useAlbedoTexture', val);
  };

  prototypeAccessors.metallic.set = function (val) {
    this._effect.setValue('metallic', val);
  };

  prototypeAccessors.metallicTexture.set = function (val) {
    this._metallicTexture = val;
    this._effect.setValue('metallicTexture', val._texture);
  };

  prototypeAccessors.metallicTiling.set = function (val) {
    this._effect.setValue('metallicTiling', val);
  };

  prototypeAccessors.metallicOffset.set = function (val) {
    this._effect.setValue('metallicOffset', val);
  };

  prototypeAccessors.useMetallicTexture.set = function (val) {
    this._effect.setOption('useMetallicTexture', val);
  };

  prototypeAccessors.roughness.set = function (val) {
    this._effect.setValue('roughness', val);
  };

  prototypeAccessors.roughnessTexture.set = function (val) {
    this._roughnessTexture = val;
    this._effect.setValue('roughnessTexture', val._texture);
  };

  prototypeAccessors.roughnessTiling.set = function (val) {
    this._effect.setValue('roughnessTiling', val);
  };

  prototypeAccessors.roughnessOffset.set = function (val) {
    this._effect.setValue('roughnessOffset', val);
  };

  prototypeAccessors.useRoughnessTexture.set = function (val) {
    this._effect.setOption('useRoughnessTexture', val);
  };

  prototypeAccessors.ao.set = function (val) {
    this._effect.setValue('ao', val);
  };

  prototypeAccessors.aoTexture.set = function (val) {
    this._aoTexture = val;
    this._effect.setValue('aoTexture', val._texture);
  };

  prototypeAccessors.aoTiling.set = function (val) {
    this._effect.setValue('aoTiling', val);
  };

  prototypeAccessors.aoOffset.set = function (val) {
    this._effect.setValue('aoOffset', val);
  };

  prototypeAccessors.useAoTexture.set = function (val) {
    this._effect.setOption('useAoTexture', val);
  };

  prototypeAccessors.normalTexture.set = function (val) {
    this._normalTexture = val;
    this._effect.setValue('normalTexture', val._texture);
  };

  prototypeAccessors.normalTiling.set = function (val) {
    this._effect.setValue('normalMapTiling', val);
  };

  prototypeAccessors.normalOffset.set = function (val) {
    this._effect.setValue('normalMapOffset', val);
  };

  prototypeAccessors.useNormalTexture.set = function (val) {
    this._effect.setOption('useNormalTexture', val);
  };

  prototypeAccessors.diffuseEnvTexture.set = function (val) {
    this._diffuseEnvTexture = val;
    this._effect.setValue('diffuseEnvTexture', val._texture);
  };

  prototypeAccessors.specularEnvTexture.set = function (val) {
    this._specularEnvTexture = val;
    this._effect.setValue('specularEnvTexture', val._texture);
  };

  prototypeAccessors.brdfLUT.set = function (val) {
    this._brdfLUT = val;
    this._effect.setValue('brdfLUT', val._texture);
  };

  prototypeAccessors.useIBL.set = function (val) {
    this._effect.setOption('useIBL', val);
  };

  prototypeAccessors.useTexLod.set = function (val) {
    // TODO: check whether EXT_shader_texture_lod is valid.
    this._effect.setOption('useTexLod', val);
  };

  prototypeAccessors.maxReflectionLod.set = function (val) {
    this._effect.setValue('maxReflectionLod', val);
  };

  prototypeAccessors.opacity.set = function (val) {
    this._effect.setValue('opacity', val);
  };

  prototypeAccessors.opacityTexture.set = function (val) {
    this._opacityTexture = val;
    this._effect.setValue('opacityTexture', val._texture);
  };

  prototypeAccessors.opacityTiling.set = function (val) {
    this._effect.setValue('opacityTiling', val);
  };

  prototypeAccessors.opacityOffset.set = function (val) {
    this._effect.setValue('opacityOffset', val);
  };

  prototypeAccessors.useOpacity.set = function (val) {
    this._effect.setOption('useOpacity', val);
  };

  prototypeAccessors.useOpacityTexture.set = function (val) {
    this._effect.setOption('useOpacityTexture', val);
    if (val === true) {
      this.useOpacity = val;
    }
  };

  prototypeAccessors.alphaTestThreshold.set = function (val) {
    this._effect.setValue('alphaTestThreshold', val);
  };

  prototypeAccessors.useShadowMap.set = function (val) {
    this._effect.setOption('useShadowMap', val);
  };

  prototypeAccessors.shadowMap.set = function (val) {
    //this._shadowMap = val;
    //this._effect.setValue('shadowMap', val._texture);
  };

  Object.defineProperties( PbrMaterial.prototype, prototypeAccessors );

  return PbrMaterial;
}(Material));

var GridMaterial = (function (Material$$1) {
  function GridMaterial() {
    Material$$1.call(this);

    var mainTech = new renderer.Technique(
      ['opaque'],
      [
        { name: 'tiling', type: renderer.PARAM_FLOAT2 },
        { name: 'baseColorWhite', type: renderer.PARAM_COLOR3 },
        { name: 'baseColorBlack', type: renderer.PARAM_COLOR3 },
        { name: 'basePattern', type: renderer.PARAM_TEXTURE_2D },
        { name: 'basePatternTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'basePatternOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'subPatternColor', type: renderer.PARAM_COLOR4 },
        { name: 'subPattern', type: renderer.PARAM_TEXTURE_2D },
        { name: 'subPatternTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'subPatternOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'subPatternColor2', type: renderer.PARAM_COLOR4 },
        { name: 'subPattern2', type: renderer.PARAM_TEXTURE_2D },
        { name: 'subPattern2Tiling', type: renderer.PARAM_FLOAT2 },
        { name: 'subPattern2Offset', type: renderer.PARAM_FLOAT2 } ],
      [new renderer.Pass('grid')]
    );

    this._effect = new renderer.Effect(
      [
        mainTech ],
      {
      },
      [
        { name: 'useWorldPos', value: false } ]
    );

    this._mainTech = mainTech;
    this._basePattern = null;
    this._subPattern = null;
    this._subPattern2 = null;

    this.tiling = vec2.new(1,1);

    this.baseColorWhite = color3.new(1,1,1);
    this.baseColorBlack = color3.new(0,0,0);
    this.basePatternTiling = vec2.new(1,1);
    this.basePatternOffset = vec2.new(0,0);

    this.subPatternColor = color4.new(1,1,1,1);
    this.subPatternTiling = vec2.new(1,1);
    this.subPatternOffset = vec2.new(0,0);

    this.subPatternColor2 = color4.new(1,1,1,1);
    this.subPattern2Tiling = vec2.new(1,1);
    this.subPattern2Offset = vec2.new(0,0);

    this.blendType = enums$2.BLEND_NONE;
  }

  if ( Material$$1 ) GridMaterial.__proto__ = Material$$1;
  GridMaterial.prototype = Object.create( Material$$1 && Material$$1.prototype );
  GridMaterial.prototype.constructor = GridMaterial;

  var prototypeAccessors = { blendType: { configurable: true },useWorldPos: { configurable: true },tiling: { configurable: true },baseColorWhite: { configurable: true },baseColorBlack: { configurable: true },basePattern: { configurable: true },basePatternTiling: { configurable: true },basePatternOffset: { configurable: true },subPatternColor: { configurable: true },subPattern: { configurable: true },subPatternTiling: { configurable: true },subPatternOffset: { configurable: true },subPatternColor2: { configurable: true },subPattern2: { configurable: true },subPattern2Tiling: { configurable: true },subPattern2Offset: { configurable: true } };

  prototypeAccessors.blendType.get = function () {
    return this._blendType;
  };
  prototypeAccessors.blendType.set = function (val) {
    if (this._blendType === val) {
      return;
    }

    var pass = this._mainTech.passes[0];
    this._blendType = val;

    if (val === enums$2.BLEND_NONE) {
      this._mainTech.setStages(['opaque']);
      pass._blend = false;
      pass.setDepth(true, true);
    } else if (val === enums$2.BLEND_NORMAL) {
      this._mainTech.setStages(['transparent']);
      pass.setDepth(true, false);
      pass.setBlend(
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_ONE, gfx.BLEND_ONE
      );
    }
  };

  prototypeAccessors.useWorldPos.set = function (val) {
    this._effect.setOption('useWorldPos', val);
  };

  prototypeAccessors.tiling.set = function (val) {
    this._effect.setValue('tiling', val);
  };

  prototypeAccessors.baseColorWhite.set = function (val) {
    this._effect.setValue('baseColorWhite', val);
  };

  prototypeAccessors.baseColorBlack.set = function (val) {
    this._effect.setValue('baseColorBlack', val);
  };

  prototypeAccessors.basePattern.set = function (val) {
    this._basePattern = val;
    this._effect.setValue('basePattern', val._texture);
  };

  prototypeAccessors.basePatternTiling.set = function (val) {
    this._effect.setValue('basePatternTiling', val);
  };

  prototypeAccessors.basePatternOffset.set = function (val) {
    this._effect.setValue('basePatternOffset', val);
  };

  prototypeAccessors.subPatternColor.set = function (val) {
    this._effect.setValue('subPatternColor', val);
  };

  prototypeAccessors.subPattern.set = function (val) {
    this._subPattern = val;
    this._effect.setValue('subPattern', val._texture);
  };

  prototypeAccessors.subPatternTiling.set = function (val) {
    this._effect.setValue('subPatternTiling', val);
  };

  prototypeAccessors.subPatternOffset.set = function (val) {
    this._effect.setValue('subPatternOffset', val);
  };

  prototypeAccessors.subPatternColor2.set = function (val) {
    this._effect.setValue('subPatternColor2', val);
  };

  prototypeAccessors.subPattern2.set = function (val) {
    this._subPattern2 = val;
    this._effect.setValue('subPattern2', val._texture);
  };

  prototypeAccessors.subPattern2Tiling.set = function (val) {
    this._effect.setValue('subPattern2Tiling', val);
  };

  prototypeAccessors.subPattern2Offset.set = function (val) {
    this._effect.setValue('subPattern2Offset', val);
  };

  Object.defineProperties( GridMaterial.prototype, prototypeAccessors );

  return GridMaterial;
}(Material));

var UnlitMaterial = (function (Material$$1) {
  function UnlitMaterial() {
    Material$$1.call(this);

    var mainTech = new renderer.Technique(
      ['opaque'],
      [
        { name: 'mainTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'color', type: renderer.PARAM_COLOR4, } ],
      [new renderer.Pass('unlit')]
    );

    // let shadowTech = new Technique(
    //   renderer.STAGE_SHADOW,
    //   [
    //   ],
    //   [
    //     new Pass('shadow')
    //   ]
    // );

    this._effect = new renderer.Effect(
      [
        mainTech ],
      {
        color: color4.new(1, 1, 1, 1),
      },
      [
        { name: 'useTexture', value: false },
        { name: 'useColor', value: false } ]
    );
    this._mainTech = mainTech;
    this._mainTexture = null;
    this.blendType = enums$2.BLEND_NONE;
  }

  if ( Material$$1 ) UnlitMaterial.__proto__ = Material$$1;
  UnlitMaterial.prototype = Object.create( Material$$1 && Material$$1.prototype );
  UnlitMaterial.prototype.constructor = UnlitMaterial;

  var prototypeAccessors = { blendType: { configurable: true },useColor: { configurable: true },useTexture: { configurable: true },color: { configurable: true },mainTexture: { configurable: true } };

  prototypeAccessors.blendType.get = function () {
    return this._blendType;
  };
  prototypeAccessors.blendType.set = function (val) {
    if (this._blendType === val) {
      return;
    }

    var pass = this._mainTech.passes[0];
    this._blendType = val;

    if (val === enums$2.BLEND_NONE) {
      this._mainTech.setStages(['opaque']);
      pass._blend = false;
      pass.setDepth(true, true);
    } else if (val === enums$2.BLEND_NORMAL) {
      this._mainTech.setStages(['transparent']);
      pass.setDepth(true, false);
      pass.setBlend(
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_ONE, gfx.BLEND_ONE
      );
    }
  };

  prototypeAccessors.useColor.set = function (val) {
    this._effect.setOption('useColor', val);
  };

  prototypeAccessors.useTexture.set = function (val) {
    this._effect.setOption('useTexture', val);
  };

  prototypeAccessors.color.set = function (val) {
    this._effect.setValue('color', val);
  };

  prototypeAccessors.mainTexture.set = function (val) {
    this._mainTexture = val;
    this._effect.setValue('mainTexture', val._texture);
  };

  Object.defineProperties( UnlitMaterial.prototype, prototypeAccessors );

  return UnlitMaterial;
}(Material));

function parallel(tasks, callback) {
  var length = tasks.length;
  if (length === 0) {
    callback(null);
  }

  var completed = 0;

  for (var i = 0; i < tasks.length; ++i) {
    var task = tasks[i];
    task(function (err) {
      if (err) {
        callback(err);
      } else if (++completed === length) {
        callback(null);
      }
    });
  }
}

var async = {
  parallel: parallel
};

var materialLoader = function (app, urls, callback) {
  resl({
    manifest: {
      json: {
        type: 'text',
        parser: JSON.parse,
        src: urls.json,
      },
    },

    onDone: function onDone(data) {
      var json = data.json;

      var material = null;
      var props = json.properties;

      if (json.type === 'unlit') {
        material = new UnlitMaterial();

        // values
        if (props.color) {
          material.color = color4.new(
            props.color[0],
            props.color[1],
            props.color[2],
            props.color[3]
          );
        }

        if (props.mainTextureTiling) {
          material.mainTextureTiling = vec2.new(
            props.mainTextureTiling[0],
            props.mainTextureTiling[1]
          );
        }

        if (props.mainTextureOffset) {
          material.mainTextureOffset = vec2.new(
            props.mainTextureOffset[0],
            props.mainTextureOffset[1]
          );
        }

        var tasks = [];

        // assets
        if (props.mainTexture) {
          tasks.push(function (done) {
            app.assets.load(props.mainTexture, function (err, asset) {
              // TODO: just set the texture instead
              material.mainTexture = asset;
              material.useTexture = true;
              done();
            });
          });
        }
        async.parallel(tasks, function (err) {
          if (err) {
            console.error(err);
          }

          callback(null, material);
        });

      } else if (json.type === 'phong') {
        material = new PhongMaterial();

        // values
        if (props.diffuseColor) {
          material.diffuseColor = color4.new(
            props.diffuseColor[0],
            props.diffuseColor[1],
            props.diffuseColor[2],
            props.diffuseColor[3]
          );
        }

        if (props.diffuseTiling) {
          material.diffuseTiling = vec2.new(
            props.diffuseTiling[0],
            props.diffuseTiling[1]
          );
        }

        if (props.diffuseOffset) {
          material.diffuseOffset = vec2.new(
            props.diffuseOffset[0],
            props.diffuseOffset[1]
          );
        }

        var tasks$1 = [];

        // assets
        if (props.diffuse) {
          tasks$1.push(function (done) {
            app.assets.load(props.diffuse, function (err, asset) {
              // TODO: just set the texture instead
              material.diffuseTexture = asset;
              material.useDiffuseTexture = true;
              done();
            });
          });
        }
        async.parallel(tasks$1, function (err) {
          if (err) {
            console.error(err);
          }

          callback(null, material);
        });
      } else if (json.type === 'grid') {
        material = new GridMaterial();

        material.useWorldPos = props.useWorldPos;
        material.tiling = vec2.new(props.tilingX, props.tilingY);
        material.baseColorBlack = color4.new(
          props.baseColorBlack[0],
          props.baseColorBlack[1],
          props.baseColorBlack[2],
          props.baseColorBlack[3]
        );
        material.baseColorWhite = color4.new(
          props.baseColorWhite[0],
          props.baseColorWhite[1],
          props.baseColorWhite[2],
          props.baseColorWhite[3]
        );
        material.subPatternColor = color4.new(
          props.subPatternColor[0],
          props.subPatternColor[1],
          props.subPatternColor[2],
          props.subPatternColor[3]
        );
        material.subPatternColor2 = color4.new(
          props.subPatternColor2[0],
          props.subPatternColor2[1],
          props.subPatternColor2[2],
          props.subPatternColor2[3]
        );

        material.basePatternTiling = vec2.new(
          props.basePatternTiling[0],
          props.basePatternTiling[1]
        );
        material.basePatternOffset = vec2.new(
          props.basePatternOffset[0],
          props.basePatternOffset[1]
        );

        material.subPatternTiling = vec2.new(
          props.subPatternTiling[0],
          props.subPatternTiling[1]
        );
        material.subPatternOffset = vec2.new(
          props.subPatternOffset[0],
          props.subPatternOffset[1]
        );

        material.subPattern2Tiling = vec2.new(
          props.subPattern2Tiling[0],
          props.subPattern2Tiling[1]
        );
        material.subPattern2Offset = vec2.new(
          props.subPattern2Offset[0],
          props.subPattern2Offset[1]
        );

        // HACK: we should have a way to set default texture
        app.assets.load('black-texture', function (err, asset) {
          material.basePattern = asset;
          material.subPattern = asset;
          material.subPattern2 = asset;
        });

        // textures
        var tasks$2 = [];
        if (props.basePattern) {
          tasks$2.push(function (done) {
            app.assets.load(props.basePattern, function (err, asset) {
              material.basePattern = asset;
              done();
            });
          });
        }
        if (props.subPattern) {
          tasks$2.push(function (done) {
            app.assets.load(props.subPattern, function (err, asset) {
              material.subPattern = asset;
              done();
            });
          });
        }
        if (props.subPattern2) {
          tasks$2.push(function (done) {
            app.assets.load(props.subPattern2, function (err, asset) {
              material.subPattern2 = asset;
              done();
            });
          });
        }

        //
        async.parallel(tasks$2, function (err) {
          if (err) {
            console.error(err);
          }

          callback(null, material);
        });
      } else if (json.type === 'matcap') {
        material = new MatcapMaterial();

        // values
        if (props.colorFactor) {
          material.colorFactor = props.colorFactor;
        }
        if (props.color) {
          material.color = color4.new(
            props.color[0],
            props.color[1],
            props.color[2],
            props.color[3]
          );
        }

        // textures
        var tasks$3 = [];

        if (props.mainTex) {
          tasks$3.push(function (done) {
            app.assets.load(props.mainTex, function (err, asset) {
              material.mainTex = asset;
              material.useMainTex = true;
              done();
            });
          });
        }
        if (props.matcapTex) {
          tasks$3.push(function (done) {
            app.assets.load(props.matcapTex, function (err, asset) {
              material.matcapTex = asset;
              done();
            });
          });
        }
        async.parallel(tasks$3, function (err) {
          if (err) {
            console.error(err);
          }

          callback(null, material);
        });
      } else if (json.type === 'pbr') {
        material = new PbrMaterial();

        // textures
        var tasks$4 = [];

        if (props.albedoTexture) {
          tasks$4.push(function (done) {
            app.assets.load(props.albedoTexture, function (err, asset) {
              material.albedoTexture = asset;
              material.useAlbedoTexture = true;
              done();
            });
          });
        }
        if (props.metallicTexture) {
          tasks$4.push(function (done) {
            app.assets.load(props.metallicTexture, function (err, asset) {
              material.metallicTexture = asset;
              material.useMetallicTexture = true;
              done();
            });
          });
        }
        if (props.roughnessTexture) {
          tasks$4.push(function (done) {
            app.assets.load(props.roughnessTexture, function (err, asset) {
              material.roughnessTexture = asset;
              material.useRoughnessTexture = true;
              done();
            });
          });
        }
        if (props.normalTexture) {
          tasks$4.push(function (done) {
            app.assets.load(props.normalTexture, function (err, asset) {
              material.normalTexture = asset;
              material.useNormalTexture = true;
              done();
            });
          });
        }
        if (props.aoTexture) {
          tasks$4.push(function (done) {
            app.assets.load(props.aoTexture, function (err, asset) {
              material.aoTexture = asset;
              material.useAoTexture = true;
              done();
            });
          });
        }
        if (props.opacityTexture) {
          tasks$4.push(function (done) {
            app.assets.load(props.opacityTexture, function (err, asset) {
              material.opacityTexture = asset;
              material.useOpacityTexture = true;
              done();
            });
          });
        }
        // TODO: add emission texture?
        async.parallel(tasks$4, function (err) {
          if (err) {
            console.error(err);
          }

          callback(null, material);
        });
      } else { // TODO: support other materials that maybe loaded from assets.
        console.error('unsupported material loading');
      }
    }
  });
};

var _filterMap = {
  linear: gfx.FILTER_LINEAR,
  nearest: gfx.FILTER_NEAREST,
};

var _wrapMap = {
  repeat: gfx.WRAP_REPEAT,
  clamp: gfx.WRAP_CLAMP,
  mirror: gfx.WRAP_MIRROR,
};

function createTexture2D(device, img, json) {
  var asset = new Texture2D$2();
  var opts = {};

  opts.images = img;
  opts.mipmap = true;
  opts.width = img[0].width;
  opts.height = img[0].height;
  opts.format = gfx.TEXTURE_FMT_RGBA8;

  if (json) {
    opts.anisotropy = json.anisotropy;
    opts.minFilter = _filterMap[json.minFilter];
    opts.magFilter = _filterMap[json.magFilter];
    opts.mipFilter = _filterMap[json.mipFilter];
    opts.wrapS = _wrapMap[json.wrapS];
    opts.wrapT = _wrapMap[json.wrapT];
  }

  var texture = new gfx.Texture2D(device, opts);
  asset._texture = texture;
  asset._opts.anisotropy = opts.anisotropy;
  asset._opts.minFilter = opts.minFilter;
  asset._opts.magFilter = opts.magFilter;
  asset._opts.mipFilter = opts.mipFilter;
  asset._opts.wrapS = opts.wrapS;
  asset._opts.wrapT = opts.wrapT;
  return asset;
}

var texture2DLoader = function (app, urls, callback) {
  var manifest = {};
  var maxLevel = 0;

  for (var name in urls) {
    if (name.indexOf('image') === 0) {
      var l = parseInt(name.split('@')[1]);
      if (l > maxLevel) {
        maxLevel = l;
      }

      manifest[name] = {
        type: 'image',
        src: urls[name]
      };
    }
  }
  maxLevel += 1;

  if (urls.json) {
    manifest.json = {
      type: 'text',
      parser: JSON.parse,
      src: urls.json,
    };
  }

  resl({
    manifest: manifest,
    onDone: function onDone(data) {
      var json = data.json;
      var images = [];

      for (var l = 0; l < maxLevel; ++l) {
        if (l === 0) {
          images.push(
            data.image
          );
        } else {
          images.push(
            data[("image@" + l)]
          );
        }
      }
      var textureAsset = createTexture2D(app.device, images, json);

      callback(null, textureAsset);
    }
  });
};

var _filterMap$1 = {
  linear: gfx.FILTER_LINEAR,
  nearest: gfx.FILTER_NEAREST,
};

var _wrapMap$1 = {
  repeat: gfx.WRAP_REPEAT,
  clamp: gfx.WRAP_CLAMP,
  mirror: gfx.WRAP_MIRROR,
};

function createTextureCube(device, imgs, json) {
  var asset = new TextureCube$2();
  var opts = {};

  opts.images = imgs;
  opts.mipmap = true;
  opts.width = imgs[0][0].width;
  opts.height = imgs[0][0].height;
  opts.format = gfx.TEXTURE_FMT_RGBA8;

  if (json) {
    opts.anisotropy = json.anisotropy;
    opts.minFilter = _filterMap$1[json.minFilter];
    opts.magFilter = _filterMap$1[json.magFilter];
    opts.mipFilter = _filterMap$1[json.mipFilter];
    opts.wrapS = _wrapMap$1[json.wrapS];
    opts.wrapT = _wrapMap$1[json.wrapT];
  }

  var texture = new gfx.TextureCube(device, opts);
  asset._texture = texture;
  asset._opts.anisotropy = opts.anisotropy;
  asset._opts.minFilter = opts.minFilter;
  asset._opts.magFilter = opts.magFilter;
  asset._opts.mipFilter = opts.mipFilter;
  asset._opts.wrapS = opts.wrapS;
  asset._opts.wrapT = opts.wrapT;
  return asset;
}

var textureCubeLoader = function (app, urls, callback) {
  var manifest = {};
  var maxLevel = 0;

  for (var name in urls) {
    if (name.indexOf('image') === 0) {
      var l = parseInt(name.split('@')[1]);
      if (l > maxLevel) {
        maxLevel = l;
      }

      manifest[name] = {
        type: 'image',
        src: urls[name]
      };
    }
  }
  maxLevel += 1;

  if (urls.json) {
    manifest.json = {
      type: 'text',
      parser: JSON.parse,
      src: urls.json,
    };
  }

  resl({
    manifest: manifest,
    onDone: function onDone(data) {
      var json = data.json;
      var images = [];

      for (var l = 0; l < maxLevel; ++l) {
        if (l === 0) {
          images.push([
            data.imagePosX,
            data.imageNegX,
            data.imagePosY,
            data.imageNegY,
            data.imagePosZ,
            data.imageNegZ
          ]);
        } else {
          images.push([
            data[("imagePosX@" + l)],
            data[("imageNegX@" + l)],
            data[("imagePosY@" + l)],
            data[("imageNegY@" + l)],
            data[("imagePosZ@" + l)],
            data[("imageNegZ@" + l)]
          ]);
        }
      }

      // const { json, imagePosX, imageNegX, imagePosY, imageNegY, imagePosZ, imageNegZ } = data;
      var textureAsset = createTextureCube(app.device, images, json);

      callback(null, textureAsset);
    }
  });
};

function _mainUuid(uuid) {
  var idx = uuid.indexOf('@');
  if (idx === -1) {
    return uuid;
  }

  return uuid.substring(idx+1);
}

/**
 * @param {App} app
 * @param {Entity} ent
 * @param {object} info
 * @param {function} callback
 */
function createComponent(app, ent, info, callback) {
  var ctor = app.getClass(info.type);
  if (!ctor) {
    var comp$1 = new Component();
    comp$1._engine = app;
    comp$1._entity = ent;

    callback(
      new Error(("component type " + (info.type) + " not found.")),
      comp$1
    );
    return comp$1;
  }

  var comp = new ctor();
  comp._engine = app;
  comp._entity = ent;

  // invoke onInit
  if (comp.onInit) {
    comp.onInit();
  }

  var props = info.properties;

  if (info.type === 'Light') {
    comp.color = color3.new(props.color[0], props.color[1], props.color[2]);
    callback(null, comp);
  } else if (info.type === 'Model' || info.type === 'SkinningModel') {
    var tasks = [];

    // load materials
    var loop = function ( i ) {
      var uuid = props.materials[i];
      tasks.push(function (done) {
        app.assets.load(uuid, function (err, asset) {
          if (err) {
            console.error(err);
            done();
            return;
          }

          comp.material = asset;
          done();
        });
      });
    };

    for (var i = 0; i < props.materials.length; ++i) loop( i );

    // load mesh
    tasks.push(function (done) {
      app.assets.load(props.mesh, function (err, asset) {
        if (err) {
          console.error(err);
          done();
          return;
        }

        comp.mesh = asset;
        done();
      });
    });

    async.parallel(tasks, function (err) {
      callback(err, comp);
    });
  } else if (info.type === 'Camera') {
    // TODO
    callback(null, comp);
  } else if (info.type === 'Animation') {
    var tasks$1 = [];

    // load animations
    var loop$1 = function ( i ) {
      var uuid$1 = props.animations[i];
      tasks$1.push(function (done) {
        app.assets.load(uuid$1, function (err, asset) {
          if (err) {
            console.error(err);
            done();
            return;
          }

          comp.addClip(asset.name, asset);
          done();
        });
      });
    };

    for (var i$1 = 0; i$1 < props.animations.length; ++i$1) loop$1( i$1 );

    // load joints
    tasks$1.push(function (done) {
      app.assets.load(props.joints, function (err, asset) {
        if (err) {
          console.error(err);
          done();
          return;
        }

        comp.skeleton = asset.instantiate();
        done();
      });
    });

    async.parallel(tasks$1, function (err) {
      callback(err, comp);
    });
  } else if (info.type === 'Screen') {
    callback(null, comp);
  } else if (info.type === 'Widget') {
    comp.setPivot(props.pivotX, props.pivotY);
    comp.setSize(props.width, props.height);
    comp.setAnchors(props.anchorLeft, props.anchorBottom, props.anchorRight, props.anchorTop);
    comp.setMargin(props.marginLeft, props.marginBottom, props.marginRight, props.marginTop);
    comp.offsetX = props.offsetX;
    comp.offsetY = props.offsetY;

    callback(null, comp);
  }

  return comp;
}

/**
 * @param {App} app
 * @param {object} info
 * @param {function} callback
 */
function createEntity(app, info, callback) {
  var ent = new Entity(info.name);
  ent._engine = app;

  // if we don't have component, just return
  if (!info.components) {
    if (callback) {
      callback(null, ent);
    }

    return ent;
  }

  // load components (async)
  var loaded = 0;
  ent._comps = new Array(info.components.length);

  var loop = function ( i ) {
    var compInfo = info.components[i];
    createComponent(app, ent, compInfo, function (err, comp) {
      if (err) {
        console.error(("Failed to load component: " + err));
      }

      ent._comps[i] = comp;
      loaded += 1;

      if (loaded === info.components.length) {
        if (callback) {
          callback(null, ent);
        }
      }
    });
  };

  for (var i = 0; i < info.components.length; ++i) loop( i );

  return ent;
}

/**
 * @param {App} app
 * @param {object} info
 * @param {function} callback
 */
function createPrefab(app, json, callback) {
  var entInfos = json.entities;
  var entities = new Array(json.entities.length);
  var loaded = 0;

  var loop = function ( i ) {
    var entInfo = entInfos[i];
    if (entInfo.prefab) {
      // TODO: implement nested prefab
      // TODO: nested prefab needs prefabTree, which can help for detecting recursive reference
      if (callback) {
        callback(new Error('nested prefab have not implemented.'));
      }
    } else {
      createEntity(app, entInfo, function (err, ent) {
        if (err) {
          console.error(("Failed to load entity " + (entInfo.name) + ": " + err));
          return;
        }

        entities[i] = ent;
        loaded += 1;

        if (loaded === entInfos.length) {
          finalize(entities, entInfos);
          if (callback) {
            callback(null, entities[0]);
          }
        }
      });
    }
  };

  for (var i = 0; i < entInfos.length; ++i) loop( i );

  return entities[0];
}

/**
 * @param {App} app
 * @param {object} json
 * @param {function} callback
 */
function preloadAssets(app, json, callback) {
  var entInfos = json.entities;
  var assets = {};
  var uuids = [];
  var tasks = [];

  for (var i = 0; i < entInfos.length; ++i) {
    var entInfo = entInfos[i];

    if (!entInfo.components) {
      continue;
    }

    // get assets in component
    for (var c = 0; c < entInfo.components.length; ++c) {
      var compInfo = entInfo.components[c];
      var props = compInfo.properties;

      if (compInfo.type === 'Model' || compInfo.type === 'SkinningModel') {
        var uuid = (void 0);

        // materials
        for (var m = 0; m < props.materials.length; ++m) {
          // NOTE: the uuid may contain sub-asset
          uuid = _mainUuid(props.materials[m]);
          if (uuids.indexOf(uuid) === -1) {
            uuids.push(uuid);
          }
        }

        // mesh
        // NOTE: the uuid may contain sub-asset
        uuid = _mainUuid(props.mesh);
        if (uuids.indexOf(uuid) === -1) {
          uuids.push(uuid);
        }
      } else if (compInfo.type === 'Animation') {
        var uuid$1 = (void 0);

        // animations
        for (var a = 0; a < props.animations.length; ++a) {
          // NOTE: the uuid may contain sub-asset
          uuid$1 = _mainUuid(props.animations[a]);
          if (uuids.indexOf(uuid$1) === -1) {
            uuids.push(uuid$1);
          }
        }

        // joints
        // NOTE: the uuid may contain sub-asset
        uuid$1 = _mainUuid(props.joints);
        if (uuids.indexOf(uuid$1) === -1) {
          uuids.push(uuid$1);
        }
      }
    }
  }

  // push tasks
  var loop = function ( i ) {
    var uuid$2 = uuids[i];
    tasks.push(function (done) {
      app.assets.load(uuid$2, function (err, asset) {
        if (err) {
          console.error(err);
          done();
          return;
        }

        assets[uuid$2] = asset;
        done();
      });
    });
  };

  for (var i$1 = 0; i$1 < uuids.length; ++i$1) loop( i$1 );

  // load assets
  async.parallel(tasks, function (err) {
    callback(err, assets);
  });
}

/**
 * @param {Array} entities
 * @param {Array} entityInfos
 */
function finalize(entities, entityInfos) {
  for (var i = 0; i < entityInfos.length; ++i) {
    var entInfo = entityInfos[i];
    var ent = entities[i];

    if (!ent) {
      continue;
    }

    if (entInfo.translation) {
      vec3.set(
        ent.lpos,
        entInfo.translation[0],
        entInfo.translation[1],
        entInfo.translation[2]
      );
    } else {
      vec3.set(ent.lpos, 0, 0, 0);
    }

    if (entInfo.rotation) {
      quat.set(
        ent.lrot,
        entInfo.rotation[0],
        entInfo.rotation[1],
        entInfo.rotation[2],
        entInfo.rotation[3]
      );
    } else {
      quat.set(ent.lrot, 0, 0, 0, 1);
    }

    if (entInfo.scale) {
      vec3.set(
        ent.lscale,
        entInfo.scale[0],
        entInfo.scale[1],
        entInfo.scale[2]
      );
    } else {
      vec3.set(ent.lscale, 1, 1, 1);
    }

    if (entInfo.children) {
      for (var j = 0; j < entInfo.children.length; ++j) {
        var index = entInfo.children[j];
        ent.append(entities[index]);
      }
    }
  }
}

var ecsUtils = {
  createComponent: createComponent,
  createEntity: createEntity,
  createPrefab: createPrefab,
  preloadAssets: preloadAssets,
  finalize: finalize,
};

var Prefab = (function (Asset$$1) {
  function Prefab() {
    Asset$$1.call(this);

    this._app = null;
    this._json = null;
    this._assets = null;
  }

  if ( Asset$$1 ) Prefab.__proto__ = Asset$$1;
  Prefab.prototype = Object.create( Asset$$1 && Asset$$1.prototype );
  Prefab.prototype.constructor = Prefab;

  Prefab.prototype.unload = function unload () {
    if (!this._loaded) {
      return;
    }

    // TODO: unload all assets referenced by the prefab ??

    Asset$$1.prototype.unload.call(this);
  };

  Prefab.prototype.instantiate = function instantiate () {
    return ecsUtils.createPrefab(this._app, this._json);
  };

  return Prefab;
}(Asset));

var prefabLoader = function (app, urls, callback) {
  resl({
    manifest: {
      json: {
        type: 'text',
        parser: JSON.parse,
        src: urls.json,
      },
    },
    onDone: function onDone(data) {
      ecsUtils.preloadAssets(app, data.json, function (err, assets) {
        var prefab = new Prefab();
        prefab._app = app;
        prefab._json = data.json;
        prefab._assets = assets;

        if (err) {
          callback(err);
          return;
        }

        callback(null, prefab);
      });
    }
  });
};

// TODO:
// import gltfUtils from '../loaders/utils/gltf-utils';
// import ModelComponent from '../framework/model-component';
// import SkinningModelComponent from '../framework/skinning-model-component';

var Gltf = (function (Asset$$1) {
  function Gltf() {
    Asset$$1.call(this);

    this._nodes = null; // [gltfNode, ...]
    this._meshes = null; // [Mesh, ...]
    this._joints = null; // Joints
  }

  if ( Asset$$1 ) Gltf.__proto__ = Asset$$1;
  Gltf.prototype = Object.create( Asset$$1 && Asset$$1.prototype );
  Gltf.prototype.constructor = Gltf;

  Gltf.prototype.subAsset = function subAsset (localID) {
    var id = parseInt(localID.substring(1));
    if (localID[0] === 'm') {
      return this._meshes[id];
    }

    if (localID === 'joints') {
      return this._joints;
    }

    return null;
  };

  return Gltf;
}(Asset));

var gltfLoader = function (app, urls, callback) {
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

    onDone: function onDone(data) {
      var gltf = data.gltf;
      var bin = data.bin;

      var gltfAsset = new Gltf();

      gltfAsset._nodes = gltf.nodes;

      if (gltf.meshes) {
        gltfAsset._meshes = new Array(gltf.meshes.length);
        for (var i = 0; i < gltf.meshes.length; ++i) {
          gltfAsset._meshes[i] = gltfUtils.createMesh(app.device, gltf, bin, i);
        }
      }

      if (gltf.joints) {
        gltfAsset._joints = gltfUtils.createJoints(gltf);
      }

      callback(null, gltfAsset);
    }
  });
};

var animationLoader = function (app, urls, callback) {
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

    onDone: function onDone(data) {
      var gltf = data.gltf;
      var bin = data.bin;

      if (!gltf.animations.length) {
        callback(new Error('No animation in the gltf.'));
        return;
      }

      var animClip = gltfUtils.createAnimationClip(gltf, bin, 0);
      callback(null, animClip);
    }
  });
};

var _t_tmp = vec3.create();
var _s_tmp = vec3.new(1, 1, 1);
var _uv_tmp = vec3.create();
var _mat4_tmp = mat4.create();

var Sprite = (function (Asset$$1) {
  function Sprite() {
    var this$1 = this;

    Asset$$1.call(this);

    this._texture = null;
    this._x = 0;
    this._y = 0;
    this._width = 64;
    this._height = 64;
    this._rotated = false;

    // sliced information
    this._left = 0;
    this._right = 0;
    this._top = 0;
    this._bottom = 0;

    // cached 16 uvs
    /**
     * uv12  uv13  uv14  uv15
     * uv08  uv09  uv10  uv11
     * uv04  uv05  uv06  uv07
     * uv00  uv01  uv02  uv03
     */

    // ues vec3 for uv to make it better use mat4 texture matrix
    this._uvs = new Array(16);
    for (var i = 0; i < 16; ++i) {
      this$1._uvs[i] = vec3.create();
    }
    // cached texture matrix is used to map texcoords
    this._textureMatrix = mat4.create();
  }

  if ( Asset$$1 ) Sprite.__proto__ = Asset$$1;
  Sprite.prototype = Object.create( Asset$$1 && Asset$$1.prototype );
  Sprite.prototype.constructor = Sprite;

  // commit values and calculated cached values
  Sprite.prototype.commit = function commit () {
    var this$1 = this;

    // todo: check if some value exceeds the bounds, such as x < 0, or x + width > texture.width

    var texture = this._texture._texture;
    // calculate texture matrix
    /**
     * if sprite is rotated
     * 3----4  is rotated to 1----3
     * |    |                |    |
     * |    |                |    |
     * 1----2                2----4
     */
    if (this._rotated) {
      vec3.set(_s_tmp, this._width, this._height, 1.0);
      mat4.fromScaling(this._textureMatrix, _s_tmp);
      mat4.fromZRotation(_mat4_tmp, -Math.PI / 2);
      mat4.multiply(this._textureMatrix, _mat4_tmp, this._textureMatrix);
      vec3.set(_t_tmp, this._x, texture._height - this._y, 0.0);
      mat4.fromTranslation(_mat4_tmp, _t_tmp);
      mat4.multiply(this._textureMatrix, _mat4_tmp, this._textureMatrix);
      vec3.set(_s_tmp, 1 / texture._width, 1 / texture._height, 1.0);
      mat4.fromScaling(_mat4_tmp, _s_tmp);
      mat4.multiply(this._textureMatrix, _mat4_tmp, this._textureMatrix);
    } else {
      vec3.set(_s_tmp, this._width, this._height, 1.0);
      mat4.fromScaling(this._textureMatrix, _s_tmp);
      vec3.set(_t_tmp, this._x, texture._height - (this._y + this._height), 0.0);
      mat4.fromTranslation(_mat4_tmp, _t_tmp);
      mat4.multiply(this._textureMatrix, _mat4_tmp, this._textureMatrix);
      vec3.set(_s_tmp, 1 / texture._width, 1 / texture._height, 1.0);
      mat4.fromScaling(_mat4_tmp, _s_tmp);
      mat4.multiply(this._textureMatrix, _mat4_tmp, this._textureMatrix);
    }

    // calculate uvs
    var uvs = this._uvs;
    uvs[0].x = uvs[4].x = uvs[8].x = uvs[12].x = 0.0;
    uvs[1].x = uvs[5].x = uvs[9].x = uvs[13].x = this._left / this._width;
    uvs[2].x = uvs[6].x = uvs[10].x = uvs[14].x = 1.0 - this._right / this._width;
    uvs[3].x = uvs[7].x = uvs[11].x = uvs[15].x = 1.0;

    uvs[0].y = uvs[1].y = uvs[2].y = uvs[3].y = 0.0;
    uvs[4].y = uvs[5].y = uvs[6].y = uvs[7].y = this._bottom / this._height;
    uvs[8].y = uvs[9].y = uvs[10].y = uvs[11].y = 1.0 - this._top / this._height;
    uvs[12].y = uvs[13].y = uvs[14].y = uvs[15].y = 1.0;
    // multiply uv by texture matrix
    for (var i = 0; i < this._uvs.length; ++i) {
      vec3.transformMat4(this$1._uvs[i], this$1._uvs[i], this$1._textureMatrix);
    }
  };

  Sprite.prototype.getTextureMatrix = function getTextureMatrix () {
    return this._textureMatrix;
  };

  Sprite.prototype.getUVs = function getUVs () {
    return this._uvs;
  };

  return Sprite;
}(Asset));

var spriteLoader = function (app, urls, callback) {
  resl({
    manifest: {
      json: {
        type: 'text',
        parser: JSON.parse,
        src: urls.json,
      }
    },
    onDone: function onDone(data) {
      var json = data.json;
      var sprite = new Sprite();
      sprite._x = json.x;
      sprite._y = json.y;
      sprite._width = json.width;
      sprite._height = json.height;
      sprite._rotated = json.rotated;
      sprite._left = json.left || 0;
      sprite._right = json.right || 0;
      sprite._top = json.top || 0;
      sprite._bottom = json.bottom || 0;
      var tasks = [];
      tasks.push(function (done) {
        app.assets.load(json.texture, function (err, asset) {
          sprite._texture = asset;
          done();
        });
      });

      async.parallel(tasks, function (err) {
        if (err) {
          console.error(err);
        }
        sprite.commit();
        callback(null, sprite);
      });
    }
  });
};

var _wordSep = new RegExp(/([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûа-яА-ЯЁё]+|\S)/);

var BMFont = (function (Asset$$1) {
  function BMFont() {
    Asset$$1.call(this);

    this._texture = null;
    this._json = null;

    this._lineHeight = 32;
    this._fontSize = 32;
    this._characters = {};
  }

  if ( Asset$$1 ) BMFont.__proto__ = Asset$$1;
  BMFont.prototype = Object.create( Asset$$1 && Asset$$1.prototype );
  BMFont.prototype.constructor = BMFont;

  var prototypeAccessors = { faceName: { configurable: true } };

  prototypeAccessors.faceName.get = function () {
    return this._json ? '' : this._json.info.face;
  };

  BMFont.prototype.commit = function commit () {
    var this$1 = this;

    // reset characters data
    this._characters = {};
    var textureWidth = this._texture ? this._texture._texture._width : 64;
    var textureHeight = this._texture ? this._texture._texture._height : 64;
    var json = this._json;
    this._lineHeight = json.common.lineHeight;
    this._fontSize = json.info.size;
    // todo add kernings here
    // json.kernings.forEach(kerning => {
    //   font._kernings[kerning.first] = font._kernings[kerning.first] || {};
    //   font._kernings[kerning.first][kerning.second] = kerning.amount;
    // });
    /**
     * v2------v3
     * |       |
     * |       |
     * |       |
     * v0      v1
     */
    for (var charCode in json.chars) {
      var charInfo = json.chars[charCode];
      var u0 = charInfo.x / textureWidth;
      var u1 = (charInfo.x + charInfo.width) / textureWidth;
      var v0 = 1.0 - (charInfo.y + charInfo.height) / textureHeight;
      var v1 = 1.0 - charInfo.y / textureHeight;
      this$1._characters[charCode] = {
        char: String.fromCharCode(charCode),
        x: charInfo.x,
        y: charInfo.y,
        width: charInfo.width,
        height: charInfo.height,
        xoffset: charInfo.xoffset,
        yoffset: charInfo.yoffset,
        xadvance: charInfo.xadvance
      };
      this$1._characters[charCode].uvs = [vec3.new(u0, v0, 0), vec3.new(u1, v0, 0), vec3.new(u0, v1, 0), vec3.new(u1, v1, 0)];
    }
  };

  // get width of single line text
  BMFont.prototype.getTextWidth = function getTextWidth (text, fontSize) {
    var this$1 = this;

    var result = 0;
    var defaultCharInfo = this._characters[32];
    var fontScale = fontSize / this._fontSize;
    for (var i = 0; i < text.length; ++i) {
      var charCode = text.charCodeAt(i);
      var charInfo = this$1._characters[charCode] || defaultCharInfo;
      result += charInfo.xadvance * fontScale;
    }

    return result;
  };

  BMFont.prototype.getWrappedInfos = function getWrappedInfos (text, fontSize, lineHeight, width) {
    var this$1 = this;

    var results = [];
    var words = text.split(_wordSep);
    var lastIndex = 0;
    var index = 0;
    var accWordsWidth = 0;
    // sep + word pair
    for (var i = 0; i + 1 < words.length;) {
      var sepWidth = this$1.getTextWidth(words[i], fontSize);
      var wordWidth = this$1.getTextWidth(words[i + 1], fontSize);
      if (accWordsWidth + sepWidth + wordWidth < width) {
        if (i !== 0 && accWordsWidth === 0) {
          accWordsWidth += wordWidth;
          lastIndex = lastIndex + words[i].length;
          index += words[i].length + words[i + 1].length;
          // test succeed, increment word index
          i += 2;
        } else {
          accWordsWidth += sepWidth + wordWidth;
          index += words[i].length + words[i + 1].length;
          // test succeed, increment word index
          i += 2;
        }
      } else if (accWordsWidth === 0) {
        // force add one word to line to avoid infinite loop
        results.push({
          start: lastIndex + words[i].length,
          end: lastIndex + words[i].length + words[i + 1].length,
          width: wordWidth
        });
        lastIndex = lastIndex + words[i].length + words[i + 1].length;
        index = lastIndex;
        accWordsWidth = 0;
        // test failed, force add one, increment word index
        i += 2;
      } else {
        // test failed, add wrapped info
        results.push({
          start: lastIndex,
          end: index,
          width: accWordsWidth
        });

        lastIndex = index;
        accWordsWidth = 0;

      }
    }

    // add the last line, do not add the last sep
    if (accWordsWidth > 0) {
      results.push({
        start: lastIndex,
        end: index,
        width: accWordsWidth
      });
    }

    return results;
  };

  BMFont.prototype.genTextVertices = function genTextVertices (out, text, alignH, alignV, wrap, width, height, fontSize, lineHeight, pivotX, pivotY) {
    var this$1 = this;

    var cursorY = 0;
    var defaultCharInfo = this._characters[32];
    var paragraphs = text.split('\n');
    var fontScale = fontSize / this._fontSize;
    var totalLines = 0;
    var totalChars = 0;
    var fillLine = function (para, start, end) {
      var cursorX = 0;
      var loop = function ( i ) {
        var charCode = para.charCodeAt(i + start);
        var charInfo = this$1._characters[charCode] || defaultCharInfo;
        var x0 = cursorX + charInfo.xoffset * fontScale;
        var x1 = cursorX + (charInfo.width + charInfo.xoffset) * fontScale;
        var y0 = cursorY - (charInfo.height + charInfo.yoffset) * fontScale;
        var y1 = cursorY - charInfo.yoffset * fontScale;
        out.positionAccess(totalChars + i, function (err, pos0, pos1, pos2, pos3) {
          if (err) {
            console.error(err);
            return;
          }
          vec3.set(pos0, x0, y0, 0);
          vec3.set(pos1, x1, y0, 0);
          vec3.set(pos2, x0, y1, 0);
          vec3.set(pos3, x1, y1, 0);
        });

        out.uvAccess(totalChars + i, function (err, uv0, uv1, uv2, uv3) {
          if (err) {
            console.error(err);
            return;
          }
          vec3.copy(uv0, charInfo.uvs[0]);
          vec3.copy(uv1, charInfo.uvs[1]);
          vec3.copy(uv2, charInfo.uvs[2]);
          vec3.copy(uv3, charInfo.uvs[3]);
        });

        cursorX += charInfo.xadvance * fontScale;
      };

      for (var i = 0; i < end - start; ++i) loop( i );
      // process alignH
      if (cursorX < width) {
        var loop$1 = function ( i ) {
          var offsetX = (width - cursorX) * alignH;
          out.positionAccess(totalChars + i, function (err, pos0, pos1, pos2, pos3) {
            if (err) {
              console.error(err);
              return;
            }
            pos0.x = pos0.x + offsetX;
            pos1.x = pos1.x + offsetX;
            pos2.x = pos2.x + offsetX;
            pos3.x = pos3.x + offsetX;
          });
        };

        for (var i$1 = 0; i$1 < end - start; ++i$1) loop$1( i$1 );
      }
      totalChars += end - start;
      ++totalLines;
      cursorY -= lineHeight * this$1._lineHeight * fontScale;
    };

    if (wrap) {
      for (var i = 0; i < paragraphs.length; ++i) {
        var wrapInfo = this$1.getWrappedInfos(paragraphs[i], fontSize, lineHeight, width);
        for (var j = 0; j < wrapInfo.length; ++j) {
          fillLine(paragraphs[i], wrapInfo[j].start, wrapInfo[j].end);
        }
      }
    } else {
      for (var i$1 = 0; i$1 < paragraphs.length; ++i$1) {
        fillLine(paragraphs[i$1], 0, paragraphs[i$1].length);
      }
    }

    // process alignV and move it to [0,0, width, height] rect
    var labelHeight = totalLines * lineHeight * this._lineHeight * fontScale;
    var alignVOffset = labelHeight < height ? (height - labelHeight) * -alignV : 0.0;
    var rectOffset = height;
    var pivotOffsetX = -pivotX * width;
    var pivotOffsetY = -pivotY * height;
    for (var i$2 = 0; i$2 < totalChars; ++i$2) {
      out.positionAccess(i$2, function (err, pos0, pos1, pos2, pos3) {
        if (err) {
          console.error(err);
          return;
        }
        pos0.x = pos0.x + pivotOffsetX;
        pos1.x = pos1.x + pivotOffsetX;
        pos2.x = pos2.x + pivotOffsetX;
        pos3.x = pos3.x + pivotOffsetX;
        pos0.y = pos0.y + alignVOffset + rectOffset + pivotOffsetY;
        pos1.y = pos1.y + alignVOffset + rectOffset + pivotOffsetY;
        pos2.y = pos2.y + alignVOffset + rectOffset + pivotOffsetY;
        pos3.y = pos3.y + alignVOffset + rectOffset + pivotOffsetY;
      });
    }
    return totalChars;
  };

  Object.defineProperties( BMFont.prototype, prototypeAccessors );

  return BMFont;
}(Asset));

var bmfontLoader = function (app, urls, callback) {
  resl({
    manifest: {
      json: {
        type: 'text',
        parser: JSON.parse,
        src: urls.json,
      },
      // todo: depends on app.assets.loadInfo
      // image: {
      // ...
      // }
    },

    onDone: function onDone(data) {
      var json = data.json;
      var font = new BMFont();
      font._json = json;

      var tasks = [];
      tasks.push(function (done) {
        app.assets.load(json.texture, function (err, asset) {
          font._texture = asset;
          done();
        });
      });

      async.parallel(tasks, function (err) {
        if (err) {
          console.error(err);
          callback(err, null);
        }
        font.commit();
        callback(null, font);
      });
    }
  });
};

var ScriptComponent = (function (Component$$1) {
  function ScriptComponent() {
    Component$$1.call(this);

    this._startedFlag = 0;
  }

  if ( Component$$1 ) ScriptComponent.__proto__ = Component$$1;
  ScriptComponent.prototype = Object.create( Component$$1 && Component$$1.prototype );
  ScriptComponent.prototype.constructor = ScriptComponent;

  ScriptComponent.prototype.start = function start () {
  };

  ScriptComponent.prototype.update = function update () {
  };

  ScriptComponent.prototype.postUpdate = function postUpdate () {
  };

  return ScriptComponent;
}(Component));

var CameraComponent = (function (Component$$1) {
  function CameraComponent() {
    Component$$1.call(this);

    this._camera = new renderer.Camera();
    this._camera.setStages([
      'opaque',
      'transparent'
    ]);
  }

  if ( Component$$1 ) CameraComponent.__proto__ = Component$$1;
  CameraComponent.prototype = Object.create( Component$$1 && Component$$1.prototype );
  CameraComponent.prototype.constructor = CameraComponent;

  CameraComponent.prototype.onInit = function onInit () {
    this._camera.setNode(this._entity);
  };

  return CameraComponent;
}(Component));

var LightComponent = (function (Component$$1) {
  function LightComponent() {
    Component$$1.call(this);

    this._light = new renderer.Light();
  }

  if ( Component$$1 ) LightComponent.__proto__ = Component$$1;
  LightComponent.prototype = Object.create( Component$$1 && Component$$1.prototype );
  LightComponent.prototype.constructor = LightComponent;

  var prototypeAccessors = { type: { configurable: true },color: { configurable: true },intensity: { configurable: true },range: { configurable: true },spotAngle: { configurable: true },spotExp: { configurable: true },shadowType: { configurable: true },shadowResolution: { configurable: true },shadowDarkness: { configurable: true },shadowMinDepth: { configurable: true },shadowMaxDepth: { configurable: true },shadowDepthScale: { configurable: true } };

  LightComponent.prototype.onInit = function onInit () {
    this._light.setNode(this._entity);
  };

  prototypeAccessors.type.set = function (val) {
    this._light.setType(val);
  };
  prototypeAccessors.type.get = function () {
    return this._light.type;
  };

  prototypeAccessors.color.set = function (val) {
    this._light.setColor(val.r, val.g, val.b);
  };
  prototypeAccessors.color.get = function () {
    return this._light.color;
  };

  prototypeAccessors.intensity.set = function (val) {
    this._light.setIntensity(val);
  };
  prototypeAccessors.intensity.get = function () {
    return this._light.intensity;
  };

  prototypeAccessors.range.set = function (val) {
    this._light.setRange(val);
  };
  prototypeAccessors.range.get = function () {
    return this._light.range;
  };

  prototypeAccessors.spotAngle.set = function (val) {
    this._light.setSpotAngle(toRadian(val));
  };
  prototypeAccessors.spotAngle.get = function () {
    return toDegree(this._light.spotAngle);
  };

  prototypeAccessors.spotExp.set = function (val) {
    this._light.setSpotExp(val);
  };
  prototypeAccessors.spotExp.get = function () {
    return this._light.spotExp;
  };

  prototypeAccessors.shadowType.set = function (val) {
    this._light.setShadowType(val);
  };
  prototypeAccessors.shadowType.get = function () {
    return this._light.shadowType;
  };

  prototypeAccessors.shadowResolution.set = function (val) {
    this._light.setShadowResolution(val);
  };
  prototypeAccessors.shadowResolution.get = function () {
    return this._light._shadowResolution;
  };

  prototypeAccessors.shadowDarkness.set = function (val) {
    this._light.setShadowDarkness(val);
  };
  prototypeAccessors.shadowDarkness.get = function () {
    return this._light.shadowDarkness;
  };

  prototypeAccessors.shadowMinDepth.set = function (val) {
    this._light.setShadowMinDepth(val);
  };
  prototypeAccessors.shadowMinDepth.get = function () {
    return this._light.shadowMinDepth;
  };

  prototypeAccessors.shadowMaxDepth.set = function (val) {
    this._light.setShadowMaxDepth(val);
  };
  prototypeAccessors.shadowMaxDepth.get = function () {
    return this._light.shadowMaxDepth;
  };

  prototypeAccessors.shadowDepthScale.set = function (val) {
    this._light.setShadowDepthScale(val);
  };
  prototypeAccessors.shadowDepthScale.get = function () {
    return this._light.shadowDepthScale;
  };

  Object.defineProperties( LightComponent.prototype, prototypeAccessors );

  return LightComponent;
}(Component));

var ModelComponent = (function (Component$$1) {
  function ModelComponent() {
    Component$$1.call(this);

    this._materials = []; // [Material]
    this._mesh = null; // Mesh
    this._model = new renderer.Model();
  }

  if ( Component$$1 ) ModelComponent.__proto__ = Component$$1;
  ModelComponent.prototype = Object.create( Component$$1 && Component$$1.prototype );
  ModelComponent.prototype.constructor = ModelComponent;

  var prototypeAccessors = { material: { configurable: true },mesh: { configurable: true } };

  ModelComponent.prototype.onInit = function onInit () {
    this._model.setNode(this._entity);
  };

  prototypeAccessors.material.set = function (val) {
    if (this._materials.length === 1 && this._materials[0] === val) {
      return;
    }

    this._materials.length = 1;
    this._materials[0] = val;
    this._model.clearEffects();
    this._model.addEffect(val._effect);
  };

  prototypeAccessors.mesh.set = function (val) {
    var this$1 = this;

    if (this._mesh !== val) {
      if (this._mesh) {
        this._model.clearInputAssemblers();
      }

      this._mesh = val;

      for (var i = 0; i < this._mesh.subMeshCount; ++i) {
        this$1._model.addInputAssembler(this$1._mesh.getSubMesh(i));
      }
    }
  };

  Object.defineProperties( ModelComponent.prototype, prototypeAccessors );

  return ModelComponent;
}(Component));

function _finalize(app, json, entities, callback) {
  var level = new Level();

  ecsUtils.finalize(entities, json.entities);
  for (var i = 0; i < json.children.length; ++i) {
    var idx = json.children[i];
    level.append(entities[idx]);
  }

  if (callback) {
    callback(null, level);
  }
}

function _applyModifications(app, target, entInfo, callback) {
  var entities = utils.flat(target);
  var tasks = [];

  var loop = function ( i ) {
    var mod = entInfo.modifications[i];
    var ent = entities[mod.entity];
    var words = mod.property.split('.');

    var comp = ent.getComp(words[0]);
    if (comp === null) {
      console.warn(("Failed to apply modification for entity " + (ent.name) + ": component " + (words[0]) + " not found."));
      return;
    }

    if (words[1].indexOf('material') !== -1) {
      var uuid = mod.value;
      tasks.push(function (done) {
        app.assets.load(uuid, function (err, asset) {
          if (err) {
            console.error(err);
            done();
            return;
          }

          comp.material = asset;
          done();
        });
      });
    }
  };

  for (var i = 0; i < entInfo.modifications.length; i++) loop( i );

  async.parallel(tasks, function (err) {
    callback(err);
  });
}

var parseLevel = function (app, json, callback) {
  var entInfos = json.entities;
  var entities = new Array(json.entities.length);
  var loaded = 0;

  var loop = function ( i ) {
    var entInfo = entInfos[i];
    if (entInfo.prefab) {
      app.assets.load(entInfo.prefab, function (err, prefab) {
        if (err) {
          console.error(("Failed to load entity " + (entInfo.name) + ": " + err));
        } else {
          entities[i] = prefab.instantiate();
          console.log(((entInfo.name) + " loaded"));
        }

        if (entInfo.modifications !== undefined) {
          _applyModifications(app, entities[i], entInfo, function (err) {
            if (err) {
              console.error(err);
              return;
            }

            loaded += 1;
            if (loaded === entInfos.length) {
              _finalize(app, json, entities, callback);
            }
          });
        } else {
          loaded += 1;
          if (loaded === entInfos.length) {
            _finalize(app, json, entities, callback);
          }
        }
      });
    } else {
      ecsUtils.createEntity(app, entInfo, function (err, ent) {
        if (err) {
          console.error(("Failed to load entity " + (entInfo.name) + ": " + err));
          return;
        }

        entities[i] = ent;

        loaded += 1;
        console.log(((entInfo.name) + " loaded"));

        if (loaded === entInfos.length) {
          _finalize(app, json, entities, callback);
        }
      });
    }
  };

  for (var i = 0; i < entInfos.length; ++i) loop( i );
};

function createJointsTexture(app, skinning) {
  var jointCount = skinning.jointIndices.length;

  // set jointsTexture
  var size;
  if (jointCount > 256) {
    size = 64;
  } else if (jointCount > 64) {
    size = 32;
  } else if (jointCount > 16) {
    size = 16;
  } else {
    size = 8;
  }

  return new gfx.Texture2D(app.device, {
    width: size,
    height: size,
    format: gfx.TEXTURE_FMT_RGBA32F,
    minFilter: gfx.FILTER_NEAREST,
    magFilter: gfx.FILTER_NEAREST,
    wrapS: gfx.WRAP_CLAMP,
    wrapT: gfx.WRAP_CLAMP,
    mipmap: false,
  });
}

function createMesh$1(app, data) {
  var ia = renderer.createIA(app.device, data);
  var meshAsset = new Mesh();
  meshAsset._subMeshes = [ia];

  return meshAsset;
}

var utils$2 = {
  createJointsTexture: createJointsTexture,
  createMesh: createMesh$1,

  parseLevel: parseLevel,

  walk: utils.walk,
  flat: utils.flat,
  find: utils.find,
};

var SkinningModelComponent = (function (Component$$1) {
  function SkinningModelComponent() {
    Component$$1.call(this);

    this._materials = []; // [Material]
    this._mesh = null; // Mesh
    this._model = new SkinningModel();
  }

  if ( Component$$1 ) SkinningModelComponent.__proto__ = Component$$1;
  SkinningModelComponent.prototype = Object.create( Component$$1 && Component$$1.prototype );
  SkinningModelComponent.prototype.constructor = SkinningModelComponent;

  var prototypeAccessors = { material: { configurable: true },mesh: { configurable: true } };

  SkinningModelComponent.prototype.onInit = function onInit () {
    var this$1 = this;

    this._model.setNode(this._entity);

    this._entity.once('ready', function () {
      var rootEnt = this$1._entity.parent;
      var animComp = rootEnt.getComp('Animation');
      if (animComp) {
        this$1._model.setSkeleton(animComp._skeleton);
      } else {
        console.warn('Can not find Animation component in root entity.');
      }
    });
  };

  prototypeAccessors.material.set = function (val) {
    if (this._materials.length === 1 && this._materials[0] === val) {
      return;
    }

    this._materials.length = 1;
    this._materials[0] = val;
    this._model.clearEffects();
    this._model.addEffect(val._effect);
  };

  prototypeAccessors.mesh.set = function (val) {
    var this$1 = this;

    if (this._mesh !== val) {
      if (this._mesh) {
        this._model.clearInputAssemblers();
      }

      this._mesh = val;

      for (var i = 0; i < this._mesh.subMeshCount; ++i) {
        this$1._model.addInputAssembler(this$1._mesh.getSubMesh(i));
      }

      if (this._mesh.skinning) {
        var texture = utils$2.createJointsTexture(
          this._engine,
          this._mesh.skinning
        );

        this._model.setJointsTexture(texture);
        this._model.setSkinning(this._mesh.skinning);
      }
    }
  };

  Object.defineProperties( SkinningModelComponent.prototype, prototypeAccessors );

  return SkinningModelComponent;
}(Component));

var AnimationState = function AnimationState(clip) {
  this.clip = clip;
  this.blendMode = enums$2.ANIM_BLEND;
  this.wrapMode = enums$2.ANIM_WRAP_LOOP;
  this.speed = 1.0;
  this.time = 0.0;
  this.weight = 1.0;
};

var AnimationCtrl = function AnimationCtrl() {
  this._current = null;
  this._next = null;
  this._blendTime = 0.0;
  this._blendDuration = 0.3;

  this._skeleton = null;
  this._skelFrom = null;
  this._skelTo = null;
};

AnimationCtrl.prototype.setSkeleton = function setSkeleton (skel) {
  this._skeleton = skel;
  this._skelFrom = skel.clone();
  this._skelTo = skel.clone();
};

AnimationCtrl.prototype.crossFade = function crossFade (to, duration) {
  if (this._current && duration > 0.0) {
    this._next = to;
    this._blendTime = 0.0;
    this._blendDuration = duration;
  } else {
    this._current = to;
    this._next = null;
  }
};

AnimationCtrl.prototype.tick = function tick (dt) {
  // handle blend
  if (this._current && this._next) {
    var t0 = this._getTime(this._current);
    var t1 = this._getTime(this._next);

    var alpha = this._blendTime / this._blendDuration;

    this._current.time += dt;
    this._next.time += dt;
    this._blendTime += dt;

    if (alpha > 1.0) {
      this._current = this._next;
      this._next = null;

      this._current.clip.sample(this._skeleton, t1);
    } else {
      this._current.clip.sample(this._skelFrom, t0);
      this._next.clip.sample(this._skelTo, t1);

      this._skeleton.blend(this._skelFrom, this._skelTo, alpha);
      this._skeleton.updateMatrices();
    }

    return;
  }

  // handle playing
  if (this._current) {
    var t0$1 = this._getTime(this._current);
    this._current.clip.sample(this._skeleton, t0$1);

    this._current.time += dt;
  }
};

AnimationCtrl.prototype._getTime = function _getTime (state) {
  var t = state.time;
  var length = state.clip.length;

  if (state.wrapMode === enums$2.ANIM_WRAP_ONCE) {
    if (t > length) {
      t = 0.0;
    }
  } else if (state.wrapMode === enums$2.ANIM_WRAP_LOOP) {
    t %= length;
  } else if (state.wrapMode === enums$2.ANIM_WRAP_PINGPONG) {
    var order = Math.floor(t / length);
    if (order % 2 === 1) {
      t = length - t % length;
    }
  }

  return t;
};

var AnimationComponent = (function (Component$$1) {
  function AnimationComponent() {
    Component$$1.call(this);

    this._clips = [];
    this._skeleton = null;

    // internal states
    this._name2states = {};
    this._animCtrl = new AnimationCtrl();
  }

  if ( Component$$1 ) AnimationComponent.__proto__ = Component$$1;
  AnimationComponent.prototype = Object.create( Component$$1 && Component$$1.prototype );
  AnimationComponent.prototype.constructor = AnimationComponent;

  var prototypeAccessors = { skeleton: { configurable: true } };

  prototypeAccessors.skeleton.set = function (val) {
    if (this._skeleton !== val) {
      this._skeleton = val;
      this._animCtrl.setSkeleton(val);
    }
  };

  AnimationComponent.prototype.addClip = function addClip (name, animClip) {
    if (this._name2states[name]) {
      console.warn(("Failed to add clip " + name + ", the name already exsits."));
      return;
    }

    this._clips.push(animClip);
    this._name2states[name] = new AnimationState(animClip);
  };

  AnimationComponent.prototype.getState = function getState (name) {
    return this._name2states[name];
  };

  AnimationComponent.prototype.play = function play (name, fadeDuration) {
    if ( fadeDuration === void 0 ) fadeDuration = 0.3;

    if (!this._name2states[name]) {
      console.warn(("Failed to play animation " + name + ", not found."));
      return;
    }

    var animState = this._name2states[name];
    animState.time = 0.0;

    this._animCtrl.crossFade(animState, fadeDuration);
  };

  Object.defineProperties( AnimationComponent.prototype, prototypeAccessors );

  return AnimationComponent;
}(Component));

var SkyboxMaterial = (function (Material$$1) {
  function SkyboxMaterial() {
    Material$$1.call(this);
    var pass = new renderer.Pass('skybox');
    pass.setCullMode(gfx.CULL_NONE);
    // TODO: use layer -1 to make it render first, change it to enums later
    var mainTech = new renderer.Technique(
      ['opaque'],
      [
        { name: 'cubeMap', type: renderer.PARAM_TEXTURE_CUBE } ],
      [pass],
      -1
    );

    this._effect = new renderer.Effect([mainTech]);
    // skybox state: opaque stage, do not do blend, depth test and depth write
    mainTech.stages = renderer.STAGE_OPAQUE;
    pass._blend = false;
    pass.setDepth(false, false);
    this._cubeMap = null;
  }

  if ( Material$$1 ) SkyboxMaterial.__proto__ = Material$$1;
  SkyboxMaterial.prototype = Object.create( Material$$1 && Material$$1.prototype );
  SkyboxMaterial.prototype.constructor = SkyboxMaterial;

  var prototypeAccessors = { cubeMap: { configurable: true } };

  prototypeAccessors.cubeMap.set = function (val) {
    if (this._cubeMap === val) {
      return;
    }
    this._cubeMap = val;
    this._effect.setValue('cubeMap', val ? val._texture : undefined);
  };

  Object.defineProperties( SkyboxMaterial.prototype, prototypeAccessors );

  return SkyboxMaterial;
}(Material));

var SkyboxComponent = (function (Component$$1) {
  function SkyboxComponent() {
    Component$$1.call(this);

    this._material = new SkyboxMaterial();
    this._model = new renderer.Model();
    this._model.addEffect(this._material._effect);
  }

  if ( Component$$1 ) SkyboxComponent.__proto__ = Component$$1;
  SkyboxComponent.prototype = Object.create( Component$$1 && Component$$1.prototype );
  SkyboxComponent.prototype.constructor = SkyboxComponent;

  var prototypeAccessors = { cubeMap: { configurable: true } };

  SkyboxComponent.prototype.onInit = function onInit () {
    this._model.setNode(this._entity);
    var ia = renderer.createIA(this._engine.device, box(2, 2, 2, {
      widthSegments: 1,
      heightSegments: 1,
      lengthSegments: 1,
    }));
    this._model.addInputAssembler(ia);
  };

  prototypeAccessors.cubeMap.set = function (val) {
    this._material.cubeMap = val;
  };

  Object.defineProperties( SkyboxComponent.prototype, prototypeAccessors );

  return SkyboxComponent;
}(Component));

var SpriteMaterial = (function (Material$$1) {
  function SpriteMaterial() {
    Material$$1.call(this);

    var mainTech = new renderer.Technique(
      ['2d'],
      [
        { name: 'mainTexture', type: renderer.PARAM_TEXTURE_2D } ],
      [new renderer.Pass('sprite')]
    );

    this._effect = new renderer.Effect(
      [
        mainTech ],
      {
        color: color4.new(1, 1, 1, 1),
      },
      [
      ]
    );
    this._mainTech = mainTech;
    this._mainTexture = null;
  }

  if ( Material$$1 ) SpriteMaterial.__proto__ = Material$$1;
  SpriteMaterial.prototype = Object.create( Material$$1 && Material$$1.prototype );
  SpriteMaterial.prototype.constructor = SpriteMaterial;

  var prototypeAccessors = { mainTexture: { configurable: true } };

  prototypeAccessors.mainTexture.set = function (val) {
    this._mainTexture = val;
    this._effect.setValue('mainTexture', val._texture);
  };

  Object.defineProperties( SpriteMaterial.prototype, prototypeAccessors );

  return SpriteMaterial;
}(Material));

var _doNotBatchKey = -1;
var RenderDataInterface = function RenderDataInterface() {
  // mutable value for rendering
  this._multiplyTransform = false;
  this._ia = null;
  // default do not support batch at all, it could be a value or a string(uuid)
  this._batchKey = _doNotBatchKey;
};

// test batch with another renderdata
RenderDataInterface.prototype.batchTest = function batchTest (another) {
  return another && this._multiplyTransform && another._multiplyTransform && (this._batchKey !== _doNotBatchKey) && (this._batchKey === another._batchKey);
};

// reset batch key to _doNotBatchKey
RenderDataInterface.prototype.resetBatchKey = function resetBatchKey () {
  this._batchKey = _doNotBatchKey;
};

RenderDataInterface.prototype.setBatchKey = function setBatchKey (key) {
  this._batchKey = key;
};
// should return a graph node
RenderDataInterface.prototype.getNode = function getNode () {
  return null;
};

// should return an effect
RenderDataInterface.prototype.getEffect = function getEffect () {
  return null;
};

// should return an array
RenderDataInterface.prototype.getPositions = function getPositions () {
  return null;
};

// should return an array
RenderDataInterface.prototype.getUVs = function getUVs () {
  return null;
};

// should return an array
RenderDataInterface.prototype.getIndices = function getIndices () {
  return null;
};

// should return a color4
RenderDataInterface.prototype.getColor = function getColor () {
  return null;
};

// return vertex count here
RenderDataInterface.prototype.getVertexCount = function getVertexCount () {
  return 0;
};

// return index count here
RenderDataInterface.prototype.getIndexCount = function getIndexCount () {
  return 0;
};

var _defaultWidth = 64;
var _defaultHeight = 64;

var _defaultSpriteUV = vec3.new(0, 0, 0);
function _generateSimpleSpriteVerts(out, sprite, width, height, pivotX, pivotY) {
  var uvs = sprite ? sprite.getUVs() : null;
  var xOffset = -pivotX * width;
  var yOffset = -pivotY * height;
  vec3.set(out._positions[0], 0 + xOffset, 0 + yOffset, 0);
  vec3.set(out._positions[1], width + xOffset, 0 + yOffset, 0);
  vec3.set(out._positions[2], 0 + xOffset, height + yOffset, 0);
  vec3.set(out._positions[3], width + xOffset, height + yOffset, 0);

  vec3.copy(out._uvs[0], uvs ? uvs[0] : _defaultSpriteUV);
  vec3.copy(out._uvs[1], uvs ? uvs[3] : _defaultSpriteUV);
  vec3.copy(out._uvs[2], uvs ? uvs[12] : _defaultSpriteUV);
  vec3.copy(out._uvs[3], uvs ? uvs[15] : _defaultSpriteUV);
}

var _xs_tmp = [0.0, 0.0, 0.0, 0.0];
var _ys_tmp = [0.0, 0.0, 0.0, 0.0];
function _generateSlicedSpriteVerts(out, sprite, width, height, pivotX, pivotY) {
  var uvs = sprite ? sprite.getUVs() : null;
  var xOffset = -pivotX * width;
  var yOffset = -pivotY * height;

  // x0, x1, x2, x3
  var xScale = 1.0;
  var yScale = 1.0;
  if (sprite && (sprite._left + sprite._right > width)) {
    xScale = width / (sprite._left + sprite._right);
  }
  if (sprite && (sprite._bottom + sprite._top > height)) {
    yScale = height / (sprite._bottom + sprite._top);
  }
  _xs_tmp[0] = 0.0 + xOffset;
  _xs_tmp[1] = (sprite ? sprite._left : 0.0) * xScale + xOffset;
  _xs_tmp[2] = width - (sprite ? sprite._right : 0.0) * xScale + xOffset;
  _xs_tmp[3] = width + xOffset;
  _ys_tmp[0] = 0.0 + yOffset;
  _ys_tmp[1] = (sprite ? sprite._bottom : 0.0) * yScale + yOffset;
  _ys_tmp[2] = height - (sprite ? sprite._top : 0.0) * yScale + yOffset;
  _ys_tmp[3] = height + yOffset;
  for (var row = 0; row < 4; ++row) {
    for (var column = 0; column < 4; ++column) {
      vec3.set(out._positions[row * 4 + column], _xs_tmp[column], _ys_tmp[row], 0.0);
    }
  }

  for (var i = 0; i < 16; ++i) {
    vec3.copy(out._uvs[i], uvs ? uvs[i] : _defaultSpriteUV);
  }
}

/**
 * simple sprite
 * v2------v3
 * |       |
 * |       |
 * |       |
 * v0      v1
 * sliced sprite
 * v12---v13---v14---v15
 * |      |     |     |
 * v08---v09---v10---v11
 * |      |     |     |
 * v04---v05---v06---v07
 * |      |     |     |
 * v00---v01---v02---v03
 */
var _simpleSpriteIndices = new Uint16Array([0, 1, 2, 3, 2, 1]);
var _slicedSpriteIndices = new Uint16Array([
  0, 1, 4, 5, 4, 1,
  1, 2, 5, 6, 5, 2,
  2, 3, 6, 7, 6, 3,
  4, 5, 8, 9, 8, 5,
  5, 6, 9, 10, 9, 6,
  6, 7, 10, 11, 10, 7,
  8, 9, 12, 13, 12, 9,
  9, 10, 13, 14, 13, 10,
  10, 11, 14, 15, 14, 11
]);

var _vertexCountTable = {};
_vertexCountTable[enums$2.SPRITE_SIMPLE] = 4;
_vertexCountTable[enums$2.SPRITE_SLICED] = 16;

var _indexCountTable = {};
_indexCountTable[enums$2.SPRITE_SIMPLE] = 6;
_indexCountTable[enums$2.SPRITE_SLICED] = 54;

var _RenderData = (function (RenderDataInterface$$1) {
  function _RenderData(owner) {
    RenderDataInterface$$1.call(this);
    this._owner = owner;
  }

  if ( RenderDataInterface$$1 ) _RenderData.__proto__ = RenderDataInterface$$1;
  _RenderData.prototype = Object.create( RenderDataInterface$$1 && RenderDataInterface$$1.prototype );
  _RenderData.prototype.constructor = _RenderData;

  _RenderData.prototype.getNode = function getNode () {
    return this._owner._node;
  };

  _RenderData.prototype.getEffect = function getEffect () {
    return this._owner._effect;
  };

  _RenderData.prototype.getPositions = function getPositions () {
    return this._owner._positions;
  };

  _RenderData.prototype.getUVs = function getUVs () {
    return this._owner._uvs;
  };

  _RenderData.prototype.getIndices = function getIndices () {
    return this._owner._indices;
  };

  _RenderData.prototype.getColor = function getColor () {
    return this._owner._color;
  };

  _RenderData.prototype.getVertexCount = function getVertexCount () {
    return this._owner.vertexCount;
  };

  _RenderData.prototype.getIndexCount = function getIndexCount () {
    return this._owner.indexCount;
  };

  return _RenderData;
}(RenderDataInterface));

var SpriteRenderHelper = function SpriteRenderHelper() {
  this._width = _defaultWidth;
  this._height = _defaultHeight;
  this._pivotX = 0.0;
  this._pivotY = 0.0;
  this._sprite = null;
  this._node = null;
  this._effect = null;
  this._type = enums$2.SPRITE_SIMPLE;
  this._positions = null;
  this._uvs = null;
  this._color = color4.create();
  this._reallocVertexData();
  this._vertexDataDirty = true;
  this._texture = null;
  this._indices = _simpleSpriteIndices;

  this._renderData = new _RenderData(this);
};

var prototypeAccessors$15 = { type: { configurable: true },width: { configurable: true },height: { configurable: true },pivotX: { configurable: true },pivotY: { configurable: true },sprite: { configurable: true },color: { configurable: true },vertexCount: { configurable: true },indexCount: { configurable: true },positions: { configurable: true },uvs: { configurable: true } };

SpriteRenderHelper.prototype.setNode = function setNode (node) {
  this._node = node;
};

SpriteRenderHelper.prototype.setEffect = function setEffect (effect) {
  this._effect = effect;
};

SpriteRenderHelper.prototype._reallocVertexData = function _reallocVertexData () {
  var positions = this._positions = new Array(this.vertexCount);
  var uvs = this._uvs = new Array(this.vertexCount);
  for (var i = 0; i < this.vertexCount; ++i) {
    positions[i] = vec3.create();
    uvs[i] = vec3.create();
  }
};

prototypeAccessors$15.type.set = function (val) {
  if (this._type !== val) {
    this._type = val;
    this._indices = this._type === enums$2.SPRITE_SIMPLE ? _simpleSpriteIndices : _slicedSpriteIndices;
    this._reallocVertexData();
    this._vertexDataDirty = true;
  }
};

prototypeAccessors$15.width.set = function (val) {
  if (this._width !== val) {
    this._width = val;
    this._vertexDataDirty = true;
  }
};

prototypeAccessors$15.height.set = function (val) {
  if (this._height !== val) {
    this._height = val;
    this._vertexDataDirty = true;
  }
};

prototypeAccessors$15.pivotX.set = function (val) {
  if (this._pivotX !== val) {
    this._pivotX = val;
    this._vertexDataDirty = true;
  }
};

prototypeAccessors$15.pivotY.set = function (val) {
  if (this._pivotY !== val) {
    this._pivotY = val;
    this._vertexDataDirty = true;
  }
};

prototypeAccessors$15.sprite.set = function (val) {
  this._sprite = val;
  this._texture = val._texture;
  // sprite is batched based on texture
  this._renderData.setBatchKey(this._texture._uuid);
  this._vertexDataDirty = true;
};

prototypeAccessors$15.color.set = function (val) {
  color4.copy(this._color, val);
};

prototypeAccessors$15.color.get = function () {
  return this._color;
};

prototypeAccessors$15.vertexCount.get = function () {
  return _vertexCountTable[this._type];
};

prototypeAccessors$15.indexCount.get = function () {
  return _indexCountTable[this._type];
};

prototypeAccessors$15.positions.get = function () {
  return this._positions;
};

prototypeAccessors$15.uvs.get = function () {
  return this._uvs;
};

SpriteRenderHelper.prototype.getRenderDataCount = function getRenderDataCount () {
  return 1;
};

SpriteRenderHelper.prototype.getRenderData = function getRenderData (index) {
  if (index > 1) {
    return null;
  }
  return this._renderData;
};

SpriteRenderHelper.prototype.updateModelData = function updateModelData () {
  if (this._vertexDataDirty) {
    this._vertexDataDirty = false;
    if (this._type === enums$2.SPRITE_SIMPLE) {
      _generateSimpleSpriteVerts(this, this._sprite, this._width, this._height, this._pivotX, this._pivotY);
    } else if (this._type == enums$2.SPRITE_SLICED) {
      _generateSlicedSpriteVerts(this, this._sprite, this._width, this._height, this._pivotX, this._pivotY);
    } else {
    }
  }
};

Object.defineProperties( SpriteRenderHelper.prototype, prototypeAccessors$15 );

var SpriteComponent = (function (Component$$1) {
  function SpriteComponent() {
    Component$$1.call(this);

    this._material = new SpriteMaterial();
    this._type = enums$2.SPRITE_SIMPLE;
    this._renderHelper = new SpriteRenderHelper();
    this._sprite = null;
    this._color = color4.create();
  }

  if ( Component$$1 ) SpriteComponent.__proto__ = Component$$1;
  SpriteComponent.prototype = Object.create( Component$$1 && Component$$1.prototype );
  SpriteComponent.prototype.constructor = SpriteComponent;

  var prototypeAccessors = { type: { configurable: true },sprite: { configurable: true },color: { configurable: true } };

  SpriteComponent.prototype.onInit = function onInit () {
    this._renderHelper.setNode(this._entity);
    this._renderHelper.setEffect(this._material._effect);
  };

  prototypeAccessors.type.set = function (val) {
    this._type = val;
    this._renderHelper.type = val;
  };

  prototypeAccessors.sprite.set = function (val) {
    this._sprite = val;
    this._material.mainTexture = val._texture;
    this._renderHelper.sprite = val;
  };

  prototypeAccessors.color.set = function (val) {
    color4.copy(this._color, val);
    this._renderHelper.color = val;
  };

  SpriteComponent.prototype.destroy = function destroy () {
    this._renderHelper.destroy();
  };

  Object.defineProperties( SpriteComponent.prototype, prototypeAccessors );

  return SpriteComponent;
}(Component));

var _defaultWidth$1 = 64;
var _defaultHeight$1 = 64;
// it should be power of two and _maxCharsOneBatch*4 should be not bigger than _vertsInIAPool(screen system batch) to make sure it could be filled in IA
var _maxCharsOneBatch = 256;

var _labelIndices = new Uint16Array(_maxCharsOneBatch * 6);
for (var i$1 = 0; i$1 < _maxCharsOneBatch; ++i$1) {
  _labelIndices[6 * i$1 + 0] = 4 * i$1 + 0;
  _labelIndices[6 * i$1 + 1] = 4 * i$1 + 1;
  _labelIndices[6 * i$1 + 2] = 4 * i$1 + 2;
  _labelIndices[6 * i$1 + 3] = 4 * i$1 + 3;
  _labelIndices[6 * i$1 + 4] = 4 * i$1 + 2;
  _labelIndices[6 * i$1 + 5] = 4 * i$1 + 1;
}
var _LabelVertsPool = function _LabelVertsPool() {
  var dataPool = this._dataPool = {};
  // init 8, 16, 32, 64, 128, 256 pool
  var loop = function ( poolSize ) {
    dataPool[poolSize] = new Pool(function () {
      var data = [];
      for (var i = 0; i < 4 * poolSize; ++i) {
        data.push(vec3.create());
      }
      return data;
    }, 2);
  };

  for (var poolSize = _maxCharsOneBatch; poolSize >= 8; poolSize = poolSize / 2) loop( poolSize );

};

_LabelVertsPool.prototype.alloc = function alloc (charCount) {
  var poolSize = 8;
  if (charCount > 8) {
    poolSize = nextPow2(charCount);
  }
  if (charCount > _maxCharsOneBatch) {
    console.error('can not alloc size bigger than 256 chars');
  }
  return this._dataPool[poolSize].alloc();
};

_LabelVertsPool.prototype.free = function free (data) {
  this._dataPool[data.length / 4].free(data);
};

var _positionsPool = new _LabelVertsPool();
var _uvsPool = new _LabelVertsPool();

var _RenderData$1 = (function (RenderDataInterface$$1) {
  function _RenderData() {
    RenderDataInterface$$1.call(this);
  }

  if ( RenderDataInterface$$1 ) _RenderData.__proto__ = RenderDataInterface$$1;
  _RenderData.prototype = Object.create( RenderDataInterface$$1 && RenderDataInterface$$1.prototype );
  _RenderData.prototype.constructor = _RenderData;

  _RenderData.prototype.init = function init (owner, index) {
    this._owner = owner;
    this._index = index;
  };

  _RenderData.prototype.getNode = function getNode () {
    return this._owner._node;
  };

  _RenderData.prototype.getEffect = function getEffect () {
    return this._owner._effect;
  };

  _RenderData.prototype.getPositions = function getPositions () {
    return this._owner.getPositions(this._index);
  };

  _RenderData.prototype.getUVs = function getUVs () {
    return this._owner.getUVs(this._index);
  };

  _RenderData.prototype.getIndices = function getIndices () {
    return _labelIndices;
  };

  _RenderData.prototype.getColor = function getColor () {
    return this._owner._color;
  };

  _RenderData.prototype.getVertexCount = function getVertexCount () {
    return this._owner.getVertexCount(this._index);
  };

  _RenderData.prototype.getIndexCount = function getIndexCount () {
    return this._owner.getIndexCount(this._index);
  };

  return _RenderData;
}(RenderDataInterface));

var _renderDataPool = new Pool(function () {
  return new _RenderData$1();
}, 2);

var LabelRenderHelper = function LabelRenderHelper() {
  var this$1 = this;

  this._width = _defaultWidth$1;
  this._height = _defaultHeight$1;
  this._pivotX = 0.0;
  this._pivotY = 0.0;
  this._node = null;
  this._effect = null;
  this._font = null;
  this._label = '';
  this._texture = null;

  this._positions = [_positionsPool.alloc(1)];
  this._uvs = [_uvsPool.alloc(1)];
  this._vertexDataDirty = true;

  this._horizontalAlignPercentage = 0.0;
  this._verticalAlignPercentage = 0.0;
  this._horizontalAlign = enums$2.TEXT_ALIGN_LEFT;
  this._verticalAlign = enums$2.TEXT_ALIGN_TOP;
  this._wrap = true;
  this._fontSize = 32;
  this._lineHeight = 1.0;
  // this._indices = _labelIndices;
  this._vertexCount = 0;
  this._indexCount = 0;
  this._color = color4.create();
  var renderData = _renderDataPool.alloc();
  renderData.init(this, 0);
  this._renderData = [renderData];
  this._renderDataCount = 1;

  this._vertexValueAccessor = function (valueName, index, callback) {
    var accessValue = this$1[valueName];
    if (!accessValue || !accessValue[0] || !accessValue[0][0]) {
      callback && callback("Invalid value accessor", null, null, null, null);
    }
    var segmentIndex = Math.floor(index / _maxCharsOneBatch);
    if (segmentIndex < this$1._renderDataCount) {
      var segmentOffset = index - segmentIndex * _maxCharsOneBatch;
      if (segmentOffset * 4 < accessValue[segmentIndex].length) {
        callback && callback(null, accessValue[segmentIndex][4 * segmentOffset], accessValue[segmentIndex][4 * segmentOffset + 1],
          accessValue[segmentIndex][4 * segmentOffset + 2], accessValue[segmentIndex][4 * segmentOffset + 3]);
      } else {
        callback && callback("Out of Range", null, null, null, null);
      }
    } else {
      callback && callback("Out of Range", null, null, null, null);
    }
  };
};

var prototypeAccessors$16 = { label: { configurable: true },width: { configurable: true },height: { configurable: true },pivotX: { configurable: true },pivotY: { configurable: true },font: { configurable: true },wrap: { configurable: true },fontSize: { configurable: true },lineHeight: { configurable: true },horizontalAlign: { configurable: true },verticalAlign: { configurable: true },color: { configurable: true } };

LabelRenderHelper.prototype.destroy = function destroy () {
  this._freeVerticesData();
};

LabelRenderHelper.prototype.positionAccess = function positionAccess (index, callback) {
  return this._vertexValueAccessor('_positions', index, callback);
};

LabelRenderHelper.prototype.uvAccess = function uvAccess (index, callback) {
  return this._vertexValueAccessor('_uvs', index, callback);
};

LabelRenderHelper.prototype._freeVerticesData = function _freeVerticesData () {
    var this$1 = this;

  for (var i = 0; i < this._renderDataCount; ++i) {
    _positionsPool.free(this$1._positions[i]);
    _uvsPool.free(this$1._uvs[i]);
    this$1._renderData[i].resetBatchKey();
    _renderDataPool.free(this$1._renderData[i]);
  }
  this._positions.length = 0;
  this._uvs.length = 0;
  this._renderData.length = 0;
};

LabelRenderHelper.prototype.setNode = function setNode (node) {
  this._node = node;
};

LabelRenderHelper.prototype.setEffect = function setEffect (effect) {
  this._effect = effect;
};

prototypeAccessors$16.label.set = function (val) {
    var this$1 = this;

  this._label = val;
  var renderDataCount = Math.ceil(val.length / _maxCharsOneBatch);
  if (renderDataCount !== this._renderDataCount) {
    this._freeVerticesData();
    this._renderDataCount = renderDataCount;
    // realloc
    this._positions.length = renderDataCount;
    this._uvs.length = renderDataCount;
    this._renderData.length = renderDataCount;
    for (var i = 0; i < renderDataCount; ++i) {
      this$1._positions[i] = _positionsPool.alloc(_maxCharsOneBatch);
      this$1._uvs[i] = _uvsPool.alloc(_maxCharsOneBatch);
      var renderData = this$1._renderData[i] = _renderDataPool.alloc();
      renderData.init(this$1, i);
      if (this$1._font) {
        renderData.setBatchKey(this$1._font._uuid);
      }
    }
  } else {
    // only deal with label with little chars
    if (renderDataCount === 1) {
      var allocCharSize = nextPow2(val.length);
      if (allocCharSize * 4 !== this._positions[0].length) {
        _positionsPool.free(this._positions[0]);
        _uvsPool.free(this._uvs[0]);
        this._uvs[0] = _uvsPool.alloc(allocCharSize);
        this._positions[0] = _positionsPool.alloc(allocCharSize);
      }
    }
  }
  this._vertexDataDirty = true;
};

prototypeAccessors$16.width.set = function (val) {
  if (this._width !== val) {
    this._width = val;
    this._vertexDataDirty = true;
  }
};

prototypeAccessors$16.height.set = function (val) {
  if (this._height !== val) {
    this._height = val;
    this._vertexDataDirty = true;
  }
};

prototypeAccessors$16.pivotX.set = function (val) {
  if (this._pivotX !== val) {
    this._pivotX = val;
    this._vertexDataDirty = true;
  }
};

prototypeAccessors$16.pivotY.set = function (val) {
  if (this._pivotY !== val) {
    this._pivotY = val;
    this._vertexDataDirty = true;
  }
};
prototypeAccessors$16.font.set = function (val) {
  this._font = val;
  this._texture = val._texture;
  this._renderData.forEach(function (data) {
    data.setBatchKey(val._uuid);
  });
  this._vertexDataDirty = true;
};

prototypeAccessors$16.wrap.set = function (val) {
  if (this._wrap !== val) {
    this._wrap = val;
    this._vertexDataDirty = true;
  }
};

prototypeAccessors$16.fontSize.set = function (val) {
  if (this._fontSize !== val) {
    this._fontSize = val;
    this._vertexDataDirty = true;
  }
};

prototypeAccessors$16.lineHeight.set = function (val) {
  if (this._lineHeight !== val) {
    this._lineHeight = val;
    this._vertexDataDirty = true;
  }
};

prototypeAccessors$16.horizontalAlign.set = function (val) {
  var percentage = 0.0;
  if (val === enums$2.TEXT_ALIGN_CENTER) {
    percentage = 0.5;
  } else if (val === enums$2.TEXT_ALIGN_RIGHT) {
    percentage = 1.0;
  } else {
    // do nothing 0.0 is default value
  }
  if (percentage !== this._horizontalAlignPercentage) {
    this._horizontalAlignPercentage = percentage;
    this._vertexDataDirty = true;
  }
};

prototypeAccessors$16.verticalAlign.set = function (val) {
  var percentage = 0.0;
  if (val === enums$2.TEXT_ALIGN_CENTER) {
    percentage = 0.5;
  } else if (val === enums$2.TEXT_ALIGN_BOTTOM) {
    percentage = 1.0;
  } else {
    // do nothing 0.0 is default value
  }
  if (percentage !== this._verticalAlignPercentage) {
    this._verticalAlignPercentage = percentage;
    this._vertexDataDirty = true;
  }
};

prototypeAccessors$16.color.set = function (val) {
  color4.copy(this._color, val);
};

prototypeAccessors$16.color.get = function () {
  return this._color;
};

LabelRenderHelper.prototype.getVertexCount = function getVertexCount (index) {
  var maxVertsOneBatch = _maxCharsOneBatch * 4;
  return (index * maxVertsOneBatch < this._vertexCount) ? (Math.min(maxVertsOneBatch, this._vertexCount - index * maxVertsOneBatch)) : 0;
};

LabelRenderHelper.prototype.getIndexCount = function getIndexCount (index) {
  var maxIndicesOneBatch = _maxCharsOneBatch * 6;
  return (index * maxIndicesOneBatch < this._indexCount) ? (Math.min(maxIndicesOneBatch, this._indexCount - index * maxIndicesOneBatch)) : 0;
};

LabelRenderHelper.prototype.getPositions = function getPositions (index) {
  return (index > this._renderDataCount) ? null : this._positions[index];
};

LabelRenderHelper.prototype.getUVs = function getUVs (index) {
  return (index > this._renderDataCount) ? null : this._uvs[index];
};

LabelRenderHelper.prototype.getRenderDataCount = function getRenderDataCount () {
  return this._renderDataCount;
};

LabelRenderHelper.prototype.getRenderData = function getRenderData (index) {
  if (index > this._renderDataCount) {
    return null;
  } else {
    return this._renderData[index];
  }
};

LabelRenderHelper.prototype.updateModelData = function updateModelData () {
  if (this._vertexDataDirty && this._font) {
    this._vertexDataDirty = false;
    var filledChars = this._font.genTextVertices(this, this._label, this._horizontalAlignPercentage, this._verticalAlignPercentage,
      this._wrap, this._width, this._height, this._fontSize, this._lineHeight, this._pivotX, this._pivotY);
    this._vertexCount = filledChars * 4;
    this._indexCount = filledChars * 6;
  }
};

Object.defineProperties( LabelRenderHelper.prototype, prototypeAccessors$16 );

var LabelComponent = (function (Component$$1) {
  function LabelComponent() {
    Component$$1.call(this);
    this._label = '';
    this._renderHelper = new LabelRenderHelper();
    this._material = new SpriteMaterial();
    this._font = null;
    this._horizontalAlign = enums$2.TEXT_ALIGN_LEFT;
    this._verticalAlign = enums$2.TEXT_ALIGN_TOP;
    this._wrap = true;
    this._fontSize = 32;
    this._lineHeight = 1.0;
    this._color = color4.create();
  }

  if ( Component$$1 ) LabelComponent.__proto__ = Component$$1;
  LabelComponent.prototype = Object.create( Component$$1 && Component$$1.prototype );
  LabelComponent.prototype.constructor = LabelComponent;

  var prototypeAccessors = { font: { configurable: true },label: { configurable: true },color: { configurable: true },wrap: { configurable: true },fontSize: { configurable: true },lineHeight: { configurable: true },horizontalAlign: { configurable: true },verticalAlign: { configurable: true } };

  LabelComponent.prototype.onInit = function onInit () {
    this._renderHelper.setNode(this._entity);
    this._renderHelper.setEffect(this._material._effect);
  };

  prototypeAccessors.font.set = function (val) {
    this._font = val;
    this._material.mainTexture = val._texture;
    this._renderHelper.font = val;
  };

  prototypeAccessors.label.set = function (val) {
    this._label = val;
    this._renderHelper.label = val;
  };

  prototypeAccessors.color.set = function (val) {
    color4.copy(this._color, val);
    this._renderHelper.color = val;
  };

  prototypeAccessors.wrap.set = function (val) {
    this._wrap = val;
    this._renderHelper.wrap = val;
  };

  prototypeAccessors.fontSize.set = function (val) {
    this._fontSize = val;
    this._renderHelper.fontSize = val;
  };

  prototypeAccessors.lineHeight.set = function (val) {
    this._lineHeight = val;
    this._renderHelper.lineHeight = val;
  };

  prototypeAccessors.horizontalAlign.set = function (val) {
    this._horizontalAlign = val;
    this._renderHelper.horizontalAlign = val;
  };

  prototypeAccessors.verticalAlign.set = function (val) {
    this._verticalAlign = val;
    this._renderHelper.verticalAlign = val;
  };

  LabelComponent.prototype.destroy = function destroy () {
    this._renderHelper.destroy();
  };

  Object.defineProperties( LabelComponent.prototype, prototypeAccessors );

  return LabelComponent;
}(Component));

var ScreenComponent = (function (Component$$1) {
  function ScreenComponent() {
    Component$$1.call(this);

    this._width = 960;
    this._height = 640;

    this._view = new renderer.View();
    this._view._clearFlags = 0;
    this._view._cullingByID = true;
    this._view._stages = ['2d'];
  }

  if ( Component$$1 ) ScreenComponent.__proto__ = Component$$1;
  ScreenComponent.prototype = Object.create( Component$$1 && Component$$1.prototype );
  ScreenComponent.prototype.constructor = ScreenComponent;

  return ScreenComponent;
}(Component));

var _wmat = mat4.create();

var WidgetComponent = (function (Component$$1) {
  function WidgetComponent() {
    Component$$1.call(this);

    this._pivotX = 0.5;
    this._pivotY = 0.5;

    this._anchorLeft = 0.5;
    this._anchorBottom = 0.5;
    this._anchorRight = 0.5;
    this._anchorTop = 0.5;

    this._marginLeft = 0.0;
    this._marginRight = 0.0;
    this._marginTop = 0.0;
    this._marginBottom = 0.0;

    this._offsetX = 0.0;
    this._offsetY = 0.0;
    this._width = 100.0;
    this._height = 100.0;

    // calculated rect
    this._rect = { x: 0, y: 0, w: 100.0, h: 100.0 };
  }

  if ( Component$$1 ) WidgetComponent.__proto__ = Component$$1;
  WidgetComponent.prototype = Object.create( Component$$1 && Component$$1.prototype );
  WidgetComponent.prototype.constructor = WidgetComponent;

  var prototypeAccessors = { pivotX: { configurable: true },pivotY: { configurable: true },anchorLeft: { configurable: true },anchorBottom: { configurable: true },anchorRight: { configurable: true },anchorTop: { configurable: true },offsetX: { configurable: true },offsetY: { configurable: true },width: { configurable: true },height: { configurable: true },marginLeft: { configurable: true },marginBottom: { configurable: true },marginRight: { configurable: true },marginTop: { configurable: true } };

  // pivotX
  prototypeAccessors.pivotX.set = function (val) {
    this._pivotX = val;
  };
  prototypeAccessors.pivotX.get = function () {
    return this._pivotX;
  };

  // pivotY
  prototypeAccessors.pivotY.set = function (val) {
    this._pivotY = val;
  };
  prototypeAccessors.pivotY.get = function () {
    return this._pivotY;
  };

  // anchorLeft
  prototypeAccessors.anchorLeft.set = function (val) {
    this._anchorLeft = val;
  };
  prototypeAccessors.anchorLeft.get = function () {
    return this._anchorLeft;
  };

  // anchorBottom
  prototypeAccessors.anchorBottom.set = function (val) {
    this._anchorBottom = val;
  };
  prototypeAccessors.anchorBottom.get = function () {
    return this._anchorBottom;
  };

  // anchorRight
  prototypeAccessors.anchorRight.set = function (val) {
    this._anchorRight = val;
  };
  prototypeAccessors.anchorRight.get = function () {
    return this._anchorRight;
  };

  // anchorTop
  prototypeAccessors.anchorTop.set = function (val) {
    this._anchorTop = val;
  };
  prototypeAccessors.anchorTop.get = function () {
    return this._anchorTop;
  };

  // offsetX
  prototypeAccessors.offsetX.set = function (val) {
    this._offsetX = val;
  };
  prototypeAccessors.offsetX.get = function () {
    return this._offsetX;
  };

  // offsetY
  prototypeAccessors.offsetY.set = function (val) {
    return this._offsetY = val;
  };
  prototypeAccessors.offsetY.get = function () {
    return this._offsetY;
  };

  // width
  prototypeAccessors.width.set = function (val) {
    this._width = val;
  };
  prototypeAccessors.width.get = function () {
    return this._width;
  };

  // height
  prototypeAccessors.height.set = function (val) {
    return this._height = val;
  };
  prototypeAccessors.height.get = function () {
    return this._height;
  };

  // marginLeft
  prototypeAccessors.marginLeft.set = function (val) {
    this._marginLeft = val;
  };
  prototypeAccessors.marginLeft.get = function () {
    return this._marginLeft;
  };

  // marginBottom
  prototypeAccessors.marginBottom.set = function (val) {
    this._marginBottom = val;
  };
  prototypeAccessors.marginBottom.get = function () {
    return this._marginBottom;
  };

  // _marginRight
  prototypeAccessors.marginRight.set = function (val) {
    this._marginRight = val;
  };
  prototypeAccessors.marginRight.get = function () {
    return this._marginRight;
  };

  // marginTop
  prototypeAccessors.marginTop.set = function (val) {
    this._marginTop = val;
  };
  prototypeAccessors.marginTop.get = function () {
    return this._marginTop;
  };

  /**
   * @param {number} l
   * @param {number} b
   * @param {number} r
   * @param {number} t
   */
  WidgetComponent.prototype.setAnchors = function setAnchors (l, b, r, t) {
    this._anchorLeft = l;
    this._anchorRight = r;
    this._anchorBottom = b;
    this._anchorTop = t;
  };

  /**
   * @param {number} l
   * @param {number} b
   * @param {number} r
   * @param {number} t
   */
  WidgetComponent.prototype.setMargin = function setMargin (l, b, r, t) {
    this._marginLeft = l;
    this._marginRight = r;
    this._marginBottom = b;
    this._marginTop = t;
  };

  /**
   * @param {number} x
   * @param {number} y
   */
  WidgetComponent.prototype.setOffset = function setOffset (x, y) {
    this._offsetX = x;
    this._offsetY = y;
  };

  /**
   * @param {number} w
   * @param {number} h
   */
  WidgetComponent.prototype.setSize = function setSize (w, h) {
    this._width = w;
    this._height = h;
  };

  /**
   * @param {number} x
   * @param {number} y
   */
  WidgetComponent.prototype.setPivot = function setPivot (x, y) {
    this._pivotX = x;
    this._pivotY = y;
  };

  /**
   * @param {number} val
   */
  WidgetComponent.prototype.alignLeft = function alignLeft (val) {
    if (this._anchorLeft === this._anchorRight) {
      this._offsetX = val + this._width * this._pivotX;
    } else {
      this._marginLeft = val;
    }
  };

  /**
   * @param {number} val
   */
  WidgetComponent.prototype.alignRight = function alignRight (val) {
    if (this._anchorLeft === this._anchorRight) {
      this._offsetX = -(val + this._width * (1.0 - this._pivotX));
    } else {
      this._marginRight = val;
    }
  };

  /**
   * @param {number} val
   */
  WidgetComponent.prototype.alignBottom = function alignBottom (val) {
    if (this._anchorBottom === this._anchorTop) {
      this._offsetY = val + this._height * this._pivotY;
    } else {
      this._marginBottom = val;
    }
  };

  /**
   * @param {number} val
   */
  WidgetComponent.prototype.alignTop = function alignTop (val) {
    if (this._anchorBottom === this._anchorTop) {
      this._offsetY = -(val + this._height * (1.0 - this._pivotY));
    } else {
      this._marginTop = val;
    }
  };

  // calculate
  WidgetComponent.prototype.calculate = function calculate (parentX, parentY, parentWidth, parentHeight) {
    var refMinX = parentX + parentWidth * this._anchorLeft;
    var refMinY = parentY + parentHeight * this._anchorBottom;
    var refMaxX = parentX + parentWidth * this._anchorRight;
    var refMaxY = parentY + parentHeight * this._anchorTop;

    var dx = refMaxX - refMinX;
    var dy = refMaxY - refMinY;

    var rectX = 0.0;
    var rectY = 0.0;
    var rectWidth = 0.0;
    var rectHeight = 0.0;

    if (dx === 0.0) {
      rectX = refMinX - this._width * this._pivotX + this._offsetX;
      rectWidth = this._width;
    } else {
      rectX = refMinX + this._marginLeft;
      rectWidth = dx - (this._marginLeft + this._marginRight);
    }

    if (dy === 0.0) {
      rectY = refMinY - this._height * this._pivotY + this._offsetY;
      rectHeight = this._height;
    } else {
      rectY = refMinY + this._marginBottom;
      rectHeight = dy - (this._marginBottom + this._marginTop);
    }

    vec3.set(
      this._entity.lpos,
      rectX + rectWidth * this._pivotX,
      rectY + rectHeight * this._pivotY,
      this._entity.lpos.z
    );

    this._rect.x = rectX - this._entity.lpos.x;
    this._rect.y = rectY - this._entity.lpos.y;
    this._rect.w = rectWidth;
    this._rect.h = rectHeight;
  };

  WidgetComponent.prototype.getWorldCorners = function getWorldCorners (outA, outB, outC, outD) {
    this._entity.getWorldMatrix(_wmat);

    var x = this._rect.x;
    var y = this._rect.y;
    var w = this._rect.w;
    var h = this._rect.h;

    // a
    vec3.set(outA, x, y + h, 0.0);
    vec3.transformMat4(outA, outA, _wmat);

    // b
    vec3.set(outB, x, y, 0.0);
    vec3.transformMat4(outB, outB, _wmat);

    // c
    vec3.set(outC, x + w, y, 0.0);
    vec3.transformMat4(outC, outC, _wmat);

    // d
    vec3.set(outD, x + w, y + h, 0.0);
    vec3.transformMat4(outD, outD, _wmat);
  };

  Object.defineProperties( WidgetComponent.prototype, prototypeAccessors );

  return WidgetComponent;
}(Component));

var ScriptSystem = (function (System$$1) {
  function ScriptSystem() {
    System$$1.call(this);

    this._scripts = new FixedArray(200);
  }

  if ( System$$1 ) ScriptSystem.__proto__ = System$$1;
  ScriptSystem.prototype = Object.create( System$$1 && System$$1.prototype );
  ScriptSystem.prototype.constructor = ScriptSystem;

  ScriptSystem.prototype.add = function add (comp) {
    this._scripts.push(comp);

    // TODO: sort script by priority
  };

  ScriptSystem.prototype.remove = function remove (comp) {
    var this$1 = this;

    for (var i = 0; i < this._scripts.length; ++i) {
      var c = this$1._scripts.data[i];
      if (c === comp) {
        this$1._scripts.fastRemove(i);
        break;
      }
    }
  };

  ScriptSystem.prototype.tick = function tick () {
    var this$1 = this;

    for (var i = 0; i < this._scripts.length; ++i) {
      var script = this$1._scripts.data[i];

      // skip if entity is not ready, or the component is destroyed, or is disabled
      if (script.destroyed || !script.enabled) {
        continue;
      }

      // start script
      if (script._startedFlag === 0) {
        script._startedFlag = 1;
        script.start();
        continue;
      }

      script.update();
    }
  };

  ScriptSystem.prototype.postTick = function postTick () {
    var this$1 = this;

    for (var i = 0; i < this._scripts.length; ++i) {
      var script = this$1._scripts.data[i];

      if (script._startedFlag === 1) {
        script._startedFlag = 2;
        continue;
      }

      // skip if entity is not ready, or the component is destroyed, or is disabled
      if (script.destroyed || !script.enabled) {
        continue;
      }

      script.postUpdate();
    }
  };

  return ScriptSystem;
}(System));

var CameraSystem = (function (System$$1) {
  function CameraSystem() {
    System$$1.call(this);
  }

  if ( System$$1 ) CameraSystem.__proto__ = System$$1;
  CameraSystem.prototype = Object.create( System$$1 && System$$1.prototype );
  CameraSystem.prototype.constructor = CameraSystem;

  CameraSystem.prototype.add = function add (comp) {
    this._engine.scene.addCamera(comp._camera);
  };

  CameraSystem.prototype.remove = function remove (comp) {
    this._engine.scene.removeCamera(comp._camera);
  };

  return CameraSystem;
}(System));

var LightSystem = (function (System$$1) {
  function LightSystem() {
    System$$1.call(this);
  }

  if ( System$$1 ) LightSystem.__proto__ = System$$1;
  LightSystem.prototype = Object.create( System$$1 && System$$1.prototype );
  LightSystem.prototype.constructor = LightSystem;

  LightSystem.prototype.add = function add (comp) {
    this._engine.scene.addLight(comp._light);
  };

  LightSystem.prototype.remove = function remove (comp) {
    this._engine.scene.removeLight(comp._light);
  };

  return LightSystem;
}(System));

var ModelSystem = (function (System$$1) {
  function ModelSystem() {
    System$$1.call(this);
  }

  if ( System$$1 ) ModelSystem.__proto__ = System$$1;
  ModelSystem.prototype = Object.create( System$$1 && System$$1.prototype );
  ModelSystem.prototype.constructor = ModelSystem;

  ModelSystem.prototype.add = function add (comp) {
    this._engine.scene.addModel(comp._model);
  };

  ModelSystem.prototype.remove = function remove (comp) {
    this._engine.scene.removeModel(comp._model);
  };

  return ModelSystem;
}(System));

var SkinningModelSystem = (function (System$$1) {
  function SkinningModelSystem() {
    System$$1.call(this);
  }

  if ( System$$1 ) SkinningModelSystem.__proto__ = System$$1;
  SkinningModelSystem.prototype = Object.create( System$$1 && System$$1.prototype );
  SkinningModelSystem.prototype.constructor = SkinningModelSystem;

  SkinningModelSystem.prototype.add = function add (comp) {
    this._engine.scene.addModel(comp._model);
  };

  SkinningModelSystem.prototype.remove = function remove (comp) {
    this._engine.scene.removeModel(comp._model);
  };

  return SkinningModelSystem;
}(System));

var AnimationSystem = (function (System$$1) {
  function AnimationSystem() {
    System$$1.call(this);

    this._anims = new FixedArray(200);
  }

  if ( System$$1 ) AnimationSystem.__proto__ = System$$1;
  AnimationSystem.prototype = Object.create( System$$1 && System$$1.prototype );
  AnimationSystem.prototype.constructor = AnimationSystem;

  AnimationSystem.prototype.add = function add (comp) {
    this._anims.push(comp);
  };

  AnimationSystem.prototype.remove = function remove (comp) {
    var this$1 = this;

    for (var i = 0; i < this._anims.length; ++i) {
      var c = this$1._anims.data[i];
      if (c === comp) {
        this$1._anims.fastRemove(i);
        break;
      }
    }
  };

  AnimationSystem.prototype.tick = function tick () {
    var this$1 = this;

    for (var i = 0; i < this._anims.length; ++i) {
      var anim = this$1._anims.data[i];
      anim._animCtrl.tick(this$1._engine.deltaTime);
    }
  };

  return AnimationSystem;
}(System));

var SkyboxSystem = (function (System$$1) {
  function SkyboxSystem() {
    System$$1.call(this);
  }

  if ( System$$1 ) SkyboxSystem.__proto__ = System$$1;
  SkyboxSystem.prototype = Object.create( System$$1 && System$$1.prototype );
  SkyboxSystem.prototype.constructor = SkyboxSystem;

  SkyboxSystem.prototype.add = function add (comp) {
    this._engine.scene.addModel(comp._model);
  };

  SkyboxSystem.prototype.remove = function remove (comp) {
    this._engine.scene.removeModel(comp._model);
  };

  return SkyboxSystem;
}(System));

var SpriteSystem = (function (System$$1) {
  function SpriteSystem() {
    System$$1.call(this);
  }

  if ( System$$1 ) SpriteSystem.__proto__ = System$$1;
  SpriteSystem.prototype = Object.create( System$$1 && System$$1.prototype );
  SpriteSystem.prototype.constructor = SpriteSystem;

  return SpriteSystem;
}(System));

var LabelSystem = (function (System$$1) {
  function LabelSystem() {
    System$$1.call(this);
  }

  if ( System$$1 ) LabelSystem.__proto__ = System$$1;
  LabelSystem.prototype = Object.create( System$$1 && System$$1.prototype );
  LabelSystem.prototype.constructor = LabelSystem;

  return LabelSystem;
}(System));

/**
 * the distance of the point to plane
 *
 * @param {vec3} point
 * @param {plane} plane
 */
function point_plane(point, plane) {
  return vec3.dot(plane.n, point) - plane.d;
}

/**
 * the closest point of the point to plane
 *
 * @param {vec3} out the result point
 * @param {vec3} point
 * @param {plane} plane
 */
function pt_point_plane (out, point, plane) {
  var t = point_plane(point, plane);

  return vec3.sub(out, point, vec3.scale(out, plane.n, t));
}


/**
 * @name distance
 */
var distance = {
  point_plane: point_plane,
  pt_point_plane: pt_point_plane,
};

/**
 * ray-plane intersect
 *
 * @param {ray} ray
 * @param {plane} plane
 * @param {vec3} outPt the intersect point if provide
 * @return {boolean}
 */
var ray_plane = (function () {
  var pt = vec3.create();

  return function (ray, plane, outPt) {
    distance.pt_point_plane(pt, ray.o, plane);
    var t = vec3.dot(pt, plane.n) / vec3.dot(ray.d, plane.n);
    var intersects = t >= 0;

    if ( outPt && intersects ) {
      vec3.scale(outPt, ray.d, t);
      vec3.add(outPt, outPt, ray.o);
    }

    return intersects;
  };
})();

/**
 * line-plane intersect
 *
 * @param {line} line
 * @param {plane} plane
 * @param {vec3} outPt the intersect point if provide
 * @return {boolean}
 */
var line_plane = (function () {
  var ab = vec3.create();

  return function (line, plane, outPt) {
    vec3.sub(ab, line.e, line.s);
    var t = (plane.d - vec3.dot(line.s, plane.n)) / vec3.dot(ab, plane.n);
    var intersects = t >= 0 && t <= 1.0;

    if ( outPt && intersects ) {
      vec3.scale(outPt, ab, t);
      vec3.add(outPt, outPt, line.s);
    }

    return intersects;
  };
})();

/**
 * ray-triangle intersect
 *
 * @param {ray} ray
 * @param {triangle} triangle
 * @param {vec3} outPt the intersect point if provide
 * @return {boolean}
 */
var ray_triangle = (function () {
  var ab = vec3.create();
  var ac = vec3.create();
  var pvec = vec3.create();
  var tvec = vec3.create();
  var qvec = vec3.create();

  return function (ray, triangle, outPt) {
    vec3.sub(ab, triangle.b, triangle.a);
    vec3.sub(ac, triangle.c, triangle.a);

    vec3.cross(pvec, ray.d, ac);
    var det = vec3.dot(ab, pvec);

    if (det <= 0) {
      return false;
    }

    vec3.sub(tvec, ray.o, triangle.a);
    var u = vec3.dot(tvec, pvec);
    if (u < 0 || u > det) {
      return false;
    }

    vec3.cross(qvec, tvec, ab);
    var v = vec3.dot(ray.d, qvec);
    if (v < 0 || u + v > det) {
      return false;
    }

    if (outPt) {
      var t = vec3.dot(ac, qvec) / det;
      vec3.scaleAndAdd(outPt, ray.o, ray.d, t);
    }

    return true;
  };
})();

/**
 * line-triangle intersect
 *
 * @param {line} line
 * @param {triangle} triangle
 * @param {vec3} outPt the intersect point if provide
 * @return {boolean}
 */
var line_triangle = (function () {
  var ab = vec3.create();
  var ac = vec3.create();
  var qp = vec3.create();
  var ap = vec3.create();
  var n = vec3.create();
  var e = vec3.create();

  return function (line, triangle, outPt) {
    vec3.sub(ab, triangle.b, triangle.a);
    vec3.sub(ac, triangle.c, triangle.a);
    vec3.sub(qp, line.s, line.e);

    vec3.cross(n, ab, ac);
    var det = vec3.dot(qp, n);

    if (det <= 0.0) {
      return false;
    }

    vec3.sub(ap, line.s, triangle.a);
    var t = vec3.dot(ap, n);
    if (t < 0 || t > det) {
      return false;
    }

    vec3.cross(e, qp, ap);
    var v = vec3.dot(ac, e);
    if (v < 0 || v > det) {
      return false;
    }

    var w = -vec3.dot(ab, e);
    if (w < 0.0 || v + w > det) {
      return false;
    }

    if (outPt) {
      var invDet = 1.0 / det;
      v *= invDet;
      w *= invDet;
      var u = 1.0 - v - w;

      // outPt = u*a + v*d + w*c;
      vec3.set(outPt,
        triangle.a.x * u + triangle.b.x * v + triangle.c.x * w,
        triangle.a.y * u + triangle.b.y * v + triangle.c.y * w,
        triangle.a.z * u + triangle.b.z * v + triangle.c.z * w
      );
    }

    return true;
  };
})();

/**
 * ray-quad intersect
 *
 * @param {vec3} p
 * @param {vec3} q
 * @param {vec3} a
 * @param {vec3} b
 * @param {vec3} c
 * @param {vec3} d
 * @param {vec3} outPt the intersect point if provide
 * @return {boolean}
 */
var line_quad = (function () {
  var pq = vec3.create();
  var pa = vec3.create();
  var pb = vec3.create();
  var pc = vec3.create();
  var pd = vec3.create();
  var m = vec3.create();
  var tmp = vec3.create();

  return function (p, q, a, b, c, d, outPt) {
    vec3.sub(pq, q, p);
    vec3.sub(pa, a, p);
    vec3.sub(pb, b, p);
    vec3.sub(pc, c, p);

    // Determine which triangle to test against by testing against diagonal first
    vec3.cross(m, pc, pq);
    var v = vec3.dot(pa, m);

    if (v >= 0) {
      // Test intersection against triangle abc
      var u = -vec3.dot(pb, m);
      if (u < 0) {
        return false;
      }

      var w = vec3.dot(vec3.cross(tmp, pq, pb), pa);
      if (w < 0) {
        return false;
      }

      // outPt = u*a + v*b + w*c;
      if (outPt) {
        var denom = 1.0 / (u + v + w);
        u *= denom;
        v *= denom;
        w *= denom;

        vec3.set(outPt,
          a.x * u + b.x * v + c.x * w,
          a.y * u + b.y * v + c.y * w,
          a.z * u + b.z * v + c.z * w
        );
      }
    } else {
      // Test intersection against triangle dac
      vec3.sub(pd, d, p);

      var u$1 = vec3.dot(pd, m);
      if (u$1 < 0) {
        return false;
      }

      var w$1 = vec3.dot(vec3.cross(tmp, pq, pa), pd);
      if (w$1 < 0) {
        return false;
      }

      // outPt = u*a + v*d + w*c;
      if (outPt) {
        v = -v;

        var denom$1 = 1.0 / (u$1 + v + w$1);
        u$1 *= denom$1;
        v *= denom$1;
        w$1 *= denom$1;

        vec3.set(outPt,
          a.x * u$1 + d.x * v + c.x * w$1,
          a.y * u$1 + d.y * v + c.y * w$1,
          a.z * u$1 + d.z * v + c.z * w$1
        );
      }
    }

    return true;
  };
})();

/**
 * @name intersect
 */
var intersect = {
  ray_plane: ray_plane,
  line_plane: line_plane,
  ray_triangle: ray_triangle,
  line_triangle: line_triangle,
  line_quad: line_quad,
};

var _plane = function _plane(nx, ny, nz, d) {
  this.n = vec3.new(nx, ny, nz);
  this.d = d;
};

/**
 * @class plane
 * @name plane
 */
var plane$1 = {};

/**
 * create a new plane
 *
 * @return {plane}
 */
plane$1.create = function () {
  return new _plane(0, 1, 0, 0);
};

/**
 * create a new plane
 *
 * @param {Number} nx normal X component
 * @param {Number} ny normal Y component
 * @param {Number} nz normal Z component
 * @param {Number} d the constant d
 * @return {plane}
 */
plane$1.new = function (nx, ny, nz, d) {
  return new _plane(nx, ny, nz, d);
};

/**
 * clone a new plane
 *
 * @param {plane} a the source plane
 * @return {plane}
 */
plane$1.clone = function (p) {
  return new _plane(p.n.x, p.n.y, p.n.z, p.d);
};

/**
 * copy the values from one plane to another
 *
 * @param {plane} out the receiving plane
 * @param {plane} a the source plane
 * @return {plane}
 */
plane$1.copy = function (out, p) {
  out.n.x = p.n.x;
  out.n.y = p.n.y;
  out.n.z = p.n.z;
  out.d = p.d;

  return out;
};

/**
 * Set the components of a plane to the given values
 *
 * @param {plane} out the receiving plane
 * @param {Number} nx X component of n
 * @param {Number} ny Y component of n
 * @param {Number} nz Z component of n
 * @param {Number} d
 * @returns {plane} out
 * @function
 */
plane$1.set = function (out, nx, ny, nz, d) {
  out.n.x = nx;
  out.n.y = ny;
  out.n.z = nz;
  out.d = d;

  return out;
};

/**
 * create plane from normal and point
 *
 * @param {plane} out the receiving plane
 * @param {vec3} normal
 * @param {vec3} point
 * @returns {plane} out
 * @function
 */
plane$1.fromNormalAndPoint = function (out, normal, point) {
  vec3.copy(out.n, normal);
  out.d = vec3.dot(normal, point);

  return out;
};

/**
 * create plane from 3 points
 *
 * @param {plane} out the receiving plane
 * @param {vec3} a
 * @param {vec3} b
 * @param {vec3} c
 * @returns {plane} out
 * @function
 */
plane$1.fromPoints = (function () {
  var v1 = vec3.create();
  var v2 = vec3.create();

  return function (out, a, b, c) {
    vec3.sub(v1, b, a);
    vec3.sub(v2, c, a);

    vec3.normalize(out.n, vec3.cross(out.n, v1, v2));
    out.d = vec3.dot(out.n, a);

    return out;
  };
})();

var MouseEvent = (function (Event$$1) {
  function MouseEvent(name) {
    Event$$1.call(this, name, {
      bubbles: false
    });
    this.reset();
  }

  if ( Event$$1 ) MouseEvent.__proto__ = Event$$1;
  MouseEvent.prototype = Object.create( Event$$1 && Event$$1.prototype );
  MouseEvent.prototype.constructor = MouseEvent;

  /**
   * @method reset
   *
   * reset mouse value
   */
  MouseEvent.prototype.reset = function reset () {
    this.target = null;
    this.sender = null;

    this.dx = 0.0;
    this.dy = 0.0;
    this.mouseX = 0.0;
    this.mouseY = 0.0;
    this.button = 0;
    this.buttons = 0;
  };

  return MouseEvent;
}(Event));

// todo: those value could be changed
var _vertsInIAPool = 1024;
var _indicesInIAPool = 4096;
var _multiplyTransformVertexThreshold = 512;
// todo: this value is used for vec2 positon + vec2 uv + vec4 color
var _floatsPerVert = 8;
var _m4_tmp$4 = mat4.create();
var _v3_tmp$1 = vec3.create();

var _getWidgetAt = (function () {
  var p = vec3.create();
  var q = vec3.create();
  var a = vec3.create();
  var b = vec3.create();
  var c = vec3.create();
  var d = vec3.create();

  return function (screen, entities, x, y) {
    // TEMP DISABLE:
    // let view = screen._view;
    // let cx = view._rect.x;
    // let cy = view._rect.y;
    // let cw = view._rect.w;
    // let ch = view._rect.h;

    // // calculate screen pos in far clip plane
    // let wx = (x - cx) * 2.0 / cw - 1.0;
    // let wy = (y - cy) * 2.0 / ch - 1.0;
    // vec3.set(_v3_tmp, wx, wy, 0);

    // // transform to world
    // vec3.transformMat4(_v3_tmp, _v3_tmp, view._matInvViewProj);

    vec3.set(p, x, y, 1);
    vec3.set(q, x, y, -1);

    //
    for (var i = entities.length - 1; i >= 0; --i) {
      var ent = entities.data[i];
      var widget = ent.getComp('Widget');
      widget.getWorldCorners(a, b, c, d);

      if (intersect.line_quad(p, q, a, b, c, d)) {
        return ent;
      }
    }

    return null;
  };
})();

var _ScreenRendererHelper = function _ScreenRendererHelper(app, submitCallback) {
  this._app = app;
  var device = app._device;
  // init vb and ib pool
  var fmt = [];
  fmt.push({ name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 });
  fmt.push({ name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 });
  //todo: use UINT32 for color to optimise memory if it is needed
  fmt.push({ name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_FLOAT32, num: 4 });
  this._vbPool = new RecyclePool(function () {
    return new gfx.VertexBuffer(device, new gfx.VertexFormat(fmt), gfx.USAGE_STATIC, null, _vertsInIAPool);
  }, 3);
  this._ibPool = new RecyclePool(function () {
    return new gfx.IndexBuffer(device, gfx.INDEX_FMT_UINT16, gfx.USAGE_STATIC, null, _indicesInIAPool);
  }, 3);
  this._iaPool = new RecyclePool(function () {
    return new renderer.InputAssembler(null, null);
  }, 8);

  this._modelPool = new RecyclePool(function () {
    return new renderer.Model();
  }, 8);
  this._usedModels = [];

  this._vb = null;
  this._ib = null;
  this._vertexOffset = 0;
  this._indexOffset = 0;
  this._batchedItems = [];
  this._batchedVerts = new Float32Array(_vertsInIAPool * _floatsPerVert);
  this._batchedIndices = new Uint16Array(_indicesInIAPool);
  this._submitCallback = submitCallback;
  this._currentScreen = null;
  this._sortKey = 0;

  this._dummyNode = new Node();
};

_ScreenRendererHelper.prototype.beginScreen = function beginScreen (screen) {
  this._currentScreen = screen;
};

_ScreenRendererHelper.prototype.endScreen = function endScreen () {
  this._flush();
  this._currentScreen = null;
  this._sortKey = 0;
};

_ScreenRendererHelper.prototype.addItem = function addItem (renderData) {
    var this$1 = this;

  // fast return
  if (!renderData || renderData.getVertexCount() === 0 || renderData.getIndexCount() === 0) {
    return;
  }
  var positions = renderData.getPositions();
  var uvs = renderData.getUVs();
  var color = renderData.getColor();
  var node = renderData.getNode();
  if (this._vb === null || this._ib === null) {
    this._vb = this._vbPool.add();
    this._ib = this._ibPool.add();
  }
  var ia = this._iaPool.add();
  node.getWorldMatrix(_m4_tmp$4);
  if (renderData.getVertexCount() + this._vertexOffset > _vertsInIAPool || renderData.getIndexCount() + this._indexOffset > _indicesInIAPool) {
    this._flush();
    this._vb = this._vbPool.add();
    this._ib = this._ibPool.add();
  }
  var multiplyTransform = renderData.getVertexCount() < _multiplyTransformVertexThreshold;
  for (var i = 0; i < renderData.getVertexCount(); ++i) {
    var position = positions[i];
    if (multiplyTransform) {
      vec3.transformMat4(_v3_tmp$1, positions[i], _m4_tmp$4);
      position = _v3_tmp$1;
    }
    this$1._batchedVerts[(this$1._vertexOffset + i) * _floatsPerVert] = position.x;
    this$1._batchedVerts[(this$1._vertexOffset + i) * _floatsPerVert + 1] = position.y;
    this$1._batchedVerts[(this$1._vertexOffset + i) * _floatsPerVert + 2] = uvs[i].x;
    this$1._batchedVerts[(this$1._vertexOffset + i) * _floatsPerVert + 3] = uvs[i].y;

    this$1._batchedVerts[(this$1._vertexOffset + i) * _floatsPerVert + 4] = color.r;
    this$1._batchedVerts[(this$1._vertexOffset + i) * _floatsPerVert + 5] = color.g;
    this$1._batchedVerts[(this$1._vertexOffset + i) * _floatsPerVert + 6] = color.b;
    this$1._batchedVerts[(this$1._vertexOffset + i) * _floatsPerVert + 7] = color.a;
  }
  var indices = renderData.getIndices();
  for (var i$1 = 0; i$1 < renderData.getIndexCount(); ++i$1) {
    this$1._batchedIndices[this$1._indexOffset + i$1] = indices[i$1] + this$1._vertexOffset;
  }
  renderData._ia = ia;
  renderData._multiplyTransform = multiplyTransform;
  this._batchedItems.push(renderData);
  ia._vertexBuffer = this._vb;
  ia._indexBuffer = this._ib;
  ia._start = this._indexOffset;
  ia._count = renderData.getIndexCount();
  this._vertexOffset = this._vertexOffset + renderData.getVertexCount();
  this._indexOffset = this._indexOffset + renderData.getIndexCount();
};

_ScreenRendererHelper.prototype._flush = function _flush () {
    var this$1 = this;

  if (this._batchedItems.length > 0) {
    this._vb.update(0, this._batchedVerts);
    this._ib.update(0, this._batchedIndices);
  }
  for (var i = 0; i < this._batchedItems.length; ++i) {
    var item = this$1._batchedItems[i];
    var nextItem = this$1._batchedItems[i + 1];
    if (nextItem && item.batchTest(nextItem)) {
      // do batch
      nextItem._ia._start = item._ia._start;
      nextItem._ia._count = nextItem._ia._count + item._ia._count;
    } else {
      this$1._submit(item);
    }
    item._ia = null;
  }
  this._vb = null;
  this._ib = null;
  this._batchedItems.length = 0;
  this._vertexOffset = this._indexOffset = 0;
};

_ScreenRendererHelper.prototype._submit = function _submit (renderData) {
  var model = this._modelPool.add();
  this._usedModels.push(model);
  model.sortKey = this._sortKey++;
  model._viewID = this._currentScreen._view._id;
  model.setNode(renderData._multiplyTransform ? this._dummyNode : renderData.getNode());
  model.addEffect(renderData.getEffect());
  model.addInputAssembler(renderData._ia);
  this._app.scene.addModel(model);
};

_ScreenRendererHelper.prototype.reset = function reset () {
    var this$1 = this;

  this._iaPool.reset();
  this._vbPool.reset();
  this._ibPool.reset();
  var scene = this._app.scene;
  for (var i = 0; i < this._usedModels.length; ++i) {
    // remove from scene
    this$1._usedModels[i].clearInputAssemblers();
    this$1._usedModels[i].clearEffects();
    scene.removeModel(this$1._usedModels[i]);
  }
  this._modelPool.reset();
  this._usedModels.length = 0;
};

var ScreenSystem = (function (System$$1) {
  function ScreenSystem() {
    System$$1.call(this);

    this._screens = [];
    this._entities = new FixedArray(100);

    this._lastHoverEntity = null;
    this._mouseEventPool = new RecyclePool(function () {
      return new MouseEvent('unknown');
    }, 8);
  }

  if ( System$$1 ) ScreenSystem.__proto__ = System$$1;
  ScreenSystem.prototype = Object.create( System$$1 && System$$1.prototype );
  ScreenSystem.prototype.constructor = ScreenSystem;

  ScreenSystem.prototype.finalize = function finalize () {
    this._screenRendererHelper = new _ScreenRendererHelper(this._engine);
  };

  ScreenSystem.prototype.add = function add (comp) {
    this._screens.push(comp);
    this._engine.scene.addView(comp._view);
  };

  ScreenSystem.prototype.remove = function remove (comp) {
    var idx = this._screens.indexOf(comp);
    if (idx !== -1) {
      this._screens.splice(idx, 1);
      this._engine.scene.removeView(comp._view);
    }
  };

  ScreenSystem.prototype.tick = function tick () {
    var this$1 = this;

    var screenRenderer = this._screenRendererHelper;
    screenRenderer.reset();
    var input = this._engine._input;
    this._mouseEventPool.reset();

    for (var index = 0; index < this._screens.length; ++index) {
      var screen = this$1._screens[index];
      var view = screen._view;

      // setup view matrix
      var canvasWidth = this$1._engine._canvas.width;
      var canvasHeight = this$1._engine._canvas.height;

      mat4.ortho(view._matProj, 0, canvasWidth, 0, canvasHeight, -100, 100);
      mat4.copy(view._matViewProj, view._matProj);
      mat4.invert(view._matInvViewProj, view._matProj);
      view._rect.x = view._rect.y = 0;
      view._rect.w = canvasWidth;
      view._rect.h = canvasHeight;

      //
      var screenRoot = screen._entity;

      this$1._entities.reset();
      utils.walk(screenRoot, function (entity) {
        this$1._entities.push(entity);
      });

      // ==========================
      // handle mouse input
      // ==========================

      var targetEnt = null;
      var mousedownBtn = '';
      var mouseupBtn = '';
      var mousemoved = input.mouseDeltaX !== 0 || input.mouseDeltaY !== 0;

      // handle mousedown button
      if (input.mousedown('left')) {
        mousedownBtn = 'left';
      } else if (input.mousedown('right')) {
        mousedownBtn = 'right';
      } else if (input.mousedown('middle')) {
        mousedownBtn = 'middle';
      }

      // handle mouseup button
      if (input.mouseup('left')) {
        mouseupBtn = 'left';
      } else if (input.mouseup('right')) {
        mouseupBtn = 'right';
      } else if (input.mouseup('middle')) {
        mouseupBtn = 'middle';
      }

      //
      if (
        mousemoved ||
        mousedownBtn !== '' ||
        mouseupBtn !== ''
      ) {
        targetEnt = _getWidgetAt(screen, this$1._entities, input.mouseX, input.mouseY);
      }

      if (targetEnt) {
        // emit mousedown
        if (mousedownBtn !== '') {
          var mouseEvent = this$1._mouseEventPool.add();
          mouseEvent.reset();
          mouseEvent.name = 'mousedown';
          mouseEvent.dx = input.dx;
          mouseEvent.dy = input.dy;
          mouseEvent.mouseX = input.mouseX;
          mouseEvent.mouseY = input.mouseY;
          mouseEvent.target = targetEnt;
          mouseEvent.button = mousedownBtn;
          mouseEvent.buttons = input.mouseButtons;

          targetEnt.emit('mousedown', mouseEvent);
        }

        // emit mouseup
        if (mouseupBtn !== '') {
          var mouseEvent$1 = this$1._mouseEventPool.add();
          mouseEvent$1.reset();
          mouseEvent$1.name = 'mouseup';
          mouseEvent$1.dx = input.dx;
          mouseEvent$1.dy = input.dy;
          mouseEvent$1.mouseX = input.mouseX;
          mouseEvent$1.mouseY = input.mouseY;
          mouseEvent$1.target = targetEnt;
          mouseEvent$1.button = mouseupBtn;
          mouseEvent$1.buttons = input.mouseButtons;

          targetEnt.emit('mouseup', mouseEvent$1);
        }
      }

      if (mousemoved) {
        if (this$1._lastHoverEntity !== targetEnt) {
          // emit mouseleave
          if (this$1._lastHoverEntity) {
            var mouseEvent$2 = this$1._mouseEventPool.add();
            mouseEvent$2.reset();
            mouseEvent$2.name = 'mouseleave';
            mouseEvent$2.dx = input.dx;
            mouseEvent$2.dy = input.dy;
            mouseEvent$2.mouseX = input.mouseX;
            mouseEvent$2.mouseY = input.mouseY;
            mouseEvent$2.target = this$1._lastHoverEntity;
            mouseEvent$2.button = 0;
            mouseEvent$2.buttons = input.mouseButtons;

            this$1._lastHoverEntity.emit('mouseleave', mouseEvent$2);
          }

          // emit mouseenter
          if (targetEnt) {
            var mouseEvent$3 = this$1._mouseEventPool.add();
            mouseEvent$3.reset();
            mouseEvent$3.name = 'mouseenter';
            mouseEvent$3.dx = input.dx;
            mouseEvent$3.dy = input.dy;
            mouseEvent$3.mouseX = input.mouseX;
            mouseEvent$3.mouseY = input.mouseY;
            mouseEvent$3.target = targetEnt;
            mouseEvent$3.button = 0;
            mouseEvent$3.buttons = input.mouseButtons;

            targetEnt.emit('mouseenter', mouseEvent$3);
          }

          this$1._lastHoverEntity = targetEnt;
        }

        // emit mousemove
        if (targetEnt) {
          var mouseEvent$4 = this$1._mouseEventPool.add();
          mouseEvent$4.reset();
          mouseEvent$4.name = 'mousemove';
          mouseEvent$4.dx = input.dx;
          mouseEvent$4.dy = input.dy;
          mouseEvent$4.mouseX = input.mouseX;
          mouseEvent$4.mouseY = input.mouseY;
          mouseEvent$4.target = targetEnt;
          mouseEvent$4.button = 0;
          mouseEvent$4.buttons = input.mouseButtons;

          targetEnt.emit('mousemove', mouseEvent$4);
        }
      }

      // ==========================
      // layout screen elements
      // ==========================

      for (var i = 0; i < this._entities.length; ++i) {
        var entity = this$1._entities.data[i];

        // do nothing when we are at root
        if (entity === screenRoot) {
          continue;
        }

        var parent = entity.parent;
        var parentX = 0, parentY = 0;
        var parentWidth = 0, parentHeight = 0;

        if (parent === screenRoot) {
          // TODO:
          // let screen = parent.getComp('Screen');
          // width = screen.width;
          // height = screen.height;

          parentX = 0.0;
          parentY = 0.0;
          parentWidth = this$1._engine._canvas.width;
          parentHeight = this$1._engine._canvas.height;
        } else {
          var parentWidget = parent.getComp('Widget');
          parentX = parentWidget._rect.x;
          parentY = parentWidget._rect.y;
          parentWidth = parentWidget._rect.w;
          parentHeight = parentWidget._rect.h;
        }

        //
        var widget = entity.getComp('Widget');
        widget.calculate(parentX, parentY, parentWidth, parentHeight);
      }

      // ==========================
      // render screen elements
      // ==========================

      screenRenderer.beginScreen(screen);
      utils.walk(screenRoot, function (entity) {
        // todo change it if the interface changed in widget component
        var width = 1;
        var height = 1;
        var pivotX = 0.0;
        var pivotY = 0.0;
        var widgetComp = entity.getComp('Widget');
        if (widgetComp) {
          width = widgetComp._rect.w;
          height = widgetComp._rect.h;
          pivotX = widgetComp._pivotX;
          pivotY = widgetComp._pivotY;
        }
        var spriteComp = entity.getComp('Sprite');
        if (spriteComp) {
          var renderHelper = spriteComp._renderHelper;
          renderHelper.width = width;
          renderHelper.height = height;
          renderHelper.pivotX = pivotX;
          renderHelper.pivotY = pivotY;
          renderHelper.updateModelData();
          for (var i = 0; i < renderHelper.getRenderDataCount(); ++i) {
            screenRenderer.addItem(renderHelper.getRenderData(i));
          }
        }

        var labelComp = entity.getComp('Label');
        if (labelComp) {
          var renderHelper$1 = labelComp._renderHelper;
          renderHelper$1.width = width;
          renderHelper$1.height = height;
          renderHelper$1.pivotX = pivotX;
          renderHelper$1.pivotY = pivotY;
          renderHelper$1.updateModelData();
          for (var i$1 = 0; i$1 < renderHelper$1.getRenderDataCount(); ++i$1) {
            screenRenderer.addItem(renderHelper$1.getRenderData(i$1));
          }
        }
        return true;
      });

      screenRenderer.endScreen();
    }
  };

  return ScreenSystem;
}(System));

var WidgetSystem = (function (System$$1) {
  function WidgetSystem() {
    System$$1.call(this);
  }

  if ( System$$1 ) WidgetSystem.__proto__ = System$$1;
  WidgetSystem.prototype = Object.create( System$$1 && System$$1.prototype );
  WidgetSystem.prototype.constructor = WidgetSystem;

  return WidgetSystem;
}(System));

// loader
// builtin components & systems
function _initBuiltins(device) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  // default texture canvas fill
  canvas.width = canvas.height = 128;
  context.fillStyle = '#ddd';
  context.fillRect(0, 0, 128, 128);
  context.fillStyle = '#555';
  context.fillRect(0, 0, 64, 64);
  context.fillStyle = '#555';
  context.fillRect(64, 64, 64, 64);

  // default-texture
  var defaultTexture = new Texture2D$2();
  defaultTexture._texture = new gfx.Texture2D(device, {
    images: [canvas],
    width: 128,
    height: 128,
    wrapS: gfx.WRAP_REPEAT,
    wrapT: gfx.WRAP_REPEAT,
    format: gfx.TEXTURE_FMT_RGB8,
    mipmap: true,
  });
  defaultTexture._opts.wrapS = gfx.WRAP_REPEAT;
  defaultTexture._opts.wrapT = gfx.WRAP_REPEAT;
  defaultTexture._uuid = 'default-texture';
  defaultTexture._loaded = true;

  // black texture canvas fill
  canvas.width = canvas.height = 2;
  context.fillStyle = '#000';
  context.fillRect(0, 0, 2, 2);

  // black-texture
  var blackTexture = new Texture2D$2();
  blackTexture._texture = new gfx.Texture2D(device, {
    images: [canvas],
    width: 2,
    height: 2,
    wrapS: gfx.WRAP_REPEAT,
    wrapT: gfx.WRAP_REPEAT,
    format: gfx.TEXTURE_FMT_RGB8,
    mipmap: true,
  });
  blackTexture._opts.wrapS = gfx.WRAP_REPEAT;
  blackTexture._opts.wrapT = gfx.WRAP_REPEAT;
  blackTexture._uuid = 'black-texture';
  blackTexture._loaded = true;

  // default-texture-cube
  var defaultTextureCube = new TextureCube$2();
  defaultTextureCube._texture = new gfx.TextureCube(device, {
    width: 128,
    height: 128,
    images: [[canvas, canvas, canvas, canvas, canvas, canvas]]
  });
  defaultTextureCube._uuid = 'default-texture-cube';
  defaultTextureCube._loaded = true;

  // builtin-cube
  var cube = new Mesh();
  cube._subMeshes = new Array(1);
  cube._subMeshes[0] = renderer.createIA(
    device,
    box(1, 1, 1, {
      widthSegments: 1,
      heightSegments: 1,
      lengthSegments: 1,
    })
  );
  cube._uuid = 'builtin-cube';
  cube._loaded = true;

  // builtin-sphere
  var sphere$$1 = new Mesh();
  sphere$$1._subMeshes = new Array(1);
  sphere$$1._subMeshes[0] = renderer.createIA(
    device,
    sphere(0.5, {
      segments: 64,
    })
  );
  sphere$$1._uuid = 'builtin-sphere';
  sphere$$1._loaded = true;

  // builtin-cylinder
  var cylinder$$1 = new Mesh();
  cylinder$$1._subMeshes = new Array(1);
  cylinder$$1._subMeshes[0] = renderer.createIA(
    device,
    cylinder(0.5, 0.5, 2, {
      radialSegments: 20,
      capped: true,
    })
  );
  cylinder$$1._uuid = 'builtin-cylinder';
  cylinder$$1._loaded = true;

  // builtin-plane
  var plane$$1 = new Mesh();
  plane$$1._subMeshes = new Array(1);
  plane$$1._subMeshes[0] = renderer.createIA(
    device,
    plane(10, 10, {
      uSegments: 10,
      vSegments: 10,
    })
  );
  plane$$1._uuid = 'builtin-plane';
  plane$$1._loaded = true;

  return {
    defaultTexture: defaultTexture,
    defaultTextureCube: defaultTextureCube,
    blackTexture: blackTexture,
    cube: cube,
    sphere: sphere$$1,
    cylinder: cylinder$$1,
    plane: plane$$1,
  };
}

function _makeTick(app_) {
  var app = app_;

  return function (timestamp) {
    app._tickID = requestAnimationFrame(app._tick);

    // update timer
    if (timestamp === undefined) {
      timestamp = 0;
    }
    app.deltaTime = (timestamp - app._lasttime) / 1000;
    app.totalTime = timestamp / 1000;
    app._lasttime = timestamp;

    // tick debugger
    app._debugger.tick();

    // emit tick event
    app.emit('tick');

    // tick systems
    app.tick();

    // commit debugger commands
    app._debugger.commit();

    // render the scene
    app._forward.render(app.scene);

    // TODO
    // app.lstats.tick();

    // reset internal states
    app._input.reset();
    app._scene.reset();
  };
}

var App = (function (Engine) {
  function App(canvas, opts) {
    var this$1 = this;
    if ( opts === void 0 ) opts = {};

    Engine.call(this, {
      poolSize: opts.poolSize || 100,
    });
    this.__initEventEmitter();

    // sub-modules (canvas)
    this._canvas = canvas;
    this._input = new Input(canvas, {
      lock: true,
      invertY: true,
    });
    this._device = new gfx.Device(canvas, opts);
    var builtins = _initBuiltins(this._device);

    // sub-modules (renderer)
    renderer.addStage('opaque');
    renderer.addStage('transparent');
    renderer.addStage('2d');
    renderer.addStage('shadowcast');

    this._forward = new ForwardRenderer(this._device, {
      defaultTexture: builtins.defaultTexture._texture,
      defaultTextureCube: builtins.defaultTextureCube._texture,
      programTemplates: templates,
      programChunks: chunks,
    });
    this._scene = new renderer.Scene();

    // sub-modules (engine)
    this._assetMng = new AssetMng(this);
    this._debugger = new Debugger(this);

    // register builtin assets
    for (var name in builtins) {
      var asset = builtins[name];
      this$1._assetMng.add(asset._uuid, asset);
    }

    // register builtin asset loader
    this.registerLoader('mesh', meshLoader);
    this.registerLoader('material', materialLoader);
    this.registerLoader('texture-2d', texture2DLoader);
    this.registerLoader('texture-cube', textureCubeLoader);
    this.registerLoader('prefab', prefabLoader);
    this.registerLoader('gltf', gltfLoader);
    this.registerLoader('animation', animationLoader);
    this.registerLoader('sprite', spriteLoader);
    this.registerLoader('bmfont', bmfontLoader);

    // register builtin components
    this.registerClass('Script', ScriptComponent);
    this.registerClass('Camera', CameraComponent);
    this.registerClass('Light', LightComponent);
    this.registerClass('Model', ModelComponent);
    this.registerClass('SkinningModel', SkinningModelComponent);
    this.registerClass('Animation', AnimationComponent);
    this.registerClass('Skybox', SkyboxComponent);
    this.registerClass('Sprite', SpriteComponent);
    this.registerClass('Label', LabelComponent);
    this.registerClass('Screen', ScreenComponent);
    this.registerClass('Widget', WidgetComponent);

    // register builtin systems
    this.registerSystem('script', ScriptSystem, 'Script', 0);
    this.registerSystem('camera', CameraSystem, 'Camera', 100);
    this.registerSystem('light', LightSystem, 'Light', 100);
    this.registerSystem('model', ModelSystem, 'Model', 100);
    this.registerSystem('skinning-model', SkinningModelSystem, 'SkinningModel', 100);
    this.registerSystem('skybox', SkyboxSystem, 'Skybox', 100);
    this.registerSystem('sprite', SpriteSystem, 'Sprite', 100);
    this.registerSystem('label', LabelSystem, 'Label', 100);
    this.registerSystem('animation', AnimationSystem, 'Animation', 200);
    this.registerSystem('screen', ScreenSystem, 'Screen', 100);
    this.registerSystem('widget', WidgetSystem, 'Widget', 100);

    // life callback
    this._tick = _makeTick(this);

    // public
    this.deltaTime = 0;
    this.totalTime = 0;

    // internal
    this._tickID = null;
    this._lasttime = 0;
    this._activeCamera = null;

    window.addEventListener('resize', function () {
      this$1.resize();
    });
  }

  if ( Engine ) App.__proto__ = Engine;
  App.prototype = Object.create( Engine && Engine.prototype );
  App.prototype.constructor = App;

  var prototypeAccessors = { device: { configurable: true },scene: { configurable: true },assets: { configurable: true },debugger: { configurable: true } };

  prototypeAccessors.device.get = function () {
    return this._device;
  };

  prototypeAccessors.scene.get = function () {
    return this._scene;
  };

  prototypeAccessors.assets.get = function () {
    return this._assetMng;
  };

  prototypeAccessors.debugger.get = function () {
    return this._debugger;
  };

  App.prototype.run = function run () {
    if (!this._activeLevel) {
      console.warn('There is no level to run, please load it first');
      return;
    }

    this._tickID = requestAnimationFrame(this._tick);
  };

  App.prototype.resize = function resize () {
    if (!this._canvas) {
      return;
    }

    var bcr = this._canvas.parentElement.getBoundingClientRect();
    this._canvas.width = bcr.width;
    this._canvas.height = bcr.height;

    this._input.resize();
  };

  App.prototype.destroy = function destroy () {
    this._input.destroy();
    if (this._tickID) {
      cancelAnimationFrame(this._tickID);
    }
  };

  App.prototype.registerLoader = function registerLoader (type, loader) {
    this._assetMng.registerLoader(type, loader);
  };

  Object.defineProperties( App.prototype, prototypeAccessors );

  return App;
}(Engine));

EventEmitter.mixin(App);

function _normalize (url) {
  return url
  .replace(/\\/g, '/')
  .replace(/[\/]+/g, '/')
  .replace(/\/\?/g, '?')
  .replace(/\/\#/g, '#')
  .replace(/\:\//g, '://');
}

var path = {
  /**
   * @method normalize
   * @param {string} url
   */
  normalize: function normalize(url) {
    return _normalize(url);
  },

  /**
   * @method join
   */
  join: function join() {
    var joined = [].slice.call(arguments, 0).join('/');
    return _normalize(joined);
  },
};

var _name2extinfo = {};

var extensions = {
  add: function add(name, info) {
    _name2extinfo[name] = info;
    Object.assign(main, info.modules);
  },

  _init: function _init(app) {
    for (var name in _name2extinfo) {
      var info = _name2extinfo[name];
      info.init(app);
    }
  }
};

// misc
// components
// materials
// assets
// renderer
// deps
var main = Object.assign({
  // misc
  Node: Node,

  // rendering
  SkinningModel: SkinningModel,

  // assets
  Asset: Asset,
  Mesh: Mesh,
  Joints: Joints,
  Material: Material,
  Prefab: Prefab,
  AnimationClip: AnimationClip,
  Gltf: Gltf,
  Texture: Texture$2,
  Texture2D: Texture2D$2,
  TextureCube: TextureCube$2,

  // materials
  PhongMaterial: PhongMaterial,
  SkyboxMaterial: SkyboxMaterial,
  ShaderMaterial: ShaderMaterial,
  UnlitMaterial: UnlitMaterial,
  SpriteMaterial: SpriteMaterial,
  MatcapMaterial: MatcapMaterial,
  PbrMaterial: PbrMaterial,
  GridMaterial: GridMaterial,

  // framework
  App: App,
  Level: Level,
  System: System,
  Component: Component,

  // components
  ScriptComponent: ScriptComponent,
  CameraComponent: CameraComponent,
  LightComponent: LightComponent,
  ModelComponent: ModelComponent,
  SkinningModelComponent: SkinningModelComponent,
  AnimationComponent: AnimationComponent,
  SkyboxComponent: SkyboxComponent,
  SpriteComponent: SpriteComponent,
  LabelComponent: LabelComponent,
  ScreenComponent: ScreenComponent,
  WidgetComponent: WidgetComponent,

  // modules
  math: math,
  memop: memop,
  primitives: primitives,
  renderer: renderer,
  gfx: gfx,

  // misc
  extensions: extensions,
  utils: utils$2,
  resl: resl,
  path: path,
  async: async,
}, enums$2);

module.exports = main;
//# sourceMappingURL=engine-3d.js.map
