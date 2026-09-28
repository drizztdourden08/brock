/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import { wasmStaleReason } from './wasm-stale.mjs';

const sdkDir = (main, wasm) => process.env.EMSDK ?? join(main, wasm.emsdkDir);

const compilerEnv = (sdk) => ({
  ...process.env,
  PATH: [join(sdk, 'upstream', 'emscripten'), sdk, process.env.PATH ?? ''].join(delimiter),
});

/**
 * @param {{ root: string, main: string, wasm: Record<string, any>, log: (message: string) => void }} request
 * @returns {void}
 */
const buildWasm = ({ root, main, wasm, log }) => {
  const sdk = sdkDir(main, wasm);
  if (!existsSync(join(sdk, 'upstream', 'emscripten'))) {
    throw new Error(`Emscripten SDK not found at "${sdk}". Run "snes wasm build" from the main checkout to install the pinned version, or set EMSDK.`);
  }
  const script = join(root, wasm.buildScript);
  if (!existsSync(script)) throw new Error(`No core build script at ${script}.`);
  log(`${root}> node ${wasm.buildScript}`);
  execFileSync(process.execPath, [script], { cwd: root, stdio: 'inherit', env: compilerEnv(sdk) });
  const reason = wasmStaleReason(root, wasm);
  if (reason) throw new Error(`The build finished but ${reason}.`);
};

export { buildWasm, sdkDir };
