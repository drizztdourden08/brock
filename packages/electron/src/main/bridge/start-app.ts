/* @layer electron-main @kind logic */
import { spawn } from 'child_process';
import type { AppLaunch } from './app-launch.type';
import { BRIDGE_RUN_AS_NODE } from './bridge.constants';

const startApp = (launch: AppLaunch): Promise<number> =>
  new Promise((resolve, reject) => {
    const inherited = { ...process.env };
    delete inherited[BRIDGE_RUN_AS_NODE];
    const child = spawn(launch.command, launch.args, { env: { ...inherited, ...launch.env }, detached: true, stdio: 'ignore' });
    child.once('error', reject);
    child.once('spawn', () => {
      child.unref();
      resolve(child.pid ?? 0);
    });
  });

export { startApp };
