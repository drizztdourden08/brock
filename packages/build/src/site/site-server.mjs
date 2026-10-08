/* @layer tooling-scripts @kind logic */
import { resolve } from 'node:path';
import { derivePortBase, portFor, portSlotOf } from '@drizztdourden08/brock-thread/ports';
import { appDirs } from '../commands/app-dirs.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { repoRootOf } from './site-dirs.mjs';

/**
 * @param {string} siteDir
 * @param {import('./define-brock-site.mjs').BrockSite} site
 * @returns {Promise<number>} its own base, the app's, or one from its id
 */
const sitePortBase = async (siteDir, site) => {
  if (site.ports.base !== null) return site.ports.base;
  const repoRoot = repoRootOf(siteDir);
  const [app] = appDirs(repoRoot);
  if (app === undefined) return derivePortBase(site.site.id);
  const { product } = await loadBrockConfig(resolve(repoRoot, app));
  return product.ports?.base ?? derivePortBase(product.id);
};

/**
 * @param {import('./define-brock-site.mjs').SiteApi} api
 * @param {(offset: number) => number} portOf
 * @returns {string}
 */
const apiTargetUrl = (api, portOf) => ('url' in api.target ? api.target.url : `http://localhost:${portOf(api.target.portOffset)}`);

/**
 * @param {import('./define-brock-site.mjs').SiteApi | null} api
 * @param {(offset: number) => number} portOf
 * @returns {Record<string, object>} the Vite proxy table
 */
const siteProxy = (api, portOf) => {
  if (!api) return {};
  const strip = api.stripPath ? { rewrite: (path) => path.slice(api.path.length) || '/' } : {};
  return { [api.path]: { target: apiTargetUrl(api, portOf), changeOrigin: api.changeOrigin, ...strip } };
};

/**
 * @param {string} siteDir
 * @param {import('./define-brock-site.mjs').BrockSite} site
 * @returns {Promise<{ port: number, strictPort: true, proxy: Record<string, object>, base: number, slot: number }>} same slot for the site and its API
 */
const siteServer = async (siteDir, site) => {
  const base = await sitePortBase(siteDir, site);
  const slot = portSlotOf(siteDir);
  const portOf = (offset) => portFor(base, slot, offset);
  return { port: portOf(site.ports.offset), strictPort: true, proxy: siteProxy(site.api, portOf), base, slot };
};

export { siteServer, siteProxy, apiTargetUrl };
