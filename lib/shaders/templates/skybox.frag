varying vec3 viewDir;

uniform samplerCube cubeMap;

void main(void) {
    gl_FragColor = textureCube(cubeMap, viewDir);
}