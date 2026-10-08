/* @layer tooling-scripts @kind logic */
import { androidAppId } from './android-app-id.mjs';
import { ANDROID_PROJECT_DIR, CAPACITOR_CONFIG_FILE, CAPACITOR_WEB_DIR } from './android.constants.mjs';
import { includedPlugins } from './included-plugins.mjs';

/**
 * @param {import('../platform.type.mjs').PlatformContext} ctx
 * @returns {{ path: string, content: string }}
 */
const capacitorConfig = (ctx) => {
  const { product } = ctx.config;
  const included = includedPlugins(ctx.rootDir, ctx.config);
  const android = { path: ANDROID_PROJECT_DIR, allowMixedContent: false, ...(included ? { includePlugins: included } : {}) };
  const config = { appId: androidAppId(product), appName: product.name, webDir: CAPACITOR_WEB_DIR, android };
  return { path: CAPACITOR_CONFIG_FILE, content: `${JSON.stringify(config, null, 2)}\n` };
};

export { capacitorConfig };
