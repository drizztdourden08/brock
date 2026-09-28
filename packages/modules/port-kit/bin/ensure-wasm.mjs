/* @layer tooling-scripts @kind logic */
import { ensureWasm, wasmOptionsOf } from '../ensure-wasm/index.mjs';

const root = process.cwd();
const log = (message) => console.log(`[ensure-wasm] ${message}`);

try {
  ensureWasm({ root, wasm: wasmOptionsOf(root), log });
} catch (error) {
  console.error(`[ensure-wasm] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
