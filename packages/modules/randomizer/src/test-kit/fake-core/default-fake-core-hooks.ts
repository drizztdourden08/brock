/* @layer core @kind logic */
import { SERVER_SLOT } from './fake-core.constants';
import type { FakeCoreHooks } from './fake-core-hooks.type';

const defaultFakeCoreHooks: FakeCoreHooks = {
  isFromServer: (item) => item.player === SERVER_SLOT || item.location < 0,
  deathOf: (cause) => ({ byRoom: false, text: String(cause) }),
};

export { defaultFakeCoreHooks };
