/* @layer electron-main @kind logic */
import { armWatchdog } from './arm-watchdog';
import { bootEvents } from './boot-events';
import { resumeAfterWatchdog } from './resume-after-watchdog';

const rendererHeartbeat = (): void => {
  bootEvents.emit('activity');
  resumeAfterWatchdog();
  armWatchdog();
};

export { rendererHeartbeat };
