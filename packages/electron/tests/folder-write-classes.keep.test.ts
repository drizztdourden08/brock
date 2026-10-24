/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync } from 'fs';
import { mkdir, readFile, rm, symlink, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { lureFile } from '../src/main/documents/lure-file';
import { repoConfigPath } from '../src/main/documents/repo-config-path';
import { makeTree, sessionOf, testAccess } from './folder-fixture';
import type { Call } from './folder-fixture';

vi.mock('electron', () => ({ dialog: {}, app: { clearRecentDocuments: () => undefined, addRecentDocument: () => undefined } }));

const REPO = [
  join('proj', '.git', 'hooks', 'pre-commit'), join('proj', '.git', 'config'), join('proj', '.git', 'info', 'attributes'), join('sub', 'proj', '.git'),
  join('proj', '.husky', 'pre-commit'), join('proj', '.vscode', 'tasks.json'), join('proj', '.idea', 'workspace.xml'),
  join('proj', '.devcontainer', 'devcontainer.json'), join('proj', '.github', 'workflows', 'ci.yml'),
];
const REPO_SAFE = [join('proj', '.github', 'CODEOWNERS'), join('proj', '.gitignore'), join('proj', '.gitattributes'), join('proj', 'docs', 'git.md'), join('proj', 'src', 'vscode.ts'), join('proj', '.github', 'workflow.md')];
const LURES = ['a.lnk', 'B.URL', join('deep', 'x.scf'), 'x.library-ms', 'x.searchConnector-ms', 'desktop.ini', 'Desktop.INI', join('sub', 'AutoRun.inf')];
const LURE_SAFE = ['a.link', 'lnk.txt', 'notes.url.txt', 'desktop.ini.txt', 'autorun.md', 'x.library'];

let base = '';
let granted = '';
let access: DocumentAccess;
let call: Call;

const seed = async (files: string[]): Promise<void> => {
  for (const file of files) {
    await mkdir(dirname(join(granted, file)), { recursive: true });
    await writeFile(join(granted, file), 'old');
  }
};

const refusedWrite = async (file: string): Promise<void> => {
  const path = join(granted, file);
  await expect(call('document:writeText', path, 'evil'), file).rejects.toThrow(/may not use/);
  await expect(call('document:write', path, new Uint8Array([1]).buffer), file).rejects.toThrow(/may not use/);
};

beforeEach(async () => {
  ({ base, granted } = await makeTree('brock-classes-'));
  access = testAccess();
  access.allowFolder(granted);
  call = sessionOf({ documents: access });
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe('writes into repository and editor configuration', () => {
  it('are refused for any .git segment, a .git pointer file and the editor and CI folders, but reads work', async () => {
    await seed([...REPO, ...REPO_SAFE]);
    for (const file of REPO) {
      await refusedWrite(file);
      expect(await readFile(join(granted, file), 'utf8')).toBe('old');
      expect(await call('document:readText', join(granted, file))).toBe('old');
    }
  });

  it('are refused for a new file there too, in any case', async () => {
    for (const file of [join('proj', '.git', 'hooks', 'new'), join('proj', '.GIT', 'HOOKS', 'new'), join('proj', '.VSCODE', 'launch.json'), join('proj', '.GitHub', 'Workflows', 'new.yml')]) {
      await refusedWrite(file);
      expect(existsSync(join(granted, file))).toBe(false);
    }
  });

  it('leave the ordinary files next to them alone', async () => {
    await seed(REPO_SAFE);
    for (const file of REPO_SAFE) {
      await call('document:writeText', join(granted, file), 'new');
      expect(await readFile(join(granted, file), 'utf8')).toBe('new');
    }
  });

  it('are refused through a link inside the grant', async () => {
    await seed([join('proj', '.git', 'hooks', 'pre-commit')]);
    await symlink(join(granted, 'proj', '.git'), join(granted, 'alias'), process.platform === 'win32' ? 'junction' : 'dir');
    await refusedWrite(join('alias', 'hooks', 'post-commit'));
  });

  it('know the paths on their own', () => {
    for (const file of REPO) expect(repoConfigPath(join(base, file))).toBe(true);
    for (const file of REPO_SAFE) expect(repoConfigPath(join(base, file))).toBe(false);
  });
});

describe('writes of files that leak credentials when a folder is shown', () => {
  it('are refused by name and by extension, in any case and any depth, and leave the old file', async () => {
    await seed(LURES);
    for (const file of LURES) {
      await refusedWrite(file);
      expect(await readFile(join(granted, file), 'utf8')).toBe('old');
    }
  });

  it('are refused for a new file, and allowed for look-alike names', async () => {
    await refusedWrite('fresh.lnk');
    expect(existsSync(join(granted, 'fresh.lnk'))).toBe(false);
    for (const file of LURE_SAFE) {
      await call('document:writeText', join(granted, file), 'ok');
      expect(await readFile(join(granted, file), 'utf8')).toBe('ok');
    }
  });

  it('do not stop a read, or a file the user picked in a dialog', async () => {
    await seed(['a.lnk']);
    expect(await call('document:readText', join(granted, 'a.lnk'))).toBe('old');
    access.allow(join(granted, 'a.lnk'));
    await call('document:writeText', join(granted, 'a.lnk'), 'mine');
    expect(await readFile(join(granted, 'a.lnk'), 'utf8')).toBe('mine');
  });

  it('know the names on their own', () => {
    for (const file of LURES) expect(lureFile(join(base, file))).toBe(true);
    for (const file of LURE_SAFE) expect(lureFile(join(base, file))).toBe(false);
  });
});

describe('writes of the files every git directory needs', () => {
  const names = ['HEAD', 'head', 'commondir', 'CommonDir', 'gitdir'];

  it('are refused by name, whatever the folder', async () => {
    for (const name of names) {
      await refusedWrite(name);
      await refusedWrite(join('bare', name));
      await refusedWrite(join('deep', 'er', name));
      expect(existsSync(join(granted, 'bare', name))).toBe(false);
    }
  });

  it('are refused in a parallel burst of the three names, which no layout check could see', async () => {
    const settled = await Promise.allSettled([
      call('document:writeText', join(granted, 'burst', 'HEAD'), 'ref: refs/heads/main'),
      call('document:writeText', join(granted, 'burst', 'objects', 'x'), 'o'),
      call('document:writeText', join(granted, 'burst', 'refs', 'heads', 'main'), 'r'),
    ]);
    expect(settled.map((outcome) => outcome.status)).toEqual(['rejected', 'fulfilled', 'fulfilled']);
    expect(existsSync(join(granted, 'burst', 'HEAD'))).toBe(false);
  });

  it('are refused for the commondir split, X holding HEAD and commondir and Y the objects', async () => {
    await call('document:writeText', join(granted, 'y', 'objects', 'x'), 'o');
    await call('document:writeText', join(granted, 'y', 'refs', 'heads', 'main'), 'r');
    await call('document:writeText', join(granted, 'y', 'config'), 'c');
    await refusedWrite(join('x', 'HEAD'));
    await refusedWrite(join('x', 'commondir'));
    expect(existsSync(join(granted, 'x', 'HEAD'))).toBe(false);
    expect(existsSync(join(granted, 'x', 'commondir'))).toBe(false);
  });

  it('leave the files that only look like them alone', async () => {
    for (const file of ['HEAD.md', 'heads', 'common', join('docs', 'objects', 'x.md'), join('docs', 'refs', 'x.md'), 'gitdir.txt']) {
      await call('document:writeText', join(granted, file), 'ok');
      expect(await readFile(join(granted, file), 'utf8')).toBe('ok');
    }
  });

  it('can still be read', async () => {
    await seed(['bare/HEAD']);
    expect(await call('document:readText', join(granted, 'bare', 'HEAD'))).toBe('old');
  });
});
