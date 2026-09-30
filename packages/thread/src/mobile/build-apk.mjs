/* @layer tooling-scripts @kind logic */
import { chmodSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { runStep } from './run-step.mjs';

/**
 * @param {import('./mobile-config.mjs').MobileConfig} config
 * @param {{ log: (message: string) => void }} ctx
 * @param {NodeJS.ProcessEnv} [env] the signing variables for a release
 */
const buildApk = (config, ctx, env = process.env) => {
  ctx.log(`Web build: ${config.webBuild.join(' ')}`);
  runStep(config.webBuild[0], config.webBuild.slice(1), { cwd: config.appDir, shell: true });
  ctx.log(`Capacitor sync: ${config.syncCommand.join(' ')}`);
  runStep(config.syncCommand[0], config.syncCommand.slice(1), { cwd: config.dir, shell: true });
  const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
  const wrapper = join(config.androidDir, gradlew.replace('./', ''));
  if (!existsSync(wrapper)) throw new Error(`${config.androidDir} has no Gradle wrapper. Run cap add android first.`);
  if (process.platform !== 'win32') chmodSync(wrapper, 0o755);
  ctx.log(`Gradle: ${config.gradleTask}`);
  runStep(process.platform === 'win32' ? `"${wrapper}"` : wrapper, [config.gradleTask, '--no-daemon'], { cwd: config.androidDir, shell: true, env });
  if (!existsSync(config.apk)) throw new Error(`Gradle finished but ${config.apk} is missing. An unsigned release lands as app-release-unsigned.apk: check the signing variables.`);
};

export { buildApk };
