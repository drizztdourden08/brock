/* @layer electron-main @kind logic */
import type { ProfileStoreHooks } from '@drizztdourden08/brock-core/storage';

const randomizerMainHooks: ProfileStoreHooks = {
  build: (opts) => (opts.randomizer ? { randomizer: opts.randomizer } : {}),
  patchable: ['randomizer'],
};

export { randomizerMainHooks };
