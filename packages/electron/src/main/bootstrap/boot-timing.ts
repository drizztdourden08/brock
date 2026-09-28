/* @layer electron-main @kind logic */
import { BOOT_START } from './boot-timing.constants';

const enabled = process.argv.includes('--boot-timing');

const logBoot = (label: string): void => {
  if (enabled) console.log(`[boot-timing] ${label}: +${Date.now() - BOOT_START}ms`);
};

export { logBoot };
