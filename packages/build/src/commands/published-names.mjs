/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { loadBrockConfig } from '../load-config.mjs';
import { repoOwnerOf } from '../release/repo-owner.mjs';
import { appDirs } from './app-dirs.mjs';

/**
 * @typedef {{ folder: string, expected: string }} PublishedName a workspace folder and the name its package takes
 */

const slashed = (path) => path.replace(/\\/g, '/');

const folderOf = (path) => slashed(String(path).trim()).replace(/^\.\//, '').replace(/\/+$/, '');

const escaped = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const nameOf = (rootDir, folder) => {
  const file = join(rootDir, folder, 'package.json');
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')).name : undefined;
};

/**
 * @param {string} rootDir the repo root
 * @returns {Promise<PublishedName[]>} each published package and its name
 */
const publishedNames = async (rootDir) => {
  const owner = repoOwnerOf(rootDir);
  if (!owner) return [];
  const names = [];
  for (const appDir of appDirs(rootDir)) {
    const config = await loadBrockConfig(join(rootDir, appDir));
    for (const path of config.workflows?.publish?.packages ?? []) {
      const folder = folderOf(path);
      names.push({ folder, expected: `@${owner}/${config.product.id}-${basename(folder)}` });
    }
  }
  return names;
};

/**
 * @param {string} rootDir
 * @param {string[]} findings what the standards structure check found
 * @param {PublishedName[]} published
 * @returns {string[]} the findings with the publish rule applied
 */
const withPublishedNames = (rootDir, findings, published) => {
  if (!published.length) return findings;
  const appScoped = new RegExp(`^(${published.map(({ folder }) => escaped(folder)).join('|')}): name ".*" is not "`);
  const wrong = published.filter(({ folder, expected }) => existsSync(join(rootDir, folder, 'package.json')) && nameOf(rootDir, folder) !== expected);
  return [
    ...findings.filter((finding) => !appScoped.test(finding)),
    ...wrong.map(({ folder, expected }) => `${folder}: name "${nameOf(rootDir, folder) ?? ''}" is not "${expected}"; a package in workflows.publish is named @<owner>/<app>-<subject>`),
  ];
};

export { publishedNames, withPublishedNames };
