/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { jsonFile } from '../provision/json-file.mjs';
import { crossDriveLinks } from './cross-drive-links.mjs';
import { LOCKFILE_ATTRIBUTE, RESOLVE_LINE } from './links.constants.mjs';

const normalized = (line) => line.trim().replace(/\s*=\s*/, '=');

const keyOf = (line) => normalized(line).split(/[\s=]/)[0];

const ensureLine = (file, line) => {
  const lines = (existsSync(file) ? readFileSync(file, 'utf8') : '').replace(/\r\n/g, '\n').split('\n');
  if (lines.some((entry) => normalized(entry) === line)) return;
  const kept = lines.filter((entry) => keyOf(entry) !== keyOf(line)).join('\n').replace(/\n+$/, '');
  writeFileSync(file, `${kept ? `${kept}\n` : ''}${line}\n`, 'utf8');
};

/**
 * @param {string} appDir the folder whose package.json holds the links
 * @param {string} [installRoot] where pnpm installs, the workspace root or appDir
 * @returns {string[]} the packages linked across drives, empty when none
 */
const keepCrossDriveLinks = (appDir, installRoot = appDir) => {
  const names = crossDriveLinks(jsonFile(join(appDir, 'package.json')).read() ?? {}, appDir);
  if (names.length === 0) return names;
  ensureLine(join(installRoot, '.npmrc'), RESOLVE_LINE);
  ensureLine(join(installRoot, '.gitattributes'), LOCKFILE_ATTRIBUTE);
  return names;
};

export { keepCrossDriveLinks };
