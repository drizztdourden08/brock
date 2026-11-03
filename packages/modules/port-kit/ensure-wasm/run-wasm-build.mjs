/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { emsdkEnvOf } from './emsdk-env-of.mjs';
import { emsdkOf } from './emsdk-of.mjs';

/**
 * @param {string} root
 * @param {import('./index.d.mts').WasmOptions} wasm
 * @param {import('./index.d.mts').EmsdkInfo} [sdk]
 * @returns {void}
 */
const runWasmBuild = (root, wasm, sdk = emsdkOf(root, wasm)) => {
  const script = join(root, wasm.buildScript);
  if (!existsSync(script)) throw new Error(`No core build script at ${script}.`);
  const env = sdk.emscripten ? emsdkEnvOf(sdk.dir) : process.env;
  const result = spawnSync(process.execPath, [script], { cwd: root, stdio: 'inherit', windowsHide: true, env });
  if (result.status !== 0) throw new Error(`The core build exited with ${result.status ?? result.signal}.`);
};

export { runWasmBuild };
