/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';
import { PINNED_CSS, PINNED_SWITCHES } from './review-baselines.constants';
import { wantsBaselines } from './wants-baselines';

const pinReviewRendering = (flags: AutomationFlags): void => {
  if (!wantsBaselines(flags)) return;
  for (const [name, value] of PINNED_SWITCHES) app.commandLine.appendSwitch(name, value);
  app.disableHardwareAcceleration();
  app.on('web-contents-created', (_event, contents) => {
    contents.on('dom-ready', () => { void contents.insertCSS(PINNED_CSS).catch(() => undefined); });
  });
};

export { pinReviewRendering };
