/* @layer tooling-scripts @kind test */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { renderManagedFiles } from '../src/managed/templates.mjs';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';

const OLD_INCLUDE = '"include": ["src", "electron", "tests", ".brock", "brock.config.ts"],';
const NEW_INCLUDE = '"include": ["src", "electron", "tests", ".brock/*.ts", "brock.config.ts"],';

const made = [];

const only = () => selectMigrations(collectMigrations([]), { from: '0.33.0', to: null }).filter((m) => m.file.endsWith('brock-dir-type-checked.mjs'));

const appWith = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-dir-typed-'));
  made.push(root);
  for (const [path, content] of Object.entries({ 'package.json': '{"name":"x"}', ...files })) writeFileSync(join(root, path), content);
  return root;
};

const read = (root, path) => readFileSync(join(root, path), 'utf8');

afterEach(() => {
  made.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

describe('brock-dir-type-checked migration (0.34.0)', () => {
  it('turns a bare .brock include into .brock/*.ts, once', async () => {
    const root = appWith({ 'tsconfig.json': `{\n  ${OLD_INCLUDE}\n  "exclude": [".brock"]\n}\n` });
    const first = await runMigrations(root, only());
    expect(read(root, 'tsconfig.json')).toBe(`{\n  ${NEW_INCLUDE}\n  "exclude": [".brock"]\n}\n`);
    expect(first.applied[0]?.touched).toEqual(['tsconfig.json']);
    const second = await runMigrations(root, only());
    expect(second.applied[0]?.touched).toEqual([]);
    expect(read(root, 'tsconfig.json')).toBe(`{\n  ${NEW_INCLUDE}\n  "exclude": [".brock"]\n}\n`);
  });

  it('covers every tsconfig*.json at the app root and the ./.brock/ spellings', async () => {
    const root = appWith({ 'tsconfig.node.json': '{ "include": ["./.brock/", "electron"] }', 'tsconfig.web.json': '{ "include": ["src"] }' });
    await runMigrations(root, only());
    expect(read(root, 'tsconfig.node.json')).toBe('{ "include": [".brock/*.ts", "electron"] }');
    expect(read(root, 'tsconfig.web.json')).toBe('{ "include": ["src"] }');
  });

  it('matches the tsconfig brock sync writes', () => {
    const tsconfig = renderManagedFiles().find((file) => file.path === 'tsconfig.json');
    expect(tsconfig?.content).toContain(NEW_INCLUDE);
  });
});
