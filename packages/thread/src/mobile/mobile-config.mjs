/* @layer tooling-scripts @kind logic */
import { join, resolve } from 'node:path';

const DEFAULTS = Object.freeze({ syncCommand: ['npx', 'cap', 'sync'], gradleTask: 'assembleDebug' });

const assertCommand = (value, key) => {
  if (!Array.isArray(value) || value.length === 0) throw new Error(`workspace.mobile.${key} must be a non-empty command array, like ["pnpm", "build:web"].`);
  return value;
};

/**
 * @param {string} rootDir
 * @param {import('../workspace/workspace.type.mjs').Workspace & { mobile?: object }} workspace
 * @returns {{ dir: string, androidDir: string, apk: string, webBuild: string[], syncCommand: string[], gradleTask: string, packageId: string }}
 */
const mobileConfig = (rootDir, workspace) => {
  const mobile = workspace.mobile;
  if (!mobile || typeof mobile !== 'object') {
    throw new Error(`This workspace has no mobile app. Add mobile: { dir, webBuild, packageId } to brock.workspace.mjs to use ${workspace.name} mobile push.`);
  }
  if (typeof mobile.dir !== 'string') throw new Error('workspace.mobile.dir must name the Capacitor project folder.');
  if (typeof mobile.packageId !== 'string') throw new Error('workspace.mobile.packageId must be the Android application id.');
  const gradleTask = mobile.gradleTask ?? DEFAULTS.gradleTask;
  const variant = gradleTask.replace(/^assemble/, '').toLowerCase() || 'debug';
  const dir = resolve(rootDir, mobile.dir);
  const androidDir = join(dir, 'android');
  return {
    dir,
    androidDir,
    apk: join(androidDir, 'app', 'build', 'outputs', 'apk', variant, `app-${variant}.apk`),
    webBuild: assertCommand(mobile.webBuild, 'webBuild'),
    syncCommand: assertCommand(mobile.syncCommand ?? DEFAULTS.syncCommand, 'syncCommand'),
    gradleTask,
    packageId: mobile.packageId,
  };
};

export { mobileConfig };
