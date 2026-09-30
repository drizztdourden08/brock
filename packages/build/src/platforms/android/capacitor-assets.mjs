/* @layer tooling-scripts @kind logic */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { copyBrandIcons } from '../../icons/copy-brand-icons.mjs';
import { resolveBin, runInherit } from '../../run.mjs';
import { isInstalled } from '../scaffold/is-installed.mjs';
import { ANDROID_PROJECT_DIR, ASSET_SOURCES, ASSETS_DIR, DEFAULT_ICON_BACKGROUND } from './android.constants.mjs';

const stageAssets = (rootDir) => {
  const missing = ASSET_SOURCES.filter(({ from }) => !existsSync(join(rootDir, from))).map(({ from }) => from);
  if (missing.length) return missing;
  mkdirSync(join(rootDir, ASSETS_DIR), { recursive: true });
  for (const { from, to } of ASSET_SOURCES) copyFileSync(join(rootDir, from), join(rootDir, ASSETS_DIR, to));
  return [];
};

const generateArgs = (background) => [
  'generate', '--android', '--assetPath', ASSETS_DIR, '--androidProject', ANDROID_PROJECT_DIR,
  '--iconBackgroundColor', background, '--splashBackgroundColor', background,
];

/**
 * @returns {import('../platform.type.mjs').ScaffoldStep} Android icons and splash from the brand set
 */
const capacitorAssets = () => ({
  name: 'Android icons (@capacitor/assets)',
  phase: 'tools',
  run: async (ctx) => {
    if (!existsSync(join(ctx.rootDir, ANDROID_PROJECT_DIR))) return { status: 'pending', detail: `needs ${ANDROID_PROJECT_DIR} first` };
    if (!isInstalled(ctx.rootDir, '@capacitor/assets')) return { status: 'pending', detail: '@capacitor/assets is not installed yet' };
    copyBrandIcons(ctx.rootDir, ctx.config);
    const missing = stageAssets(ctx.rootDir);
    if (missing.length) return { status: 'pending', detail: `no brand files at ${missing.join(', ')}; set icons.brand or put them there` };
    const background = ctx.config.product.window?.backgroundColor ?? DEFAULT_ICON_BACKGROUND;
    const bin = resolveBin(ctx.rootDir, '@capacitor/assets', 'capacitor-assets');
    const code = await runInherit(process.execPath, [bin, ...generateArgs(background)], { cwd: ctx.rootDir });
    return code === 0 ? { status: 'done', detail: `icons and splash from ${ASSETS_DIR}` } : { status: 'failed', detail: `capacitor-assets exited ${code}` };
  },
});

export { capacitorAssets };
