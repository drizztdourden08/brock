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

const EMSDK_ENV_BAT = 'emsdk_env.bat';

const EMCC_FILES = Object.freeze(['emcc', 'emcc.bat', 'emcc.cmd', 'emcc.exe']);

const SKIP_WITHOUT_SDK_FLAG = '--skip-without-sdk';

export { WASM_DEFAULTS, PACKAGE_KEY, EMSDK_ENV_BAT, EMCC_FILES, SKIP_WITHOUT_SDK_FLAG };
