/* @layer electron-main @kind logic */
import { logBoot } from '../bootstrap/boot-timing';
import { dismissSplash } from '../boot/dismiss-splash';
import { backgroundMode } from './background-mode';

const enterBackground = (): void => {
  backgroundMode.active = true;
  dismissSplash();
  logBoot('background launch, no window');
};

export { enterBackground };
