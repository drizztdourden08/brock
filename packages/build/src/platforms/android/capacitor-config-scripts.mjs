/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CAPACITOR_CONFIG_FILE, CAPACITOR_SCRIPT_CONFIGS } from './android.constants.mjs';

/**
 * @returns {import('../platform.type.mjs').ScaffoldStep} fails on a capacitor.config.ts or .js
 */
const capacitorConfigScripts = () => ({
  name: `${CAPACITOR_CONFIG_FILE} is the only Capacitor config`,
  phase: 'files',
  run: (ctx) => {
    const found = CAPACITOR_SCRIPT_CONFIGS.filter((file) => existsSync(join(ctx.rootDir, file)));
    if (found.length === 0) return { status: 'skipped', detail: 'no other Capacitor config' };
    return {
      status: 'failed',
      detail: `${found.join(' and ')} sits beside the managed ${CAPACITOR_CONFIG_FILE}, and Capacitor reads it first. Set appId and the name in brock.config.ts (product.appId, product.name), delete ${found.join(' and ')}, and run platform add android again (docs/upgrading-an-app.md, Android).`,
    };
  },
});

export { capacitorConfigScripts };
