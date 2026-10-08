/* @layer tooling-scripts @kind logic */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_TEMPLATE_DIR } from './site.constants.mjs';

const TEMPLATE_ROOT = fileURLToPath(SITE_TEMPLATE_DIR);

const templateFiles = (dir = TEMPLATE_ROOT) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const path = join(dir, entry.name);
  return entry.isDirectory() ? templateFiles(path) : [path];
});

const fill = (text, values) => Object.entries(values).reduce((out, [key, value]) => out.replaceAll(`__${key}__`, value), text.replace(/\r\n/g, '\n'));

/**
 * @param {string} siteRoot the new site folder
 * @param {Record<string, string>} values each __KEY__ becomes its value
 * @returns {string[]} the files written, from the site folder
 */
const writeSiteTemplate = (siteRoot, values) => templateFiles().map((file) => {
  const target = relative(TEMPLATE_ROOT, file).replace(/\.tmpl$/, '');
  mkdirSync(dirname(join(siteRoot, target)), { recursive: true });
  writeFileSync(join(siteRoot, target), fill(readFileSync(file, 'utf8'), values), 'utf8');
  return target.replace(/\\/g, '/');
});

export { writeSiteTemplate };
