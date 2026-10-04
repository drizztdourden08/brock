/* @layer renderer-shell @kind logic */
import { sessionResetWatch } from './session-reset-watch';
import { sessionStores } from './session-stores';

const resetAllSessionStores = (): void => {
  let filled = 0;
  for (const store of sessionStores) {
    if (store.filled()) filled += 1;
    store.reset();
  }
  if (filled > 0) sessionResetWatch.listener?.(filled);
};

export { resetAllSessionStores };
