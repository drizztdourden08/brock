/* @layer tooling-scripts @kind logic */
import { existsSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { CHANNEL_BY_PLATFORM } from './packaging.constants.mjs';

/**
 * @typedef {object} PackNaming
 * @property {string} id the Velopack pack id
 * @property {string} prefix the artifact prefix
 * @property {string} platform
 * @property {string | null} channel
 * @property {boolean} full
 */

/**
 * @param {PackNaming} naming
 * @returns {{ from: string[], to: string, required: boolean }[]}
 */
const plannedNames = ({ id, prefix, platform, channel, full }) => {
  const label = channel ?? CHANNEL_BY_PLATFORM[platform] ?? platform;
  if (platform === 'linux') {
    return [{ from: [`${id}-${label}.AppImage`, `${id}.AppImage`], to: `${prefix}${label}.AppImage`, required: true }];
  }
  if (platform !== 'win32') return [];
  return [
    { from: [`${id}-${label}-Setup.exe`], to: `${prefix}${label}-setup.exe`, required: true },
    { from: [`${id}-${label}-Portable.zip`], to: `${prefix}${label}-portable.zip`, required: full },
  ];
};

/**
 * @param {string} outDir
 * @param {PackNaming} naming
 * @returns {string[]} the downloads, by their release names
 */
const namePackOutputs = (outDir, naming) => {
  const named = [];
  const missing = [];
  for (const { from, to, required } of plannedNames(naming)) {
    const source = from.map((name) => join(outDir, name)).find((path) => existsSync(path));
    if (source && required) renameSync(source, join(outDir, to));
    if (source && !required) rmSync(source);
    if (required) (source ? named : missing).push(to);
  }
  if (missing.length) throw new Error(`vpk packed, but ${missing.join(', ')} is missing from ${outDir}; the vpk file naming may have changed`);
  return named;
};

export { namePackOutputs };
