/* @layer electron-main @kind logic */
import { armWatchdog } from './arm-watchdog';
import { resumeAfterWatchdog } from './resume-after-watchdog';

const rendererHeartbeat = (): void => {
  resumeAfterWatchdog();
  armWatchdog();
};

export { rendererHeartbeat };
