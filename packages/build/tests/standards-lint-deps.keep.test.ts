/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const dirs: string[] = [];
const migration = () => selectMigrations(collectMigrations([]), { from: '0.1.2', to: null }).filter((m) => m.file.endsWith('standards-lint-deps.mjs'));

const PACKAGE = {
  name: 'app',
  devDependencies: { '@drizztdourden08/brock-lint-config': '^0.1.2', 'eslint-plugin-react-hooks': '^7.1.1', 'typescript-eslint': '^8.60.1', eslint: '^9.0.0' },
};
const KNIP = { entry: ['src/main.tsx'], ignoreDependencies: ['zustand'] };

const app = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'brock-standards-deps-'));
  dirs.push(root);
  writeFileSync(join(root, 'package.json'), `${JSON.stringify(PACKAGE, null, 2)}\n`);
  writeFileSync(join(root, 'knip.json'), `${JSON.stringify(KNIP, null, 2)}\n`);
  return root;
};

const read = (root: string, file: string): { devDependencies?: Record<string, string>; ignoreDependencies?: string[] } =>
  JSON.parse(readFileSync(join(root, file), 'utf8')) as { devDependencies?: Record<string, string>; ignoreDependencies?: string[] };

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('standards-lint-deps', () => {
  it('drops the lint plugins standards carries and has knip ignore standards, once', async () => {
    const root = app();
    await runMigrations(root, migration());
    expect(read(root, 'package.json').devDependencies).toEqual({ '@drizztdourden08/brock-lint-config': '^0.1.2', eslint: '^9.0.0' });
    expect(read(root, 'knip.json').ignoreDependencies).toEqual(['@drizztdourden08/standards', 'zustand']);
    const again = await runMigrations(root, migration());
    expect(again.applied.flatMap((m) => m.touched)).toEqual([]);
  });
});
