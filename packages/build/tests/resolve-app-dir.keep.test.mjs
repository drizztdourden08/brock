/* @layer tooling-scripts @kind test */
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { resolveAppDir } from '../src/resolve-app-dir.mjs';
import { brockWorkspace, removeTempRepos, tempRepo } from './temp-repo.mjs';

afterEach(removeTempRepos);

const SECOND_APP = { 'apps/mobile/brock.config.ts': "export default { product: { id: 'atlas-mobile', name: 'Atlas Mobile' } };\n" };

describe('K1 the app folder a brock command runs in', { tags: ['critical'] }, () => {
  it('is the folder above the current one that holds brock.config.ts', async () => {
    const root = brockWorkspace({ 'apps/desktop/src/screens/deep/.keep': '' });
    expect(await resolveAppDir(join(root, 'apps', 'desktop', 'src', 'screens', 'deep'))).toBe(join(root, 'apps', 'desktop'));
    expect(await resolveAppDir(join(root, 'apps', 'desktop'))).toBe(join(root, 'apps', 'desktop'));
  });

  it('is the only app of the workspace when run from the repo root or a folder without an app', async () => {
    const root = brockWorkspace({ 'docs/guide.md': '' });
    expect(await resolveAppDir(root)).toBe(join(root, 'apps', 'desktop'));
    expect(await resolveAppDir(join(root, 'docs'))).toBe(join(root, 'apps', 'desktop'));
  });

  it('fails and lists the apps when the workspace has several and no --app is given', async () => {
    const root = brockWorkspace(SECOND_APP);
    await expect(resolveAppDir(root)).rejects.toThrow(/2 apps.*--app <dir>:\n {2}apps\/desktop\n {2}apps\/mobile/s);
  });

  it('takes --app relative to the current folder or the workspace root', async () => {
    const root = brockWorkspace(SECOND_APP);
    expect(await resolveAppDir(root, 'apps/mobile')).toBe(join(root, 'apps', 'mobile'));
    expect(await resolveAppDir(join(root, 'apps', 'desktop', 'src'), 'apps/mobile')).toBe(join(root, 'apps', 'mobile'));
    await expect(resolveAppDir(root, 'apps/nowhere')).rejects.toThrow('--app apps/nowhere: no brock.config.ts');
  });

  it('fails outside a workspace with no app above', async () => {
    const root = tempRepo({ '.git/HEAD': 'ref: refs/heads/main\n', 'src/a.ts': '' });
    await expect(resolveAppDir(join(root, 'src'))).rejects.toThrow('not inside a workspace');
  });
});
