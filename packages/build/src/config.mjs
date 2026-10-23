/* @layer tooling-scripts @kind config */

/**
 * @typedef {import('@drizztdourden08/brock-core/product').ProductInput} ProductInput
 */

/**
 * @typedef {'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'web'} BrockPlatform
 * @typedef {BrockPlatform | 'desktop' | 'mobile'} BrockTarget
 * @typedef {object} BrockAppConfig
 * @property {ProductInput} product Identity fields; defaults fill the rest at boot
 * @property {BrockTarget[]} targets Platform ids and bundles this app builds for
 * @property {string[]} modules Brock module ids, in load order
 * @property {{ manifest?: boolean }} [web] manifest false drops the web app manifest
 * @property {{ baselines?: boolean }} [review] baselines true: CI compares captures
 */

/**
 * @typedef {object} BrockToolingConfig
 * @property {{ aliases?: Record<string, string>, nodePolyfills?: boolean | Record<string, unknown>, define?: Record<string, unknown>, optimizeDeps?: { include?: string[], exclude?: string[], entries?: string[], worker?: string[] } }} [build] Vite options
 * @property {{ scripts?: string[], clangFormat?: string[] }} [gate] the app's own gate steps
 * @property {BrockWorkflowOptions} [workflows] which workflows Brock keeps, and app steps
 * @property {{ compilerOptions?: Record<string, unknown> }} [tsconfig] over the managed tsconfig
 * @property {BrockPackagingOptions} [packaging] electron-builder and vpk options
 * @property {Record<string, string>} [helpers] Node scripts: name to entry file
 */

/**
 * @typedef {BrockAppConfig & BrockToolingConfig} BrockConfig
 * @typedef {{ ci?: 'managed' | 'own', release?: 'managed' | 'own', steps?: import('@drizztdourden08/brock-core/module').WorkflowSteps }} BrockWorkflowOptions
 */

/**
 * @typedef {object} BrockPackagingOptions
 * @property {{ from: string, to: string, filter?: string[] }[]} [extraResources] from the app folder
 * @property {string} [afterPack] a module of the app, run after Brock's afterPack
 * @property {Record<string, { role?: 'Editor' | 'Viewer' | 'Shell' | 'None', icon?: string }>} [fileAssociations] by extension
 * @property {{ windows?: string, linux?: string }} [velopackIcons] the vpk pack icon, from the app
 */

const CONFIG_FILE = 'brock.config.ts';

/**
 * @param {BrockConfig} cfg
 * @returns {BrockConfig}
 */
const defineBrockConfig = (cfg) => cfg;

export { defineBrockConfig, CONFIG_FILE };
