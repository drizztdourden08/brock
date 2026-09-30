/* @layer tooling-scripts @kind config */

/**
 * @typedef {import('@drizztdourden08/brock-core/product').ProductInput} ProductInput
 */

/**
 * @typedef {'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'web'} BrockPlatform
 * @typedef {BrockPlatform | 'desktop' | 'mobile'} BrockTarget
 * @typedef {object} BrockConfig
 * @property {ProductInput} product Identity fields; defaults fill the rest at boot
 * @property {BrockTarget[]} targets Platform ids and bundles this app builds for
 * @property {string[]} modules Brock module ids, in load order
 * @property {{ manifest?: boolean }} [web] manifest false drops the web app manifest
 */

const CONFIG_FILE = 'brock.config.ts';

/**
 * @param {BrockConfig} cfg
 * @returns {BrockConfig}
 */
const defineBrockConfig = (cfg) => cfg;

export { defineBrockConfig, CONFIG_FILE };
