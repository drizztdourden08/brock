/* @layer tooling-scripts @kind logic */
import { join, resolve } from 'node:path';
import { MOBILE_DEFAULTS, RELEASE_TASK } from './mobile.constants.mjs';
import { mobileSettings } from './mobile-settings.mjs';

const assertCommand = (value, key) => {
  if (!Array.isArray(value) || value.length === 0) throw new Error(`workspace.mobile.${key} must be a non-empty command array, like ["pnpm", "build:web"].`);
  return value;
};

/**
 * @typedef {object} MobileConfig
 * @property {string} appDir where the web build runs
 * @property {string} dir the Capacitor project folder
 * @property {string} androidDir
 * @property {string} apk
 * @property {string[]} webBuild
 * @property {string[]} syncCommand
 * @property {string} gradleTask
 * @property {string} packageId
 */

/**
 * @param {string} rootDir
 * @param {import('../workspace/workspace.type.mjs').Workspace & { mobile?: object }} workspace
 * @param {{ release?: boolean }} [opts]
 * @returns {MobileConfig}
 */
const mobileConfig = (rootDir, workspace, { release = false } = {}) => {
  const { base, mobile } = mobileSettings(rootDir, workspace);
  if (typeof mobile.dir !== 'string') throw new Error('workspace.mobile.dir must name the Capacitor project folder.');
  if (typeof mobile.packageId !== 'string') throw new Error('workspace.mobile.packageId must be the Android application id.');
  const gradleTask = release ? RELEASE_TASK : (mobile.gradleTask ?? MOBILE_DEFAULTS.gradleTask);
  const variant = gradleTask.replace(/^assemble/, '').toLowerCase() || 'debug';
  const dir = resolve(base, mobile.dir);
  const androidDir = resolve(dir, typeof mobile.androidPath === 'string' ? mobile.androidPath : 'android');
  return {
    appDir: base,
    dir,
    androidDir,
    apk: join(androidDir, 'app', 'build', 'outputs', 'apk', variant, `app-${variant}.apk`),
    webBuild: assertCommand(mobile.webBuild, 'webBuild'),
    syncCommand: assertCommand(mobile.syncCommand ?? MOBILE_DEFAULTS.syncCommand, 'syncCommand'),
    gradleTask,
    packageId: mobile.packageId,
  };
};

export { mobileConfig };
