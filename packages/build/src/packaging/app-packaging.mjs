/* @layer tooling-scripts @kind logic */
import { isAbsolute } from 'node:path';
import { FILE_ASSOCIATION_ROLES, PACKAGING_LABEL } from './packaging.constants.mjs';

/**
 * @typedef {import('../config.mjs').BrockPackagingOptions} BrockPackagingOptions
 * @typedef {import('@drizztdourden08/brock-core/product').ProductInput} ProductInput
 */

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const fail = (message) => {
  throw new Error(`${PACKAGING_LABEL}${message}`);
};

const relativePath = (value, key) => {
  if (typeof value !== 'string' || !value.trim()) fail(`${key} needs a path, relative to the app folder.`);
  if (isAbsolute(value)) fail(`${key} is an absolute path; give it relative to the app folder.`);
  return value.replace(/\\/g, '/');
};

/**
 * @param {BrockPackagingOptions['extraResources']} list
 * @returns {{ from: string, to: string, filter?: string[] }[]} electron-builder extraResources, from the app folder
 */
const appExtraResources = (list = []) => {
  if (!Array.isArray(list)) fail('extraResources is a list of { from, to }.');
  return list.map((entry, at) => {
    if (!isObject(entry)) fail(`extraResources[${at}] is { from, to, filter? }.`);
    const filter = entry.filter === undefined ? {} : { filter: [...entry.filter] };
    return { from: relativePath(entry.from, `extraResources[${at}].from`), to: relativePath(entry.to, `extraResources[${at}].to`), ...filter };
  });
};

/**
 * @param {BrockPackagingOptions['fileAssociations']} options
 * @param {ProductInput['fileAssociations']} associations
 * @returns {Map<string, { role?: string, icon?: string }>} by lower-case extension
 */
const associationOptions = (options = {}, associations = []) => {
  if (!isObject(options)) fail('fileAssociations maps an extension of product.fileAssociations to { role, icon }.');
  const known = new Set(associations.map((fa) => fa.ext.toLowerCase()));
  return new Map(Object.entries(options).map(([ext, entry]) => {
    if (!known.has(ext.toLowerCase())) fail(`fileAssociations.${ext}: product.fileAssociations has no "${ext}" extension.`);
    if (entry.role !== undefined && !FILE_ASSOCIATION_ROLES.includes(entry.role)) fail(`fileAssociations.${ext}.role takes ${FILE_ASSOCIATION_ROLES.join(', ')}.`);
    if (entry.icon !== undefined && (typeof entry.icon !== 'string' || !entry.icon)) fail(`fileAssociations.${ext}.icon is an icon name, as product.fileAssociations takes it.`);
    return [ext.toLowerCase(), entry];
  }));
};

/**
 * @param {ProductInput['fileAssociations']} associations
 * @param {BrockPackagingOptions['fileAssociations']} options
 * @returns {ProductInput['fileAssociations']} each with the app's role and icon
 */
const withAssociationOptions = (associations = [], options = {}) => {
  const byExt = associationOptions(options, associations);
  return associations.map((fa) => {
    const own = byExt.get(fa.ext.toLowerCase()) ?? {};
    return { ...fa, ...(own.icon ? { icon: own.icon } : {}), ...(own.role ? { role: own.role } : {}) };
  });
};

/**
 * @param {BrockPackagingOptions['afterPack']} afterPack
 * @returns {string | null} the app's afterPack module, from the app folder
 */
const appAfterPack = (afterPack) => (afterPack === undefined ? null : relativePath(afterPack, 'afterPack'));

/**
 * @param {BrockPackagingOptions['velopackIcons']} icons
 * @param {string} platform a Node platform
 * @returns {string | null} the app's vpk icon on this platform
 */
const velopackIconOf = (icons = {}, platform) => {
  const key = { win32: 'windows', linux: 'linux' }[platform];
  return key && icons[key] !== undefined ? relativePath(icons[key], `velopackIcons.${key}`) : null;
};

export { appAfterPack, appExtraResources, velopackIconOf, withAssociationOptions };
