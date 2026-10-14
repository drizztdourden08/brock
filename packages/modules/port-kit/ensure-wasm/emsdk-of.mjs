/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { delimiter, join, resolve } from 'node:path';
import { EMCC_FILES, EMSDK_ENV_BAT } from './wasm.constants.mjs';

const onPath = (env) => (env.PATH ?? env.Path ?? '').split(delimiter).filter(Boolean)
  .some((dir) => EMCC_FILES.some((file) => existsSync(join(dir, file))));

/**
 * @param {string} root
 * @param {import('./index.d.mts').WasmOptions} wasm
 * @param {{ env?: NodeJS.ProcessEnv, platform?: NodeJS.Platform }} [host]
 * @returns {import('./index.d.mts').EmsdkInfo}
 */
const emsdkOf = (root, wasm, { env = process.env, platform = process.platform } = {}) => {
  const dir = env.EMSDK ?? resolve(root, wasm.emsdkDir);
  const bat = join(dir, EMSDK_ENV_BAT);
  const activate = platform === 'win32' && existsSync(bat) ? bat : null;
  const emscripten = join(dir, 'upstream', 'emscripten');
  const bundled = existsSync(emscripten) ? emscripten : null;
  return { dir, activate, emscripten: bundled, found: Boolean(activate || bundled) || onPath(env) };
};

export { emsdkOf };
