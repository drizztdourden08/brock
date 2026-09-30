/* @layer tooling-scripts @kind logic */
import { androidPlatform } from './android/android.platform.mjs';
import { iosPlatform } from './ios/ios.platform.mjs';
import { linuxPlatform } from './linux/linux.platform.mjs';
import { macosPlatform } from './macos/macos.platform.mjs';
import { webPlatform } from './web/web.platform.mjs';
import { windowsPlatform } from './windows/windows.platform.mjs';

/**
 * @returns {import('./platform.type.mjs').Platform[]} every strategy, in canonical order
 */
const allPlatforms = () => [windowsPlatform, macosPlatform, linuxPlatform, androidPlatform, iosPlatform, webPlatform];

export { allPlatforms };
