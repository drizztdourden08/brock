/* @layer tooling-scripts @kind logic */
import { satisfiesRange } from '../freshness/satisfies-range.mjs';
import { tesseraMismatch } from '../freshness/tessera-mismatch.mjs';
import { brockPinOf } from '../upgrade/brock-pin-of.mjs';
import { declaredSpecs, readAppPackage } from './app-package.mjs';
import { catalogRange } from './catalog-range.mjs';
import { readInstalled } from './installed-package.mjs';
import { linkSpecs } from './link-specs.mjs';

const FAMILY = /^@drizztdourden08\/(brock-|tessera)/;
const BROCK = /^@drizztdourden08\/brock-/;
const NOT_A_RANGE = /^(link|file|workspace|npm|git|http|https):/;

/** @param {string} a @param {string} b */
const byVersion = (a, b) => {
  const [x, y] = [a, b].map((text) => text.split('-')[0].split('.').map(Number));
  return (x[0] - y[0]) || (x[1] - y[1]) || (x[2] - y[2]);
};

/** @param {string} rootDir @param {string} name @param {string} spec */
const rangeOf = (rootDir, name, spec) => (spec.startsWith('catalog:') ? catalogRange(rootDir, spec, name) : spec);

/** @param {string} name @param {string} range */
const fixFor = (name, range) => `Fix: pnpm install. If it stays, pnpm up "${name}@${range}".`;

/**
 * @param {string} rootDir @param {Record<string, string>} specs @param {Set<string>} linked
 * @returns {{ problems: string[], installed: Map<string, string> }}
 */
const rangeProblems = (rootDir, specs, linked) => {
  const problems = [];
  const installed = new Map();
  for (const [name, spec] of Object.entries(specs).filter(([name]) => FAMILY.test(name) && !linked.has(name))) {
    const range = NOT_A_RANGE.test(spec) ? null : rangeOf(rootDir, name, spec);
    const have = readInstalled(rootDir, name)?.version;
    if (have) installed.set(name, have);
    if (!range) continue;
    if (!have) problems.push(`${name} is declared as ${range} but is not installed. Fix: pnpm install.`);
    else if (!satisfiesRange(have, range)) problems.push(`${name} ${have} is installed but package.json wants ${range}. ${fixFor(name, range)}`);
  }
  return { problems, installed };
};

/**
 * @param {string} rootDir @param {Map<string, string>} installed
 * @returns {string[]} the brock-* packages off the release line
 */
const lineProblems = (rootDir, installed) => {
  const brock = [...installed].filter(([name]) => BROCK.test(name));
  const versions = [...new Set(brock.map(([, version]) => version))];
  if (versions.length < 2) return [];
  const line = brockPinOf(rootDir) ?? versions.sort(byVersion).at(-1);
  return brock
    .filter(([, version]) => version !== line)
    .map(([name, version]) => `${name} ${version} is off the release line ${line} of the other brock packages. Fix: pnpm up "${name}@${line}".`);
};

/** @type {{ label: string, run: (ctx: { rootDir: string }) => { problems: string[], detail: string } }} */
const versionsCheck = {
  label: 'Versions',
  run: ({ rootDir }) => {
    const pkg = readAppPackage(rootDir);
    if (!pkg) return { problems: [], detail: 'no package.json, nothing to check' };
    const linked = new Set(linkSpecs(rootDir).map((link) => link.name));
    const { problems, installed } = rangeProblems(rootDir, declaredSpecs(pkg), linked);
    const tessera = tesseraMismatch(rootDir);
    const all = [...problems, ...lineProblems(rootDir, installed), ...(tessera ? [tessera.line] : [])];
    return { problems: all, detail: 'every Brock and Tessera package fits its range and the brock packages share one release line' };
  },
};

export { versionsCheck };
