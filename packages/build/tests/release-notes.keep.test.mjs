/* @layer tooling-scripts @kind test */
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { runReleaseNotes } from '../src/commands/release-notes.mjs';
import { brockWorkspace as monorepo, removeTempRepos } from './temp-repo.mjs';

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

const AT_ROOT = 'brock release-notes: release-notes is not beside the app; reading release-notes at the repo root.';

describe('K1 brock release-notes check', { tags: ['critical'] }, () => {
  it('checks the note beside the app against the product name, from the app or the repo root', async () => {
    const root = monorepo({ 'apps/desktop/release-notes/v0.2.0.md': NOTE });
    expect(await run(join(root, 'apps/desktop'), ['check'])).toEqual({ code: 0, lines: ['brock release-notes: release-notes/v0.2.0.md, 0 finding(s).'] });
    expect((await run(root, ['check', 'v0.2.0'])).code).toBe(0);
    const renamed = monorepo({ 'apps/desktop/release-notes/v0.2.0.md': NOTE.replace('Atlas', 'Globe') });
    expect((await run(renamed, ['check'])).lines[0]).toBe('release-notes/v0.2.0.md:1  the title names "Globe"; the product is "Atlas"');
  });

  it('falls back to the repo root when only it has notes, and says so once', async () => {
    const root = monorepo({ 'release-notes/v0.2.0.md': NOTE });
    expect(await run(join(root, 'apps/desktop'), ['check'])).toEqual({ code: 0, lines: [AT_ROOT, 'brock release-notes: release-notes/v0.2.0.md, 0 finding(s).'] });
    expect((await run(root, ['check', '0.2.0'])).lines[0]).toBe(AT_ROOT);
    const renamed = monorepo({ 'release-notes/v0.2.0.md': NOTE.replace('Atlas', 'Globe') });
    expect((await run(renamed, ['check'])).lines[1]).toBe('release-notes/v0.2.0.md:1  the title names "Globe"; the product is "Atlas"');
  });

  it('wants a named version note, and the app version once the repo has an older note', async () => {
    const empty = monorepo();
    expect((await run(empty, ['check'])).code).toBe(0);
    const named = await run(empty, ['check', '0.3.0']);
    expect(named.code).toBe(1);
    expect(named.lines[0]).toMatch(/^release-notes\/v0\.3\.0\.md: missing\./);
    expect((await run(monorepo({ 'apps/desktop/release-notes/v0.1.0.md': NOTE }), ['check'])).lines[0]).toMatch(/^release-notes\/v0\.2\.0\.md: missing\./);
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

  it('does not read a shared root folder for an app of several', async () => {
    const root = monorepo({
      'apps/desktop/brock.config.ts': "export default { product: { id: 'atlas', name: 'Atlas', releaseTagPrefix: 'desktop-v' } };\n",
      'apps/tools/brock.config.ts': "export default { product: { id: 'tools', name: 'Tools', releaseTagPrefix: 'tools-v' } };\n",
      'release-notes/v0.2.0.md': NOTE,
    });
    expect((await run(join(root, 'apps/desktop'), ['check', '0.2.0'])).lines[0]).toMatch(/^release-notes\/v0\.2\.0\.md: missing\./);
  });
});
