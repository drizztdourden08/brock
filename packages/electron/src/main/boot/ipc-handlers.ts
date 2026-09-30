/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { logBoot } from '../bootstrap/boot-timing';
import { armWatchdog } from './arm-watchdog';
import { bootEvents } from './boot-events';
import { bootState } from './boot-state';
import { relayProgress } from './relay-progress';
import { reportBootFailure } from './report-boot-failure';
import { tryReveal } from './try-reveal';

const bootHandlers: HandlerGroup = {
  id: 'boot',
  register: ({ on }) => {
    on('boot:progress', (_event, progress) => {
      bootState.renderer = progress;
      bootState.lastSide = 'renderer';
      armWatchdog();
      relayProgress();
      bootEvents.emit('progress', 'renderer');
    });
    on('boot:failed', (_event, failure) => reportBootFailure({ ...failure, side: 'renderer' }));
    on('boot:ready', () => {
      bootState.rendererReady = true;
      armWatchdog();
      logBoot('renderer boot ready');
      tryReveal();
    });
  },
};

export { bootHandlers };
