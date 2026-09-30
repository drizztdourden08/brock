/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ANDROID_SDK_PACKAGES } from './doctor.constants.mjs';
import { sdkRoot } from './sdk-root.mjs';

const packageDir = (root, name) => join(root, ...name.split(';'));

/**
 * @returns {import('../platform.type.mjs').DoctorCheck}
 */
const sdkPackagesCheck = () => ({
  label: 'Android SDK packages',
  run: (ctx) => {
    const root = sdkRoot(ctx.env);
    const missing = root ? ANDROID_SDK_PACKAGES.filter((name) => !existsSync(packageDir(root, name))) : ANDROID_SDK_PACKAGES;
    if (!missing.length) return { status: 'ok', detail: ANDROID_SDK_PACKAGES.join(', ') };
    const install = `sdkmanager ${missing.map((name) => `"${name}"`).join(' ')}`;
    return { status: 'missing', detail: root ? `missing ${missing.join(', ')}` : 'needs ANDROID_HOME first', install };
  },
});

export { sdkPackagesCheck };
