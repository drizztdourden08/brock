/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { delimiter, isAbsolute, join, relative, resolve } from 'node:path';
import { mainCheckoutOf } from './main-checkout-of.mjs';
import { EMCC_FILES } from './wasm.constants.mjs';

const onPath = (env) => (env.PATH ?? env.Path ?? '').split(delimiter).filter(Boolean)
  .some((dir) => EMCC_FILES.some((file) => existsSync(join(dir, file))));

const sdkAt = (dir) => {
  const emscripten = join(dir, 'upstream', 'emscripten');
  return { dir, emscripten: existsSync(emscripten) ? emscripten : null };
};

const holdsSdk = (sdk) => Boolean(sdk.emscripten);

const mainCheckoutSdk = (root, emsdkDir) => {
  const checkout = isAbsolute(emsdkDir) ? null : mainCheckoutOf(root);
  return checkout ? sdkAt(resolve(checkout.main, relative(checkout.top, root), emsdkDir)) : null;
};

/**
 * @param {string} root
 * @param {import('./index.d.mts').WasmOptions} wasm
 * @param {{ env?: NodeJS.ProcessEnv }} [host]
 * @returns {import('./index.d.mts').EmsdkInfo}
 */
const emsdkOf = (root, wasm, { env = process.env } = {}) => {
  const own = sdkAt(env.EMSDK ?? resolve(root, wasm.emsdkDir));
  const shared = env.EMSDK || holdsSdk(own) ? null : mainCheckoutSdk(root, wasm.emsdkDir);
  const sdk = shared && holdsSdk(shared) ? shared : own;
  return { ...sdk, mainCheckout: sdk === shared, found: holdsSdk(sdk) || onPath(env) };
};

export { emsdkOf };
