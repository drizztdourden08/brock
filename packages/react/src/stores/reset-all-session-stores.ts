/* @layer renderer-shell @kind logic */
import { sessionStores } from './session-stores';

const resetAllSessionStores = (): void => {
  for (const store of sessionStores) store.reset();
};

export { resetAllSessionStores };
