/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const ESBUILD_ENTRY = /\besbuild\s+(?:-\S+\s+)*([^\s.\-/][^\s]*)/g;
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
  return new Set(present.flatMap((entry) => [entry, entry.split('/')[0]]));
};

const keptSymbols = (cwd, byFile) =>
  Object.entries(byFile).map(([file, issues]) => {
    const names = basename(file) === 'package.json' ? namesOf(join(cwd, file)) : new Set();
    return [file, Object.fromEntries(Object.entries(issues).filter(([symbol]) => !names.has(symbol)))];
  }).filter(([, issues]) => Object.keys(issues).length > 0);

const countOf = (byFile) => Object.values(byFile).reduce((total, issues) => total + Object.keys(issues).length, 0);

const withoutScriptEntryIssues = (data) =>
  SCRIPT_ISSUE_TYPES.reduce((out, type) => {
    const before = out.issues?.[type];
    if (!before) return out;
    const after = Object.fromEntries(keptSymbols(out.cwd, before));
    const dropped = countOf(before) - countOf(after);
    return { ...out, issues: { ...out.issues, [type]: after }, counters: { ...out.counters, [type]: (out.counters?.[type] ?? 0) - dropped } };
  }, data);

/**
 * @param {{ cwd: string, issues: Record<string, Record<string, Record<string, unknown>>>, counters: Record<string, number> }} data the knip results
 * @returns {object} the results, minus bare esbuild script entries that exist
 */
const dropBrockKnipNoise = (data) => withoutScriptEntryIssues(data);

export { dropBrockKnipNoise };
