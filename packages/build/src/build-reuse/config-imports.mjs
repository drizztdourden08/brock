/* @layer tooling-scripts @kind logic */
import { readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { stampOf } from './file-stamp.mjs';

const RELATIVE_IMPORT = /(?:from\s*|import\s*\(\s*|import\s+)['"](\.{1,2}\/[^'"]+)['"]/g;
const SUFFIXES = ['', '.ts', '.mts', '.tsx', '.js', '.mjs', '/index.ts', '/index.js', '/index.mjs'];
const MAX_FILES = 200;

const fileFor = (importer, spec) => {
  const base = resolve(dirname(importer), spec);
  return SUFFIXES.map((suffix) => `${base}${suffix}`).find((path) => statSync(path, { throwIfNoEntry: false })?.isFile()) ?? null;
};

const importsOf = (file) => {
  try {
    return [...readFileSync(file, 'utf8').matchAll(RELATIVE_IMPORT)].map((match) => fileFor(file, match[1])).filter(Boolean);
  } catch {
    return [];
  }
};

/**
 * @param {string} rootDir the app root
 * @param {string[]} entries config files, relative to the root
 * @returns {Record<string, string | null>} stamps of the config files and their relative imports
 */
const configImportStamps = (rootDir, entries) => {
  const seen = new Set();
  const queue = entries.map((name) => join(rootDir, name));
  while (queue.length > 0 && seen.size < MAX_FILES) {
    const file = queue.shift();
    if (seen.has(file)) continue;
    seen.add(file);
    queue.push(...importsOf(file));
  }
  return Object.fromEntries([...seen].sort().map((file) => [file, stampOf(file)]));
};

export { configImportStamps };
