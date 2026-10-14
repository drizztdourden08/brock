/* @layer tooling-scripts @kind logic */
import { SKIP_WITHOUT_SDK_FLAG, ensureWasm, wasmOptionsOf } from '../ensure-wasm/index.mjs';

const root = process.cwd();
const log = (message) => console.log(`[ensure-wasm] ${message}`);

try {
  const wasm = wasmOptionsOf(root);
  ensureWasm({ root, wasm, log, skipWithoutSdk: process.argv.includes(SKIP_WITHOUT_SDK_FLAG) || wasm.skipWithoutSdk === true });
} catch (error) {
  console.error(`[ensure-wasm] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
