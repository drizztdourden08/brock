/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { ensureWasm } from '@drizztdourden08/brock-port-kit/ensure-wasm';

const sdkDir = (main, wasm) => process.env.EMSDK ?? resolve(main, wasm.emsdkDir);

/**
 * @param {{ root: string, main: string, wasm: Record<string, any>, log: (message: string) => void }} request
 * @returns {void}
 */
const buildWasm = ({ root, main, wasm, log }) => {
  const sdk = sdkDir(main, wasm);
  if (!existsSync(join(sdk, 'upstream', 'emscripten'))) {
    throw new Error(`Emscripten SDK not found at "${sdk}". Run "snes wasm build" from the main checkout to install the pinned version, or set EMSDK.`);
  }
  ensureWasm({ root, wasm: { ...wasm, emsdkDir: sdk }, log, force: true });
};

export { buildWasm, sdkDir };
