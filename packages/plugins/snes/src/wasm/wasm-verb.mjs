/* @layer tooling-scripts @kind logic */
import { wasmStaleReason } from '@drizztdourden08/brock-port-kit/ensure-wasm';
import { checkoutOf } from '../checkout-of.mjs';
import { snesOptions } from '../snes-options.mjs';
import { buildWasm, sdkDir } from './build-wasm.mjs';
import { ensureEmsdk } from './ensure-emsdk.mjs';

const USAGE = '  brock snes wasm build [--force]         build the core when a source is newer than its output';

const build = (options, ctx) => {
  const root = checkoutOf(ctx);
  const wasm = snesOptions('wasm', ctx.workspace);
  const reason = wasmStaleReason(root, wasm);
  if (!reason && options.force !== true) {
    ctx.log('The core is up to date.');
    return 0;
  }
  ctx.log(`${reason ?? 'forced'}: building the core.`);
  if (!process.env.EMSDK) ensureEmsdk({ main: ctx.rootDir, dir: sdkDir(ctx.rootDir, wasm), repo: wasm.emsdkRepo, log: ctx.log });
  buildWasm({ root, main: ctx.rootDir, wasm, log: ctx.log });
  ctx.log('Core built.');
  return 0;
};

const run = async (positional, options, ctx) => {
  const [sub] = positional;
  if (sub === 'build') return build(options, ctx);
  if (sub === 'probe') throw new Error('snes wasm probe is not part of this bundle: no headless harness ships with it.');
  throw new Error(`Unknown wasm verb "${sub ?? ''}".\n${USAGE}`);
};

const wasmVerb = { usage: USAGE, run };

export { wasmVerb };
