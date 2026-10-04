/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';

const dirs: string[] = [];

const only = (id: string) => selectMigrations(collectMigrations([]), { from: '0.17.0', to: null }).filter((m) => m.file.endsWith(`${id}.mjs`));

const appWith = (files: Record<string, string>): string => {
  const root = mkdtempSync(join(tmpdir(), 'brock-migrate-18-'));
  dirs.push(root);
  for (const [path, content] of Object.entries({ 'package.json': '{"name":"x"}', ...files })) {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
};

const read = (root: string, path: string) => readFileSync(join(root, path), 'utf8');

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('0.18.0 migrations', () => {
  it('are picked for an app on 0.17', () => {
    expect(only('eslint-brock-ignore')).toHaveLength(1);
    expect(only('guide-parts')).toHaveLength(1);
    expect(only('shell-workarounds-removed')).toHaveLength(1);
  });

  it('eslint-brock-ignore adds **/.brock/** to the ignores once', async () => {
    const config = "import { brockEslint } from '@drizztdourden08/brock-lint-config';\n\nexport default brockEslint({ presets: ['react-app'], ignores: ['dist/**'] });\n";
    const root = appWith({ 'eslint.config.mjs': config });
    await runMigrations(root, only('eslint-brock-ignore'));
    const once = read(root, 'eslint.config.mjs');
    expect(once).toContain("ignores: ['**/.brock/**', 'dist/**']");
    const second = await runMigrations(root, only('eslint-brock-ignore'));
    expect(read(root, 'eslint.config.mjs')).toBe(once);
    expect(second.applied[0]?.touched).toEqual([]);
  });

  it('eslint-brock-ignore adds an ignores list where the config has none', async () => {
    const root = appWith({ 'eslint.config.mjs': "export default brockEslint({ presets: ['react-app'] });\n" });
    await runMigrations(root, only('eslint-brock-ignore'));
    expect(read(root, 'eslint.config.mjs')).toBe("export default brockEslint({ ignores: ['**/.brock/**'], presets: ['react-app'] });\n");
  });

  it('guide-parts asks for guide.parts and for the hand-written parts list to go', async () => {
    const root = appWith({
      'tessera.config.json': '{ "guide": { "usage": "report" } }',
      'src/guide/tree.ts': "declare module '@drizztdourden08/tessera' {\n  interface TesseraApps { parts: 'Rooms' | 'Seeds' }\n}\n",
    });
    const run = await runMigrations(root, only('guide-parts'));
    expect(run.todos.map((todo) => todo.file).sort()).toEqual(['src/guide/tree.ts', 'tessera.config.json']);
    expect(run.todos.find((todo) => todo.file === 'tessera.config.json')?.message).toContain('guide.parts');
  });

  it('guide-parts is quiet once guide.parts is set', async () => {
    const root = appWith({ 'tessera.config.json': '{ "apps": { "apps/desktop": { "guide": { "parts": "apps/desktop/src/guide/parts.type.ts" } } } }' });
    expect((await runMigrations(root, only('guide-parts'))).todos).toEqual([]);
  });

  it('shell-workarounds-removed lists BackTitle, titleBarMenu and the confirm focus option', async () => {
    const root = appWith({
      'src/views/Rooms/Rooms.tsx': "import { BackTitle, titleBarMenu, confirmAction } from '@drizztdourden08/brock-react';\nvoid confirmAction({ title: 'Drop?', message: '', focus: 'cancel' });\n",
      'src/views/Plain.tsx': "const look = { focus: 'cancel' };\n",
    });
    const run = await runMigrations(root, only('shell-workarounds-removed'));
    expect(run.todos.filter((todo) => todo.file === 'src/views/Rooms/Rooms.tsx')).toHaveLength(3);
    expect(run.todos.some((todo) => todo.file === 'src/views/Plain.tsx')).toBe(false);
  });
});
