/* @layer tooling-scripts @kind config */
import { resolve } from 'node:path';
import { appTools } from './app-tools.mjs';
import { servedDirs } from './served-dirs.mjs';
import { loadSite } from './site/load-site.mjs';
import { sitePlugin } from './site/site-plugin.mjs';
import { sitePolyfills } from './site/site-polyfills.mjs';
import { siteServer } from './site/site-server.mjs';
import { SITE_OUT_DIR } from './site/site.constants.mjs';
import { sourceDependencies } from './vite-config.mjs';
import { SHARED_SINGLETONS } from './vite.constants.mjs';

const aliasesOf = (siteDir, aliases) => Object.fromEntries(Object.entries(aliases).map(([prefix, dir]) => [prefix, resolve(siteDir, dir)]));

/**
 * @param {string} siteDir the site folder (the one holding brock.site.ts)
 * @param {import('vite').UserConfig} [overrides] merged over the base config
 * @returns {Promise<import('vite').UserConfig>} the single-page app into dist
 */
const defineBrockSiteConfig = async (siteDir, overrides = {}) => {
  const { mergeConfig, workspaceRootOf, react } = await appTools(siteDir);
  const site = await loadSite(siteDir);
  const src = resolve(siteDir, 'src');
  const { port, strictPort, proxy } = await siteServer(siteDir, site);
  const fs = { allow: servedDirs(siteDir, sourceDependencies(siteDir), workspaceRootOf) };
  const base = {
    root: src,
    base: '/',
    publicDir: resolve(siteDir, 'public'),
    envDir: siteDir,
    plugins: [react(), sitePlugin({ siteDir, site: site.site }), ...(await sitePolyfills(siteDir, site.build.nodePolyfills))],
    resolve: { alias: { '@app': src, ...aliasesOf(siteDir, site.build.aliases) }, dedupe: SHARED_SINGLETONS },
    server: { port, strictPort, proxy, fs },
    preview: { port, strictPort, proxy },
    build: { outDir: resolve(siteDir, SITE_OUT_DIR), emptyOutDir: true, rollupOptions: { input: { index: resolve(src, 'index.html') } } },
  };
  return mergeConfig(base, overrides);
};

export { defineBrockSiteConfig };
