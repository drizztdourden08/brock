/* @layer electron-main @kind logic */
import type { RevealState } from './reveal.type';

const revealState: RevealState = { target: null, watchdog: null, revealed: true };

export { revealState };
