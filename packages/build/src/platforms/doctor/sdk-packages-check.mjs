/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ANDROID_SDK_PACKAGES } from './doctor.constants.mjs';
import { sdkRoot } from './sdk-root.mjs';

const packageDir = (root, name) => join(root, ...name.split(';'));

/**
 * @param {import('../platform.type.mjs').DoctorContext} ctx
 * @returns {string[]} Brock's packages plus the modules' ones
 */
const neededPackages = (ctx) => [...new Set([
  ...ANDROID_SDK_PACKAGES,
  ...(ctx.modules ?? []).flatMap((m) => m.manifest.android?.sdkPackages ?? []),
])];

/**
 * @returns {import('../platform.type.mjs').DoctorCheck}
 */
const sdkPackagesCheck = () => ({
  label: 'Android SDK packages',
  run: (ctx) => {
    const root = sdkRoot(ctx.env);
    const needed = neededPackages(ctx);
    const missing = root ? needed.filter((name) => !existsSync(packageDir(root, name))) : needed;
    if (!missing.length) return { status: 'ok', detail: needed.join(', ') };
    const install = `sdkmanager ${missing.map((name) => `"${name}"`).join(' ')}`;
    return { status: 'missing', detail: root ? `missing ${missing.join(', ')}` : 'needs ANDROID_HOME first', install };
  },
});

export { sdkPackagesCheck };
