/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { keptByFile, withKeptIssues } from './knip-results.mjs';

const ESBUILD_ENTRY = /\besbuild\s+(?:-\S+\s+)*((?:\.\/)?[^\s.\-/][^\s]*)/g;
const DOT_SLASH = /^\.\//;
const SCRIPT_ISSUE_TYPES = ['unresolved', 'unlisted'];

const scriptsOf = (file) => {
  try {
    return Object.values(JSON.parse(readFileSync(file, 'utf8')).scripts ?? {}).filter((script) => typeof script === 'string');
  } catch {
    return [];
  }
};

const esbuildEntries = (packageFile) => scriptsOf(packageFile).flatMap((script) => [...script.matchAll(ESBUILD_ENTRY)].map((match) => match[1]));

const namesOf = (packageFile) => {
  const dir = dirname(packageFile);
  const present = esbuildEntries(packageFile).filter((entry) => existsSync(join(dir, entry)));
  return new Set(present.flatMap((entry) => {
    const bare = entry.replace(DOT_SLASH, '');
    return [entry, bare, bare.split('/')[0]];
  }));
};

const withoutScriptEntryIssues = (data) =>
  SCRIPT_ISSUE_TYPES.reduce((out, type) => {
    const before = out.issues?.[type];
    if (!before) return out;
    const keepFor = (file) => {
      const names = basename(file) === 'package.json' ? namesOf(join(out.cwd, file)) : new Set();
      return (symbol) => !names.has(symbol);
    };
    return withKeptIssues(out, type, Object.fromEntries(keptByFile(before, keepFor)));
  }, data);

/**
 * @param {{ cwd: string, issues: Record<string, Record<string, Record<string, unknown>>>, counters: Record<string, number> }} data the knip results
 * @returns {object} the results, minus bare esbuild script entries that exist
 */
const dropBrockKnipNoise = (data) => withoutScriptEntryIssues(data);

export { dropBrockKnipNoise };
