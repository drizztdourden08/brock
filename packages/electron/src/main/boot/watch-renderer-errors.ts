/* @layer electron-main @kind logic */
import type { WebContents } from 'electron';
import { bootState } from './boot-state';
import { INTERFACE_TASK } from './reveal.constants';
import { loadErrorOf } from './load-error-of';
import { reportBootFailure } from './report-boot-failure';

const watchRendererErrors = (webContents: WebContents): void => {
  webContents.on('console-message', (event) => {
    if (event.level !== 'error' || bootState.rendererReady || bootState.revealed) return;
    const error = loadErrorOf(event.message);
    if (error === null) return;
    reportBootFailure({ ...INTERFACE_TASK, side: 'renderer', message: `The interface failed to load: ${error}`, timedOut: false });
  });
};

export { watchRendererErrors };
