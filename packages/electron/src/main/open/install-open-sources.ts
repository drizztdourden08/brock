/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { OpenSource } from '@drizztdourden08/brock-core/types';
import type { OpenTargets } from './open.type';
import { focusForOpen } from './focus-for-open';
import { openRequestsOf } from './open-requests-of';
import { openRouter } from './open-router';

const sourceNow = (): OpenSource => (app.isReady() ? 'running' : 'launch');

const listenOnMac = (targets: OpenTargets): void => {
  app.on('open-url', (event, url) => {
    event.preventDefault();
    openRouter.push(openRequestsOf(['', url], targets, { cwd: process.cwd(), source: sourceNow() }));
    focusForOpen();
  });
  app.on('open-file', (event, path) => {
    event.preventDefault();
    openRouter.push(openRequestsOf(['', path], targets, { cwd: process.cwd(), source: sourceNow() }));
    focusForOpen();
  });
};

const installOpenSources = (targets: OpenTargets, lock: boolean): boolean => {
  if (lock && !app.requestSingleInstanceLock()) return false;
  openRouter.push(openRequestsOf(process.argv, targets, { cwd: process.cwd(), source: 'launch' }));
  if (process.platform === 'darwin') listenOnMac(targets);
  if (lock) {
    app.on('second-instance', (_event, argv, cwd) => {
      openRouter.push(openRequestsOf(argv, targets, { cwd, source: 'running' }));
      focusForOpen();
    });
  }
  return true;
};

export { installOpenSources };
