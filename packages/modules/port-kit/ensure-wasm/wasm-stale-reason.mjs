/* @layer tooling-scripts @kind logic */
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { collectTimes } from './collect-times.mjs';
import { staleReasonOf } from './stale-reason-of.mjs';

/**
 * @param {string} root the folder the options are relative to
 * @param {import('./index.d.mts').WasmOptions} wasm
 * @returns {string | null} why the core needs a build, or null when current
 */
const wasmStaleReason = (root, wasm) => {
  const script = join(root, wasm.buildScript);
  const sourceTimes = wasm.sourceDirs.flatMap((dir) => collectTimes(join(root, dir), wasm.sourceExtensions, wasm.skipDirs));
  if (existsSync(script)) sourceTimes.push(statSync(script).mtimeMs);
  const outputTimes = collectTimes(join(root, wasm.output), wasm.outputExtensions);
  return staleReasonOf({ outputTimes, sourceTimes });
};

export { wasmStaleReason };
