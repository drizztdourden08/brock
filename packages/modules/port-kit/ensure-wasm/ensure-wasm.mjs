/* @layer tooling-scripts @kind logic */
import { emsdkOf } from './emsdk-of.mjs';
import { runWasmBuild } from './run-wasm-build.mjs';
import { wasmStaleReason } from './wasm-stale-reason.mjs';

/**
 * @param {import('./index.d.mts').EnsureWasmRequest} request
 * @returns {'current' | 'built' | 'skipped'}
 */
const ensureWasm = ({ root, wasm, log, force = false, skipWithoutSdk = wasm.skipWithoutSdk === true }) => {
  const reason = wasmStaleReason(root, wasm) ?? (force ? 'forced' : null);
  if (!reason) {
    log('The wasm core is current.');
    return 'current';
  }
  const sdk = emsdkOf(root, wasm);
  if (!sdk.found && skipWithoutSdk) {
    log(`Skipping the wasm core build (${reason}): no Emscripten SDK at ${sdk.dir}, in $EMSDK or on the path.`);
    return 'skipped';
  }
  log(`Building the wasm core: ${reason}${sdk.activate ? `, with ${sdk.activate}` : ''}.`);
  runWasmBuild(root, wasm, sdk);
  const after = wasmStaleReason(root, wasm);
  if (after) throw new Error(`The build finished but ${after}.`);
  log('The wasm core is built.');
  return 'built';
};

export { ensureWasm };
