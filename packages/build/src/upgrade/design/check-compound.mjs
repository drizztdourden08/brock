/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { bareImports } from './bare-imports.mjs';
import { barrelExports } from './barrel-exports.mjs';
import { pathInside } from './path-inside.mjs';

const posix = (path) => path.replace(/\\/g, '/');

const isBarrel = (target, dir) => target === dir || target === join(dir, 'index') || target === join(dir, 'index.ts');

const dependencyBlockers = (ctx, files) => {
  const listed = { ...ctx.compound.app.pkg.devDependencies, ...ctx.compound.app.pkg.dependencies };
  const deps = [...new Set(files.flatMap((entry) => bareImports(entry.source)))];
  const blockers = deps.filter((dep) => !listed[dep]).map((dep) => `it imports ${dep}, which ${ctx.compound.app.label}/package.json does not list`);
  return { deps: Object.fromEntries(deps.filter((dep) => listed[dep]).map((dep) => [dep, listed[dep]])), blockers };
};

const outgoing = (ctx, files) => {
  const needs = new Set();
  const blockers = [];
  for (const ref of files.flatMap((entry) => entry.refs).filter((found) => !pathInside(found.target, ctx.compound.dir))) {
    const other = ctx.compounds.find((compound) => pathInside(ref.target, compound.dir));
    if (other) needs.add(other);
    else blockers.push(`${ctx.where(ref)} imports ${ref.spec}, outside the compound`);
  }
  return { needs, blockers };
};

const incoming = (ctx) => {
  const rewrites = [];
  const fromCompounds = [];
  const blockers = [];
  const refs = ctx.index.filter((entry) => !pathInside(entry.file, ctx.compound.dir)).flatMap((entry) => entry.refs);
  for (const ref of refs.filter((found) => pathInside(found.target, ctx.compound.dir))) {
    const rewritable = ref.fromImport && isBarrel(ref.target, ctx.compound.dir);
    const owner = ctx.compounds.find((compound) => pathInside(ref.file, compound.dir));
    if (owner) fromCompounds.push({ ref, owner, rewritable });
    else if (rewritable) rewrites.push(ref);
    else blockers.push(`${ctx.where(ref)} imports ${ref.spec} past its index.ts`);
  }
  return { rewrites, fromCompounds, blockers };
};

const barrelOf = (ctx) => {
  const file = join(ctx.compound.dir, 'index.ts');
  const exports = existsSync(file) ? barrelExports(readFileSync(file, 'utf8')) : null;
  const taken = existsSync(join(ctx.designDir, 'src', 'compounds', ctx.compound.name));
  return {
    exports,
    blockers: [
      ...(exports ? [] : ['its index.ts holds more than export { ... } from lines']),
      ...(taken ? [`packages/design/src/compounds/${ctx.compound.name} exists already`] : []),
    ],
  };
};

/**
 * @param {{ compound: { name: string, dir: string, app: { label: string, pkg: Record<string, any> } }, compounds: { dir: string }[], index: { file: string, source: string, refs: any[] }[], designDir: string, repoRoot: string }} input
 * @returns {{ compound: any, deps: Record<string, string>, needs: Set<any>, rewrites: any[], fromCompounds: any[], exports: { values: string[], types: string[] } | null, blockers: string[] }}
 */
const checkCompound = (input) => {
  const ctx = { ...input, where: (ref) => `${posix(relative(input.repoRoot, ref.file))}:${ref.line}` };
  const files = ctx.index.filter((entry) => pathInside(entry.file, ctx.compound.dir));
  const deps = dependencyBlockers(ctx, files);
  const out = outgoing(ctx, files);
  const into = incoming(ctx);
  const barrel = barrelOf(ctx);
  return {
    compound: ctx.compound,
    deps: deps.deps,
    needs: out.needs,
    rewrites: into.rewrites,
    fromCompounds: into.fromCompounds,
    exports: barrel.exports,
    blockers: [...deps.blockers, ...out.blockers, ...into.blockers, ...barrel.blockers],
  };
};

export { checkCompound };
