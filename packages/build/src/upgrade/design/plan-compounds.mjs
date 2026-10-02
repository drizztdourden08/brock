/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkCompound } from './check-compound.mjs';
import { barrelExports } from './barrel-exports.mjs';
import { COMPOUNDS } from './design.constants.mjs';
import { fileReferences } from './file-references.mjs';
import { pathInside } from './path-inside.mjs';
import { repoFiles } from './repo-files.mjs';

const readIndex = (repoRoot, apps) => repoFiles(repoRoot).map((file) => {
  const source = readFileSync(file, 'utf8');
  const app = apps.find((candidate) => pathInside(file, candidate.dir));
  return { file, source, refs: fileReferences(file, source, app ? app.src : null) };
});

const compoundsOf = (apps) => apps.flatMap((app) => {
  const dir = join(app.src, COMPOUNDS);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => ({ name: entry.name, dir: join(dir, entry.name), app }));
});

const designNames = (designDir) => {
  const file = join(designDir, 'src', 'index.ts');
  const found = existsSync(file) ? barrelExports(readFileSync(file, 'utf8').replace('export {};', '')) : null;
  return new Set([...(found?.values ?? []), ...(found?.types ?? [])]);
};

const blockClashes = (checks, taken) => {
  for (const check of checks.filter((entry) => entry.blockers.length === 0)) {
    const names = [...check.exports.values, ...check.exports.types];
    const clash = names.filter((name) => taken.has(name));
    if (clash.length) check.blockers.push(`packages/design/src/index.ts exports ${clash.join(', ')} already`);
    else for (const name of names) taken.add(name);
  }
};

const stayReason = (check, moving) => {
  const staying = [...check.needs].find((compound) => ![...moving].some((other) => other.compound === compound));
  if (staying) return `it imports ${staying.name}, which stays in the app`;
  const deep = check.fromCompounds.find((entry) => !entry.rewritable && ![...moving].some((other) => other.compound === entry.owner));
  return deep ? `${deep.owner.name}, which stays, imports ${deep.ref.spec} past its index.ts` : null;
};

const settle = (checks) => {
  const moving = new Set(checks.filter((check) => check.blockers.length === 0));
  for (let changed = true; changed;) {
    changed = false;
    for (const check of moving) {
      const reason = stayReason(check, moving);
      if (!reason) continue;
      check.blockers.push(reason);
      moving.delete(check);
      changed = true;
    }
  }
  return moving;
};

const finalRewrites = (check, moving) => [
  ...check.rewrites,
  ...check.fromCompounds.filter((entry) => entry.rewritable && ![...moving].some((other) => other.compound === entry.owner)).map((entry) => entry.ref),
];

/**
 * @param {{ repoRoot: string, designDir: string, apps: { dir: string, src: string, label: string, pkg: Record<string, any> }[] }} input
 * @returns {{ moves: { compound: { name: string, dir: string }, deps: Record<string, string>, rewrites: any[], exports: { values: string[], types: string[] } }[], staying: { compound: { name: string, dir: string, app: { label: string } }, blockers: string[] }[] }}
 */
const planCompounds = ({ repoRoot, designDir, apps }) => {
  const index = readIndex(repoRoot, apps);
  const compounds = compoundsOf(apps);
  const checks = compounds.map((compound) => checkCompound({ compound, compounds, index, designDir, repoRoot }));
  blockClashes(checks, designNames(designDir));
  const moving = settle(checks);
  return {
    moves: [...moving].map((check) => ({ ...check, rewrites: finalRewrites(check, moving) })),
    staying: checks.filter((check) => !moving.has(check)),
  };
};

export { planCompounds };
