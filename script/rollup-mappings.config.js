'use strict';

const fsJetpack = require('fs-jetpack');
const resolve = require('@gamedev-js/rollup-plugin-node-resolve');

console.log('rollup mappings...');

let dest = './dist';
let file = 'mappings';
let name = 'mappings';
let sourcemap = true;
let globals = {};

// clear directory
fsJetpack.dir(dest, { empty: true });

module.exports = {
  input: './lib/misc/offline-mappings.js',
  external: [],
  plugins: [
    resolve({
      jsnext: false,
      main: false,
      root: process.cwd()
    }),
  ],
  output: [
    {
      file: `${dest}/${file}.js`,
      format: 'cjs',
      name,
      globals,
      sourcemap,
    },
  ],
};
