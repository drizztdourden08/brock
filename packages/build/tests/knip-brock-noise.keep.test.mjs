/* @layer tooling-scripts @kind test */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { dropBrockKnipNoise } from '../src/knip-brock-noise.mjs';
import { write } from './knip-write-fixture.mjs';

const made = [];

const functionApp = (bundle) => {
  const root = write(mkdtempSync(join(tmpdir(), 'brock-knip-noise-')), {
    'apps/store-api/package.json': { name: 'store-api', scripts: { bundle } },
    'apps/store-api/src/index.ts': 'export const handler = 1;\n',
  });
  made.push(root);
  return root;
};

const entryIssue = (symbol) => ({ type: 'unresolved', workspace: 'apps/store-api', symbol });
const hint = (type, identifier) => ({ type, identifier, workspaceName: 'apps/store' });

afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('K1 brock knip noise from usage entries and esbuild scripts', () => {
  it('K1 keeps every configuration hint, empty usage entries included', { tags: ['critical'] }, () => {
    const keep = [hint('entry-empty', 'src/primitives/**/*.usage.ts'), hint('project-empty', 'src/views/*.ts'), hint('ignoreDependencies', 'zustand')];
    expect(dropBrockKnipNoise({ cwd: '.', issues: {}, counters: {}, configurationHints: keep }).configurationHints).toEqual(keep);
  });

  it('K1 drops the unresolved entry of an esbuild script when the file exists', { tags: ['critical'] }, () => {
    const root = functionApp('esbuild src/index.ts --bundle --platform=node --outfile=dist/index.js');
    const data = { cwd: root, issues: { unresolved: { 'apps/store-api/package.json': { 'src/index.ts': entryIssue('src/index.ts') } } }, counters: { unresolved: 1 } };
    const out = dropBrockKnipNoise(data);
    expect(out.issues.unresolved).toEqual({});
    expect(out.counters.unresolved).toBe(0);
  });

  it('K1 drops the unlisted package knip reads from a bare esbuild entry', { tags: ['critical'] }, () => {
    const root = functionApp('esbuild src/index.ts --bundle');
    const data = { cwd: root, issues: { unlisted: { 'apps/store-api/package.json': { src: { type: 'unlisted', workspace: 'apps/store-api', symbol: 'src' }, left: { type: 'unlisted', workspace: 'apps/store-api', symbol: 'left' } } } }, counters: { unlisted: 2 } };
    const out = dropBrockKnipNoise(data);
    expect(Object.keys(out.issues.unlisted['apps/store-api/package.json'])).toEqual(['left']);
    expect(out.counters.unlisted).toBe(1);
  });

  it('K1 keeps the unresolved entry when the file is missing', { tags: ['critical'] }, () => {
    const root = functionApp('esbuild src/missing.ts --bundle');
    const data = { cwd: root, issues: { unresolved: { 'apps/store-api/package.json': { 'src/missing.ts': entryIssue('src/missing.ts') } } }, counters: { unresolved: 1 } };
    expect(dropBrockKnipNoise(data).counters.unresolved).toBe(1);
  });

  it('K1 keeps an unresolved import in a source file', { tags: ['critical'] }, () => {
    const root = functionApp('esbuild src/index.ts --bundle');
    const data = { cwd: root, issues: { unresolved: { 'apps/store-api/src/index.ts': { 'src/index.ts': entryIssue('src/index.ts') } } }, counters: { unresolved: 1 } };
    expect(dropBrockKnipNoise(data).counters.unresolved).toBe(1);
  });
});
