/* @layer tooling-scripts @kind constants */
const WASM_DEFAULTS = Object.freeze({
  sourceDirs: ['core'],
  skipDirs: ['third_party', 'node_modules'],
  sourceExtensions: ['.c', '.h', '.cpp'],
  buildScript: 'core/wasm-build/build.mjs',
  output: 'public/wasm',
  outputExtensions: ['.wasm', '.js'],
  emsdkDir: 'third_party/emsdk',
});

const PACKAGE_KEY = 'portKit';

export { WASM_DEFAULTS, PACKAGE_KEY };
