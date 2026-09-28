/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PACKAGE_KEY, WASM_DEFAULTS } from './wasm.constants.mjs';

/**
 * @param {string} root the folder holding the app's package.json
 * @returns {import('./index.d.mts').WasmOptions} defaults merged with package.json portKit.wasm
 */
const wasmOptionsOf = (root) => {
  const file = join(root, 'package.json');
  const pkg = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
  return { ...WASM_DEFAULTS, ...(pkg[PACKAGE_KEY]?.wasm ?? {}) };
};

export { wasmOptionsOf };
