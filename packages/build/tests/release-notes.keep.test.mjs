/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { runReleaseNotes } from '../src/commands/release-notes.mjs';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';
import { brockWorkspace as monorepo, removeTempRepos, tempRepo as tree } from './temp-repo.mjs';

const TEMPLATE_NOTE = join(import.meta.dirname, '../../../templates/app/release-notes/v0.1.0.md');

const NOTE = `# Atlas v0.2.0

The map opens where you left it.

## View

- The map opens on the last place you looked at.
`;

afterEach(() => {
  vi.restoreAllMocks();
  removeTempRepos();
});

const run = async (rootDir, args) => {
  const lines = [];
  vi.spyOn(console, 'log').mockImplementation((line) => lines.push(line));
  vi.spyOn(console, 'error').mockImplementation((line) => lines.push(line));
  return { code: await runReleaseNotes({ rootDir, args }), lines };
};


describe('brock release-notes check', () => {
  it('checks the note at the repo root against the product name, from the app or the repo root', async () => {
    const root = monorepo({ 'release-notes/v0.2.0.md': NOTE });
    expect(await run(join(root, 'apps/desktop'), ['check'])).toEqual({ code: 0, lines: ['brock release-notes: release-notes/v0.2.0.md, 0 finding(s).'] });
    expect((await run(root, ['check', 'v0.2.0'])).code).toBe(0);
    const renamed = monorepo({ 'release-notes/v0.2.0.md': NOTE.replace('Atlas', 'Globe') });
    expect((await run(renamed, ['check'])).lines[0]).toBe('release-notes/v0.2.0.md:1  the title names "Globe"; the product is "Atlas"');
  });

  it('wants a named version note, and the app version once the repo has an older note', async () => {
    const empty = monorepo();
    expect((await run(empty, ['check'])).code).toBe(0);
    const named = await run(empty, ['check', '0.3.0']);
    expect(named.code).toBe(1);
    expect(named.lines[0]).toMatch(/^release-notes\/v0\.3\.0\.md: missing\./);
    expect((await run(monorepo({ 'release-notes/v0.1.0.md': NOTE }), ['check'])).lines[0]).toMatch(/^release-notes\/v0\.2\.0\.md: missing\./);
  });

  it('reads the notes from the app folder when the repo releases several apps', async () => {
    const root = monorepo({
      'apps/desktop/brock.config.ts': "export default { product: { id: 'atlas', name: 'Atlas', releaseTagPrefix: 'desktop-v' } };\n",
      'apps/tools/brock.config.ts': "export default { product: { id: 'tools', name: 'Tools', releaseTagPrefix: 'tools-v' } };\n",
      'apps/desktop/release-notes/v0.2.0.md': NOTE,
    });
    expect((await run(join(root, 'apps/desktop'), ['check', '0.2.0'])).code).toBe(0);
    expect((await run(join(root, 'apps/tools'), ['check', '0.2.0'])).lines[0]).toMatch(/^release-notes\/v0\.2\.0\.md: missing\./);
  });

  it('passes the note a new app ships, once create-brock puts its name in', async () => {
    const note = readFileSync(TEMPLATE_NOTE, 'utf8').replaceAll('Brock App', 'Atlas').replace('v0.1.0', 'v0.2.0');
    expect((await run(monorepo({ 'release-notes/v0.2.0.md': note }), ['check'])).code).toBe(0);
  });
});

const only = () => selectMigrations(collectMigrations([]), { from: '0.35.0', to: null }).filter((m) => m.file.endsWith('release-notes-folder.mjs'));

describe('release-notes-folder migration (0.36.0)', () => {
  it('adds the folder with its README at a standalone app root, once', async () => {
    const root = tree({ '.git/HEAD': '', 'package.json': '{"name":"x"}' });
    const first = await runMigrations(root, only());
    expect(first.applied[0].touched).toEqual(['release-notes/README.md']);
    expect(first.todos.map((todo) => todo.file)).toEqual(['release-notes/README.md']);
    expect(readFileSync(join(root, 'release-notes/README.md'), 'utf8')).toContain('# Release notes');
    const second = await runMigrations(root, only());
    expect(second.applied[0].touched).toEqual([]);
    expect(second.todos).toEqual([]);
  });

  it('writes at the repo root of a workspace app, leaves existing notes, and flags hand-kept workflows', async () => {
    const root = monorepo({ '.github/workflows/release.yml': 'name: Release\n' });
    const app = join(root, 'apps/desktop');
    const result = await runMigrations(app, only());
    expect(result.applied[0].touched).toEqual(['../../release-notes/README.md']);
    expect(result.todos.map((todo) => todo.file)).toEqual(['../../.github/workflows/release.yml', '../../release-notes/README.md']);
    const kept = monorepo({ 'release-notes/v0.1.0.md': NOTE });
    expect((await runMigrations(join(kept, 'apps/desktop'), only())).applied[0].touched).toEqual([]);
    expect(existsSync(join(kept, 'release-notes/README.md'))).toBe(false);
  });
});
