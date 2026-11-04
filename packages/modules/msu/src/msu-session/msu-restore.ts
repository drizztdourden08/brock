/* @layer core @kind logic */
import type { MsuResumeState } from '../types';
import { msuSessionState } from './msu-session-state';

const msuRestore = (state: MsuResumeState | null): void => {
  msuSessionState.engine?.restore(state);
};

export { msuRestore };
