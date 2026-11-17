/* @layer electron-main @kind logic */
import { BOOT_START } from './boot-timing.constants';

const logBoot = (label: string): void => {
  console.log(`[boot] +${Date.now() - BOOT_START}ms ${label}`);
};

export { logBoot };
