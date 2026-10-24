/* @layer electron-main @kind logic */
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import type { AppLaunch } from './app-launch.type';
import { BRIDGE_STRIPPED_ENV } from './bridge.constants';

const startEnv = (extra: Record<string, string>): Record<string, string | undefined> =>
  Object.fromEntries(Object.entries({ ...process.env, ...extra }).filter(([key]) => !BRIDGE_STRIPPED_ENV.includes(key.toUpperCase())));

const startApp = (launch: AppLaunch): Promise<number> =>
  new Promise((resolve, reject) => {
    if (!existsSync(launch.command)) {
      reject(new Error(`The app is not at ${launch.command}; it may have moved or been uninstalled.`));
      return;
    }
    const child = spawn(launch.command, launch.args, { env: startEnv(launch.env), detached: true, stdio: 'ignore' });
    child.once('error', reject);
    child.once('spawn', () => {
      child.unref();
      resolve(child.pid ?? 0);
    });
  });

export { startApp };
