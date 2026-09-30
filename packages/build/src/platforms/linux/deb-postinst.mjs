/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fillTemplate } from '../../release/fill-template.mjs';
import { APP_HOOK_FILE, DEB_POSTINST_FILE, LINUX_DIR } from './linux.constants.mjs';

const readText = (file) => readFileSync(file, 'utf8').replace(/\r\n/g, '\n').trim();

const moduleRules = (modules) =>
  modules.filter((m) => m.manifest.udevRules).map((m) => readText(join(m.dir, m.manifest.udevRules)));

const appHook = (rootDir) => {
  const file = join(rootDir, APP_HOOK_FILE);
  return existsSync(file) ? `\n${readText(file).replace(/^#!.*\n/, '')}\n` : '';
};

/**
 * @param {import('../platform.type.mjs').PlatformContext} ctx
 * @returns {{ path: string, content: string }[]} none when no module and no app hook asks for one
 */
const debPostinst = (ctx) => {
  const rules = moduleRules(ctx.modules);
  const hook = appHook(ctx.rootDir);
  if (!rules.length && !hook) return [];
  const udev = rules.length ? fillTemplate(LINUX_DIR, 'udev-rules.sh.tmpl', { ID: ctx.config.product.id, RULES: rules.join('\n\n') }) : '';
  return [{ path: DEB_POSTINST_FILE, content: fillTemplate(LINUX_DIR, 'deb-postinst.sh.tmpl', { UDEV: udev, HOOK: hook }) }];
};

export { debPostinst };
