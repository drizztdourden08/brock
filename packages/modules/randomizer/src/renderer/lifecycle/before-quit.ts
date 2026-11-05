/* @layer renderer-shell @kind logic */
import type { BeforeQuit } from '@drizztdourden08/brock-react';
import { stopActiveSession } from '../../session/store/stop-active-session';

const stopSessionBeforeQuit: BeforeQuit = () => {
  stopActiveSession();
  return null;
};

export { stopSessionBeforeQuit };
