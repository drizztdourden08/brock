/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runAdopt } from '../src/commands/adopt.mjs';

const SCHEMA = './node_modules/@drizztdourden08/tessera/tessera.config.schema.json';
const made = [];

const repo = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-adopt-'));
  made.push(root);
  for (const [file, value] of Object.entries(files)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), typeof value === 'string' ? value : JSON.stringify(value));
  }
  return root;
};

const config = (root) => JSON.parse(readFileSync(join(root, 'tessera.config.json'), 'utf8'));

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('brock adopt and tessera.config.json', () => {
  it('writes $schema alone for a single app', async () => {
    const root = repo({ 'package.json': { name: 'solo' } });
    expect(await runAdopt({ rootDir: root })).toBe(0);
    expect(config(root)).toEqual({ $schema: SCHEMA });
  });

  it('sets package and parts for a monorepo with packages/design', async () => {
    const root = repo({
      'package.json': { name: 'acme' },
      'pnpm-workspace.yaml': "packages:\n  - 'apps/*'\n  - 'packages/*'\n",
      'packages/design/package.json': { name: '@acme/design' },
      'apps/desktop/package.json': { name: '@acme/desktop' },
      'apps/desktop/brock.config.ts': 'export default {};\n',
    });
    await runAdopt({ rootDir: root });
    expect(config(root)).toEqual({
      $schema: SCHEMA,
      package: '@acme/design',
      parts: { primitives: 'packages/design/src/primitives', composites: 'packages/design/src/composites', compounds: 'packages/design/src/compounds' },
      stories: 'packages/design/stories',
      apps: { 'apps/desktop': { parts: { views: 'apps/desktop/src/views' } } },
    });
  });

  it('keeps each app\'s views in its own src for a monorepo with no design package yet', async () => {
    const root = repo({
      'package.json': { name: 'acme' },
      'pnpm-workspace.yaml': "packages:\n  - 'apps/*'\n",
      'apps/desktop/package.json': { name: '@acme/desktop' },
      'apps/desktop/brock.config.ts': 'export default {};\n',
    });
    await runAdopt({ rootDir: root });
    expect(config(root)).toEqual({ $schema: SCHEMA, apps: { 'apps/desktop': { parts: { views: 'apps/desktop/src/views' } } } });
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('shared Tessera parts go in a packages/design package'));
  });

  it('keeps a tessera.config.json that exists, even with --force', async () => {
    const root = repo({ 'package.json': { name: 'solo' }, 'tessera.config.json': '{ "theme": { "css": "styles/look.css" } }\n' });
    await runAdopt({ rootDir: root, force: true });
    expect(config(root)).toEqual({ theme: { css: 'styles/look.css' } });
  });
});

describe('brock adopt and the Tessera schema path', () => {
  it('points $schema into the package that installs Tessera when the root does not', async () => {
    const root = repo({
      'package.json': { name: 'acme' },
      'pnpm-workspace.yaml': "packages:\n  - 'apps/*'\n  - 'packages/*'\n",
      'packages/design/package.json': { name: '@acme/design' },
      'packages/design/node_modules/@drizztdourden08/tessera/tessera.config.schema.json': '{}',
      'apps/desktop/package.json': { name: '@acme/desktop' },
      'apps/desktop/brock.config.ts': 'export default {};\n',
    });
    await runAdopt({ rootDir: root });
    expect(config(root).$schema).toBe('./packages/design/node_modules/@drizztdourden08/tessera/tessera.config.schema.json');
  });

  it('finds Tessera in an app package too, and prefers the root install', async () => {
    const files = {
      'package.json': { name: 'acme' },
      'pnpm-workspace.yaml': "packages:\n  - 'apps/*'\n",
      'apps/desktop/package.json': { name: '@acme/desktop' },
      'apps/desktop/brock.config.ts': 'export default {};\n',
      'apps/desktop/node_modules/@drizztdourden08/tessera/tessera.config.schema.json': '{}',
    };
    const inApp = repo(files);
    await runAdopt({ rootDir: inApp });
    expect(config(inApp).$schema).toBe('./apps/desktop/node_modules/@drizztdourden08/tessera/tessera.config.schema.json');
    const atRoot = repo({ ...files, 'node_modules/@drizztdourden08/tessera/tessera.config.schema.json': '{}' });
    await runAdopt({ rootDir: atRoot });
    expect(config(atRoot).$schema).toBe(SCHEMA);
  });
});
