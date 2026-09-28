/* @layer tooling-scripts @kind config */

/**
 * @typedef {import('@drizztdourden08/brock-core/product').ProductInput} ProductInput
 */

/**
 * @typedef {'desktop' | 'android' | 'web'} BrockTarget
 * @typedef {object} BrockConfig
 * @property {ProductInput} product Identity fields; defaults fill the rest at boot
 * @property {BrockTarget[]} targets Platforms this app builds for
 * @property {string[]} modules Brock module ids, in load order
 */

const CONFIG_FILE = 'brock.config.ts';

/**
 * @param {BrockConfig} cfg
 * @returns {BrockConfig}
 */
const defineBrockConfig = (cfg) => cfg;

export { defineBrockConfig, CONFIG_FILE };
