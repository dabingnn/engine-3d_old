#ifdef useTexture
  uniform sampler2D mainTexture;
  varying vec2 uv0;
#endif

#ifdef useColor
  uniform vec4 color;
#endif

void main () {
  vec4 o = vec4(1, 1, 1, 1);

  #ifdef useTexture
    o *= texture2D(mainTexture, uv0);
  #endif

  #ifdef useColor
    o *= color;
  #endif

  gl_FragColor = o;
}