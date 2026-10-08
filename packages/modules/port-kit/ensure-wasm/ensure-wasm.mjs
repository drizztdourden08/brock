/* @layer tooling-scripts @kind logic */
import { runWasmBuild } from './run-wasm-build.mjs';
import { wasmStaleReason } from './wasm-stale-reason.mjs';

/**
 * @param {import('./index.d.mts').EnsureWasmRequest} request
 * @returns {'current' | 'built'}
 */
const ensureWasm = ({ root, wasm, log, force = false }) => {
  const reason = wasmStaleReason(root, wasm) ?? (force ? 'forced' : null);
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
