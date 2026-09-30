/* @layer electron-main @kind logic */
import { bootEvents } from './boot-events';
import { bootState } from './boot-state';

const whenRevealed = (): Promise<void> =>
  (bootState.revealed ? Promise.resolve() : new Promise((resolve) => { bootEvents.once('revealed', resolve); }));

export { whenRevealed };
