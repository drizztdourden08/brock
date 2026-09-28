/* @layer tooling-scripts @kind logic */
import { runWasmBuild } from './run-wasm-build.mjs';
import { wasmStaleReason } from './wasm-stale-reason.mjs';

/**
 * @param {{ root: string, wasm: import('./index.d.mts').WasmOptions, log: (message: string) => void }} request
 * @returns {'current' | 'built'}
 */
const ensureWasm = ({ root, wasm, log }) => {
  const reason = wasmStaleReason(root, wasm);
  if (!reason) {
    log('The wasm core is current.');
    return 'current';
  }
  log(`Building the wasm core: ${reason}.`);
  runWasmBuild(root, wasm);
  const after = wasmStaleReason(root, wasm);
  if (after) throw new Error(`The build finished but ${after}.`);
  log('The wasm core is built.');
  return 'built';
};

export { ensureWasm };
