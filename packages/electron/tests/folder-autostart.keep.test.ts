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
  '.bashrc', '.zshrc', '.profile', '.bash_profile',
  join('Documents', 'WindowsPowerShell', 'Microsoft.PowerShell_profile.ps1'), join('Documents', 'PowerShell', 'profile.ps1'),
  join('Documents', 'PowerShell', 'Modules', 'evil', 'evil.psm1'), join('Library', 'LaunchAgents', 'a.plist'),
  join('.config', 'autostart', 'a.desktop'), join('.config', 'systemd', 'user', 'a.service'), join('.ssh', 'authorized_keys'),
];
const SAFE = [join('Documents', 'notes.txt'), join('Documents', 'PowerShell', 'readme.txt'), join('proj', 'src', 'hooks.ts'), 'startup.txt'];

let base = '';
let granted = '';
let outside = '';
let home = '';
let access: DocumentAccess;
let call: Call;

beforeEach(async () => {
  ({ base, granted, outside } = await makeTree('brock-autostart-'));
  home = join(base, 'home');
  const trees = ['AppData', '.config', '.local', '.cache', 'Library'].map((name) => join(home, name));
  for (const folder of [...trees, join(base, 'ProgramData')]) await mkdir(folder, { recursive: true });
  for (const folder of ['Documents', 'Desktop/proj', 'Downloads', 'AppData/Roaming', 'AppData/Local/Foo', '.config/app', '.local/bin']) await mkdir(join(home, folder), { recursive: true });
  access = createDocumentAccess({ sensitiveRoots: () => ({ home: [home], trees: [...trees, join(base, 'ProgramData')] }) });
  call = sessionOf({ documents: access });
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe('a grant that would reach too much', () => {
  it('refuses the home folder and its parents, and a filesystem root', () => {
    for (const folder of [home, base, parse(base).root]) expect(() => access.allowFolder(folder)).toThrow(/home folder|below the filesystem root/);
  });

  it('refuses any folder that is, holds or sits inside AppData, Library, .config, .local, .cache or ProgramData', () => {
    const inside = ['AppData', 'AppData/Roaming', 'AppData/Local/Foo', 'Library', '.config', '.config/app', '.local', '.local/bin', '.cache'].map((name) => join(home, name));
    for (const folder of [...inside, join(base, 'ProgramData')]) expect(() => access.allowFolder(folder), folder).toThrow(/cannot be granted/);
  });

  it('allows the ordinary content folders inside home and folders elsewhere', () => {
    for (const folder of [join(home, 'Documents'), join(home, 'Desktop', 'proj'), join(home, 'Downloads'), granted]) {
      expect(access.allowFolder(folder)).toBe(folder);
    }
  });

  it('uses the real home folder and system folders by default', () => {
    const real = createDocumentAccess();
    expect(() => real.allowFolder(homedir())).toThrow(/home folder/);
    expect(() => real.allowFolder(dirname(homedir()))).toThrow(/home folder/);
    for (const folder of [process.env.APPDATA, process.env.LOCALAPPDATA, process.env.ProgramFiles, process.env.SystemRoot, process.env.ProgramData]) {
      if (folder !== undefined && existsSync(folder)) expect(() => real.allowFolder(folder), folder).toThrow(/cannot be granted/);
    }
    for (const folder of ['/usr', '/etc', join(homedir(), '.config'), join(homedir(), '.local', 'bin')]) {
      if (process.platform !== 'win32' && existsSync(folder)) expect(() => real.allowFolder(folder), folder).toThrow(/cannot be granted/);
    }
  });

  it('allows the real Documents folder when it is there', () => {
    const documents = join(homedir(), 'Documents');
    if (existsSync(documents)) expect(createDocumentAccess().allowFolder(documents)).toBeTruthy();
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
    for (const path of [join(granted, STARTUP, 'new.cmd'), join(granted, STARTUP.toUpperCase(), 'new.cmd')]) {
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
    const guarded = createDocumentAccess({ protectedRoots: () => [join(base, 'later', 'Data')], sensitiveRoots: () => ({ home: [], trees: [] }) });
    guarded.allowFolder(base);
    await symlink(outside, join(base, 'later'), dirLink);
    await mkdir(join(outside, 'Data'));
    await writeFile(join(outside, 'Data', 'x.txt'), 'x');
    await expect(guarded.resolve(join(outside, 'Data', 'x.txt'))).rejects.toThrow(/may not use/);
    expect(await guarded.resolve(join(outside, 'secret.txt'))).toBe(join(outside, 'secret.txt'));
  });
});
