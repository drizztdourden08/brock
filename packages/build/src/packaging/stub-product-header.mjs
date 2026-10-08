/* @layer tooling-scripts @kind logic */
import { COLOUR_MACROS, LOOK_MACROS } from '../installer/installer.constants.mjs';
import { STUB_VERSION } from './packaging.constants.mjs';
import { mainExeOf } from './vpk-args.mjs';

/**
 * @param {string} text
 */
const wide = (text) => `L"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

/**
 * @param {string} hex  #rrggbb
 */
const argbOf = (hex) => `0xFF${hex.slice(1).toUpperCase()}`;

/**
 * @param {boolean} on
 */
const flagOf = (on) => (on ? '1' : '0');

/**
 * @param {Record<string, string>} names  macro suffix to colour key
 * @param {string} prefix
 * @param {import('../installer/stub-colours.mjs').StubColours} colours
 */
const colourMacros = (names, prefix, colours) =>
  Object.fromEntries(Object.entries(names).map(([name, key]) => [`${prefix}${name}`, argbOf(colours[key])]));

/**
 * @typedef {object} StubHeaderInput
 * @property {import('@drizztdourden08/brock-core/product').ProductConfig} config
 * @property {import('../installer/stub-colours.mjs').StubColours} colours
 * @property {string} manifestUrl
 * @property {string} appVersion  shown by the preview renders
 */

/**
 * @param {StubHeaderInput} input
 * @returns {string} the product.h the stub sources include
 */
const stubProductHeader = ({ config, colours, manifestUrl, appVersion }) => {
  const { installer } = config;
  const macros = {
    BROCK_STUB_VERSION: String(STUB_VERSION),
    BROCK_PREVIEW_VERSION: wide(appVersion),
    BROCK_PRODUCT: wide(config.name),
    BROCK_PACK_ID: wide(config.id),
    BROCK_BRAND: wide(config.name.toUpperCase()),
    BROCK_MAIN_EXE: wide(mainExeOf(config, 'win32')),
    BROCK_WINDOW_CLASS: wide(`${config.id}-installer`),
    BROCK_USER_AGENT: wide(`${config.id}-installer/${STUB_VERSION}.0`),
    BROCK_TEMP_PREFIX: wide(`${config.id}-installer`),
    BROCK_BLURB: wide(config.description ?? `Installs ${config.name} and keeps it up to date.`),
    BROCK_MANIFEST_URL: wide(manifestUrl),
    ...colourMacros(COLOUR_MACROS, 'BROCK_C_', colours),
    ...colourMacros(LOOK_MACROS, 'BROCK_LOOK_', colours),
    BROCK_LOOK_ANGLE: `${Number(colours.angle).toFixed(1)}f`,
    BROCK_INSTALL_FOLDER: wide(installer.folderName),
    BROCK_INSTALL_MACHINE: flagOf(installer.scope === 'machine'),
    BROCK_LAUNCH_AFTER: flagOf(installer.launchAfterInstall),
    BROCK_HAS_LICENCE: flagOf(Boolean(installer.licence)),
    BROCK_REGISTERS_OS: flagOf((config.protocols ?? []).length > 0 || (config.fileAssociations ?? []).length > 0),
  };
  const lines = Object.entries(macros).map(([name, value]) => `#define ${name} ${value}`);
  return ['#pragma once', '', ...lines, ''].join('\n');
};

export { stubProductHeader };
