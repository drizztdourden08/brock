/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { resolveBin, runInherit } from '../../run.mjs';
import { isInstalled } from '../scaffold/is-installed.mjs';
import { runWebVite } from '../web/run-web-vite.mjs';
import { ANDROID_PROJECT_DIR } from './android.constants.mjs';

/**
 * @returns {import('../platform.type.mjs').ScaffoldStep} the web build, then cap add android into mobile/android
 */
const capAddAndroid = () => ({
  name: 'cap add android',
  phase: 'tools',
  run: async (ctx) => {
    if (existsSync(join(ctx.rootDir, ANDROID_PROJECT_DIR))) return { status: 'skipped', detail: `${ANDROID_PROJECT_DIR} already exists` };
    if (!isInstalled(ctx.rootDir, '@capacitor/cli')) return { status: 'pending', detail: '@capacitor/cli is not installed yet: run pnpm install, then platform add android again' };
    const built = await runWebVite(ctx.rootDir, 'build');
    if (built !== 0) return { status: 'failed', detail: `the web build exited ${built}` };
    const cap = resolveBin(ctx.rootDir, '@capacitor/cli', 'cap');
    const code = await runInherit(process.execPath, [cap, 'add', 'android'], { cwd: ctx.rootDir });
    return code === 0 ? { status: 'done', detail: ANDROID_PROJECT_DIR } : { status: 'failed', detail: `cap add android exited ${code}` };
  },
});

export { capAddAndroid };
