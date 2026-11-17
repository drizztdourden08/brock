/* @layer electron-main @kind logic */
import { BOOT_START } from './boot-timing.constants';
import { clockStamp } from '../logs/clock-stamp';

const logBoot = (label: string): void => {
  console.log(`${clockStamp()} [boot] +${Date.now() - BOOT_START}ms ${label}`);
};

export { logBoot };
