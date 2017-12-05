#ifdef USE_TEXTURE
  uniform sampler2D mainTexture;
  varying vec2 uv0;
#endif

#ifdef USE_COLOR
  uniform vec4 color;
#endif

void main () {
  vec4 o = vec4(1, 1, 1, 1);

  #ifdef USE_TEXTURE
    o *= texture2D(mainTexture, uv0);
  #endif

  #ifdef USE_COLOR
    o *= color;
  #endif

  gl_FragColor = o;
}