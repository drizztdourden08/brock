/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { delimiter, isAbsolute, join, relative, resolve } from 'node:path';
import { mainCheckoutOf } from './main-checkout-of.mjs';
import { EMCC_FILES, EMSDK_ENV_BAT } from './wasm.constants.mjs';

const onPath = (env) => (env.PATH ?? env.Path ?? '').split(delimiter).filter(Boolean)
  .some((dir) => EMCC_FILES.some((file) => existsSync(join(dir, file))));

const sdkAt = (dir, platform) => {
  const bat = join(dir, EMSDK_ENV_BAT);
  const emscripten = join(dir, 'upstream', 'emscripten');
  return { dir, activate: platform === 'win32' && existsSync(bat) ? bat : null, emscripten: existsSync(emscripten) ? emscripten : null };
};

const holdsSdk = (sdk) => Boolean(sdk.activate || sdk.emscripten);

const mainCheckoutSdk = (root, emsdkDir, platform) => {
  const checkout = isAbsolute(emsdkDir) ? null : mainCheckoutOf(root);
  return checkout ? sdkAt(resolve(checkout.main, relative(checkout.top, root), emsdkDir), platform) : null;
};

/**
 * @param {string} root
 * @param {import('./index.d.mts').WasmOptions} wasm
 * @param {{ env?: NodeJS.ProcessEnv, platform?: NodeJS.Platform }} [host]
 * @returns {import('./index.d.mts').EmsdkInfo}
 */
const emsdkOf = (root, wasm, { env = process.env, platform = process.platform } = {}) => {
  const own = sdkAt(env.EMSDK ?? resolve(root, wasm.emsdkDir), platform);
  const shared = env.EMSDK || holdsSdk(own) ? null : mainCheckoutSdk(root, wasm.emsdkDir, platform);
  const sdk = shared && holdsSdk(shared) ? shared : own;
  return { ...sdk, mainCheckout: sdk === shared, found: holdsSdk(sdk) || onPath(env) };
};

export { emsdkOf };
