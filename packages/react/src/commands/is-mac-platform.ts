/* @layer renderer-shell @kind logic */
import { MAC_PLATFORM } from './commands.constants';

const isMacPlatform = (): boolean => typeof navigator !== 'undefined' && MAC_PLATFORM.test(navigator.userAgent);

export { isMacPlatform };
