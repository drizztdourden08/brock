/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';

const pinHeadlessRendering = (flags: AutomationFlags, argv?: readonly string[]): void => {
  if (flags.isHeadlessLaunch(argv)) app.disableHardwareAcceleration();
};

export { pinHeadlessRendering };
