/* @layer tooling-scripts @kind config */
import { DEFAULT_API_PATH, SITE_CONFIG_FILE, SITE_NAME_RULE } from './site.constants.mjs';

/**
 * @typedef {{ url: string } | { portOffset: number }} SiteApiTarget
 */

/**
 * @typedef {object} SiteApi
 * @property {string} path the path the dev server forwards, /api by default
 * @property {SiteApiTarget} target a URL, or a tool port of this checkout's block
 * @property {boolean} changeOrigin
 * @property {boolean} stripPath true drops the path before forwarding
 */

/**
 * @typedef {object} BrockSite
 * @property {{ id: string, name: string, brand: string | null }} site
 * @property {{ offset: number, base: number | null }} ports offset 1 to 9 in the port block
 * @property {SiteApi | null} api
 * @property {{ nodePolyfills: boolean | Record<string, unknown>, aliases: Record<string, string> }} build
 */

const fail = (message) => {
  throw new Error(`${SITE_CONFIG_FILE}: ${message}`);
};

const offsetOf = (value, key) => {
  if (!Number.isInteger(value) || value < 1 || value > 9) fail(`${key} must be a tool port offset, a whole number from 1 to 9.`);
  return value;
};

const targetOf = (api) => {
  if (typeof api.url === 'string' && /^https?:\/\//.test(api.url)) return { url: api.url };
  if (api.portOffset !== undefined) return { portOffset: offsetOf(api.portOffset, 'api.portOffset') };
  return fail('api needs url (http or https) or portOffset.');
};

const apiOf = (api) => {
  if (api === undefined || api === null) return null;
  const shape = typeof api === 'string' ? { url: api } : api;
  const path = shape.path ?? DEFAULT_API_PATH;
  if (typeof path !== 'string' || !path.startsWith('/')) fail('api.path must start with /.');
  return { path, target: targetOf(shape), changeOrigin: shape.changeOrigin === true, stripPath: shape.stripPath === true };
};

const aliasesOf = (aliases = {}) => {
  if (typeof aliases !== 'object' || Object.values(aliases).some((dir) => typeof dir !== 'string')) fail('build.aliases maps an import prefix to a folder, relative to the site.');
  return { ...aliases };
};

const siteOf = (site) => {
  if (!site || typeof site.id !== 'string' || !SITE_NAME_RULE.test(site.id)) fail('site.id must be a lowercase word (letters, digits, dashes).');
  return { id: site.id, name: typeof site.name === 'string' && site.name ? site.name : site.id, brand: typeof site.brand === 'string' ? site.brand : null };
};

/**
 * @param {Record<string, any>} input what brock.site.ts passes
 * @returns {BrockSite}
 */
const defineBrockSite = (input) => {
  const { site, ports = {}, api, build = {} } = input ?? {};
  return {
    site: siteOf(site),
    ports: { offset: offsetOf(ports.offset, 'ports.offset'), base: ports.base ?? null },
    api: apiOf(api),
    build: { nodePolyfills: build.nodePolyfills ?? false, aliases: aliasesOf(build.aliases) },
  };
};

export { defineBrockSite };
