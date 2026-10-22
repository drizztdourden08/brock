/* @layer electron-main @kind logic */
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';
import { GPU_FLAG } from './headless-rendering.constants';
import { applySoftwareRendering } from './apply-software-rendering';

const pinHeadlessRendering = (flags: AutomationFlags, argv?: readonly string[]): void => {
  if (!flags.isHeadlessLaunch(argv)) return;
  if (flags.hasFlag(GPU_FLAG, argv)) return;
  applySoftwareRendering();
};

export { pinHeadlessRendering };
