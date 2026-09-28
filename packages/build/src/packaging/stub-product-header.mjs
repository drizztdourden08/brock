/* @layer tooling-scripts @kind logic */
import { DEFAULT_ACCENT, HEX_COLOR, STUB_VERSION } from './packaging.constants.mjs';
import { mainExeOf } from './vpk-args.mjs';

/**
 * @param {string} text
 */
const wide = (text) => `L"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

/**
 * @param {string | undefined} accent
 */
const argbOf = (accent) => `0xFF${(accent && HEX_COLOR.test(accent) ? accent : DEFAULT_ACCENT).slice(1).toUpperCase()}`;

/**
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @param {string} manifestUrl
 * @returns {string} the product.h the stub sources include
 */
const stubProductHeader = (product, manifestUrl) => {
  const macros = {
    BROCK_STUB_VERSION: String(STUB_VERSION),
    BROCK_ACCENT: argbOf(product.accent),
    BROCK_PRODUCT: wide(product.name),
    BROCK_PACK_ID: wide(product.id),
    BROCK_BRAND: wide(product.name.toUpperCase()),
    BROCK_MAIN_EXE: wide(mainExeOf(product, 'win32')),
    BROCK_WINDOW_CLASS: wide(`${product.id}-installer`),
    BROCK_USER_AGENT: wide(`${product.id}-installer/${STUB_VERSION}.0`),
    BROCK_TEMP_PREFIX: wide(`${product.id}-installer`),
    BROCK_BLURB: wide(product.description ?? `Installs ${product.name} and keeps it up to date.`),
    BROCK_MANIFEST_URL: wide(manifestUrl),
  };
  const lines = Object.entries(macros).map(([name, value]) => `#define ${name} ${value}`);
  return ['#pragma once', '', ...lines, ''].join('\n');
};

export { stubProductHeader };
