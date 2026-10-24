/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync } from 'fs';
import { mkdir, readFile, rm, symlink, writeFile } from 'fs/promises';
import { homedir } from 'os';
import { dirname, join, parse } from 'path';
import { createDocumentAccess } from '../src/main/documents/document-access';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { autostartPath } from '../src/main/documents/autostart-path';
import { protectedReals } from '../src/main/documents/protected-reals';
import { makeTree, sessionOf } from './folder-fixture';
import type { Call } from './folder-fixture';

vi.mock('electron', () => ({ app: { clearRecentDocuments: () => undefined, addRecentDocument: () => undefined }, dialog: {} }));

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';
const STARTUP = join('AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');
const RISKY = [
  join(STARTUP, 'run.cmd'), join('ProgramData', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'StartUp', 'run.cmd'),
  join('proj', '.git', 'hooks', 'pre-commit'), join('proj', '.git', 'config'), '.bashrc', '.zshrc', '.profile', '.bash_profile',
  join('Documents', 'WindowsPowerShell', 'Microsoft.PowerShell_profile.ps1'), join('Documents', 'PowerShell', 'profile.ps1'),
  join('Documents', 'PowerShell', 'Modules', 'evil', 'evil.psm1'), join('Library', 'LaunchAgents', 'a.plist'),
  join('.config', 'autostart', 'a.desktop'), join('.config', 'systemd', 'user', 'a.service'), join('.ssh', 'authorized_keys'),
];
const SAFE = [join('Documents', 'notes.txt'), join('Documents', 'PowerShell', 'readme.txt'), join('proj', 'src', 'hooks.ts'), join('proj', '.git', 'HEAD.txt'), 'startup.txt'];

let base = '';
let granted = '';
let outside = '';
let home = '';
let access: DocumentAccess;
let call: Call;

beforeEach(async () => {
  ({ base, granted, outside } = await makeTree('brock-autostart-'));
  home = join(base, 'home');
  for (const folder of ['Documents', 'AppData/Local/Foo', 'Library', '.config/app']) await mkdir(join(home, folder), { recursive: true });
  access = createDocumentAccess({ sensitiveRoots: () => [home, join(home, 'AppData'), join(home, 'Library'), join(home, '.config')] });
  call = sessionOf({ documents: access });
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe('a grant that would reach too much', () => {
  it('refuses the home folder, its parents, a filesystem root, and folders that hold AppData, Library or .config', () => {
    for (const folder of [home, base, parse(base).root, join(home, 'AppData'), join(home, 'Library'), join(home, '.config')]) {
      expect(() => access.allowFolder(folder)).toThrow(/cannot be granted|below the filesystem root/);
    }
  });

  it('allows the folders inside home, even inside AppData and .config', () => {
    for (const folder of ['Documents', join('AppData', 'Local', 'Foo'), join('.config', 'app')]) {
      expect(access.allowFolder(join(home, folder))).toBe(join(home, folder));
    }
  });

  it('uses the real home folder by default', () => {
    const real = createDocumentAccess();
    expect(() => real.allowFolder(homedir())).toThrow(/home folder/);
    expect(() => real.allowFolder(dirname(homedir()))).toThrow(/home folder/);
  });
});

describe('writing to autostart and hook paths under a grant', () => {
  beforeEach(async () => {
    access.allowFolder(granted);
    for (const file of [...RISKY, ...SAFE]) {
      await mkdir(dirname(join(granted, file)), { recursive: true });
      await writeFile(join(granted, file), 'old');
    }
  });

  it('refuses the writes of the renderer there, and leaves the files alone', async () => {
    for (const file of RISKY) {
      const path = join(granted, file);
      await expect(call('document:writeText', path, 'evil')).rejects.toThrow(/may not use/);
      await expect(call('document:write', path, new Uint8Array([1]).buffer)).rejects.toThrow(/may not use/);
      expect(await readFile(path, 'utf8')).toBe('old');
    }
  });

  it('refuses a new file in them, in any case', async () => {
    for (const path of [join(granted, STARTUP, 'new.cmd'), join(granted, STARTUP.toUpperCase(), 'new.cmd'), join(granted, 'proj', '.GIT', 'HOOKS', 'post-merge')]) {
      await expect(call('document:writeText', path, 'evil')).rejects.toThrow(/may not use/);
      expect(existsSync(path)).toBe(false);
    }
  });

  it('still reads them, and writes everything else', async () => {
    for (const file of RISKY) expect(await call('document:readText', join(granted, file))).toBe('old');
    for (const file of SAFE) {
      await call('document:writeText', join(granted, file), 'new');
      expect(await readFile(join(granted, file), 'utf8')).toBe('new');
    }
  });

  it('refuses a write through a link inside the grant to one of them', async () => {
    await symlink(join(granted, dirname(RISKY[0] ?? '')), join(granted, 'shortcut'), dirLink);
    await expect(call('document:writeText', join(granted, 'shortcut', 'new.cmd'), 'evil')).rejects.toThrow(/may not use/);
  });

  it('leaves a file the user picked in a dialog alone', async () => {
    const picked = join(granted, '.bashrc');
    access.allow(picked);
    await call('document:writeText', picked, 'mine');
    expect(await readFile(picked, 'utf8')).toBe('mine');
  });

  it('knows the paths on its own', () => {
    for (const file of RISKY) expect(autostartPath(join(base, file))).toBe(true);
    for (const file of SAFE) expect(autostartPath(join(base, file))).toBe(false);
  });
});

describe('the app folders that are not there yet', () => {
  it('reads the real path of the nearest folder that exists, and looks again until the folder is there', async () => {
    const later = join(base, 'later');
    const roots = protectedReals(() => [join(later, 'Data')]);
    expect(roots.current()).toEqual([join(base, 'later', 'Data')]);
    await symlink(outside, later, dirLink);
    roots.refresh();
    expect(roots.current()).toEqual([join(outside, 'Data')]);
    await mkdir(join(outside, 'Data'));
    roots.refresh();
    await rm(join(outside, 'Data'), { recursive: true });
    roots.refresh();
    expect(roots.current()).toEqual([join(outside, 'Data')]);
  });

  it('refuses a folder that appears later through a link, under a broader grant', async () => {
    const guarded = createDocumentAccess({ protectedRoots: () => [join(base, 'later', 'Data')], sensitiveRoots: () => [] });
    guarded.allowFolder(base);
    await symlink(outside, join(base, 'later'), dirLink);
    await mkdir(join(outside, 'Data'));
    await writeFile(join(outside, 'Data', 'x.txt'), 'x');
    await expect(guarded.resolve(join(outside, 'Data', 'x.txt'))).rejects.toThrow(/may not use/);
    expect(await guarded.resolve(join(outside, 'secret.txt'))).toBe(join(outside, 'secret.txt'));
  });
});
