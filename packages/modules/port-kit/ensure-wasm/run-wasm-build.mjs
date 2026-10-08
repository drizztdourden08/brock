/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { delimiter, join, resolve } from 'node:path';

const withEmsdk = (sdk) => {
  const emscripten = join(sdk, 'upstream', 'emscripten');
  if (!existsSync(emscripten)) return process.env;
  return { ...process.env, EMSDK: sdk, PATH: `${emscripten}${delimiter}${sdk}${delimiter}${process.env.PATH ?? ''}` };
};

/**
 * @param {string} root
 * @param {import('./index.d.mts').WasmOptions} wasm
 * @returns {void}
 */
const runWasmBuild = (root, wasm) => {
  const script = join(root, wasm.buildScript);
  if (!existsSync(script)) throw new Error(`No core build script at ${script}.`);
  const sdk = process.env.EMSDK ?? resolve(root, wasm.emsdkDir);
  const result = spawnSync(process.execPath, [script], { cwd: root, stdio: 'inherit', env: withEmsdk(sdk) });
  if (result.status !== 0) throw new Error(`The core build exited with ${result.status ?? result.signal}.`);
};

export { runWasmBuild };
