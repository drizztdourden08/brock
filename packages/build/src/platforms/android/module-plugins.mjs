/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { resolveBin, runInherit } from '../../run.mjs';
import { isInstalled } from '../scaffold/is-installed.mjs';
import { ANDROID_PROJECT_DIR, CAPACITOR_SETTINGS_FILE } from './android.constants.mjs';
import { androidModules } from './android-modules.mjs';

const isWired = (rootDir, wanted) => {
  const file = join(rootDir, CAPACITOR_SETTINGS_FILE);
  const settings = existsSync(file) ? readFileSync(file, 'utf8') : '';
  return wanted.every((m) => settings.includes(`include ':${m.project}'`));
};

/**
 * @returns {import('../platform.type.mjs').ScaffoldStep} cap update android for unwired modules
 */
const modulePlugins = () => ({
  name: 'module Android sides in Gradle',
  phase: 'tools',
  run: async (ctx) => {
    const wanted = androidModules(ctx.modules);
    if (!wanted.length) return { status: 'skipped', detail: 'no module in modules ships an Android side' };
    if (!existsSync(join(ctx.rootDir, ANDROID_PROJECT_DIR))) return { status: 'pending', detail: `needs ${ANDROID_PROJECT_DIR} (cap add android) first` };
    const ids = wanted.map((m) => m.id).join(', ');
    if (isWired(ctx.rootDir, wanted)) return { status: 'skipped', detail: `${ids} already wired` };
    if (!isInstalled(ctx.rootDir, '@capacitor/cli')) return { status: 'pending', detail: '@capacitor/cli is not installed yet' };
    const cap = resolveBin(ctx.rootDir, '@capacitor/cli', 'cap');
    const code = await runInherit(process.execPath, [cap, 'update', 'android'], { cwd: ctx.rootDir });
    return code === 0 ? { status: 'done', detail: `${ids} wired into ${ANDROID_PROJECT_DIR}` } : { status: 'failed', detail: `cap update android exited ${code}` };
  },
});

export { modulePlugins };
