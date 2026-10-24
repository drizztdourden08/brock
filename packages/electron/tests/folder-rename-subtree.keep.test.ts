/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { existsSync } from 'fs';
import { mkdir, readFile, rm, symlink } from 'fs/promises';
import { join } from 'path';
import { OPENING_SEGMENTS } from '../src/main/documents/opening-segments.constants';
import { subtreeDenied } from '../src/main/documents/subtree-denied';
import { names, openWorld, put } from './folder-ops-fixture';
import type { OpsWorld } from './folder-ops-fixture';

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';

let world: OpsWorld;

beforeEach(async () => {
  world = await openWorld('brock-subtree-');
});

afterEach(async () => {
  await rm(world.base, { recursive: true, force: true });
});

describe('a folder rename and what the folder carries', () => {
  it('refuses the workflow exploit: write x/workflows/ci.yml, then rename x to .github', async () => {
    const { access, granted } = world;
    await put(join(granted, 'x', 'workflows', 'ci.yml'), 'on: push');
    await expect(access.rename(join(granted, 'x'), join(granted, '.github'))).rejects.toThrow(/may not be changed/);
    expect(existsSync(join(granted, '.github'))).toBe(false);
    expect(await readFile(join(granted, 'x', 'workflows', 'ci.yml'), 'utf8')).toBe('on: push');
  });

  it('refuses the PowerShell exploit: write x/Microsoft.PowerShell_profile.ps1, then rename x to WindowsPowerShell', async () => {
    const { access, granted } = world;
    await put(join(granted, 'x', 'Microsoft.PowerShell_profile.ps1'), 'evil');
    await expect(access.rename(join(granted, 'x'), join(granted, 'WindowsPowerShell'))).rejects.toThrow(/may not be changed/);
    expect(existsSync(join(granted, 'WindowsPowerShell'))).toBe(false);
  });

  it('refuses a folder named like any opening segment of the classes, empty or not, in any case', async () => {
    const { access, granted } = world;
    for (const name of ['.github', 'powershell', 'WindowsPowerShell', 'Library', '.config', 'Start Menu', 'Programs', '.git', '.husky', '.vscode', '.idea', '.devcontainer', '.SSH']) {
      expect(OPENING_SEGMENTS.has(name.toLowerCase()), name).toBe(true);
    }
    await mkdir(join(granted, 'empty'));
    for (const name of OPENING_SEGMENTS) {
      await expect(access.rename(join(granted, 'empty'), join(granted, name.toUpperCase())), name).rejects.toThrow(/may not be changed/);
    }
    expect(await names(granted)).toEqual(['app', 'empty', 'sub']);
  });

  it('refuses a folder whose content would land in a class under an ordinary name, at any depth', async () => {
    const { access, granted } = world;
    for (const inner of [join('.git', 'config'), join('deep', 'er', '.vscode', 'tasks.json'), 'danger.lnk', join('a', 'desktop.ini'), join('.config', 'autostart', 'x.desktop'), '.bashrc']) {
      await put(join(granted, 'src', inner));
      await expect(access.rename(join(granted, 'src'), join(granted, 'plain')), inner).rejects.toThrow(/may not be changed/);
      await rm(join(granted, 'src'), { recursive: true });
    }
    expect(existsSync(join(granted, 'plain'))).toBe(false);
  });

  it('refuses a folder with more entries than it can check', async () => {
    const { granted } = world;
    for (const name of ['a', 'b', 'c', 'd']) await put(join(granted, 'big', name));
    await expect(subtreeDenied(join(granted, 'big'), join(granted, 'moved'), 3)).rejects.toThrow(/more than 3 entries/);
    await expect(subtreeDenied(join(granted, 'big'), join(granted, 'moved'), 4)).resolves.toBe(false);
  });

  it('still renames an ordinary folder with ordinary content', async () => {
    const { access, granted } = world;
    await put(join(granted, 'docs', 'deep', 'a.txt'), 'a');
    await access.rename(join(granted, 'docs'), join(granted, 'papers'));
    expect(await readFile(join(granted, 'papers', 'deep', 'a.txt'), 'utf8')).toBe('a');
  });
});

describe('renaming a link', () => {
  it('moves the link itself, never its target, even when it leads outside', async () => {
    const { access, granted, outside } = world;
    await symlink(outside, join(granted, 'out'), dirLink);
    await access.rename(join(granted, 'out'), join(granted, 'out2'));
    expect(await names(outside)).toEqual(['secret.txt']);
    expect(await readFile(join(granted, 'out2', 'secret.txt'), 'utf8')).toBe('secret');
    expect(existsSync(join(granted, 'out'))).toBe(false);
  });

  it('moves a link that leads inside without touching the folder it points at', async () => {
    const { access, granted } = world;
    await symlink(join(granted, 'sub'), join(granted, 'in'), dirLink);
    await access.rename(join(granted, 'in'), join(granted, 'in2'));
    expect(await names(join(granted, 'sub'))).toEqual(['in.txt']);
    expect(existsSync(join(granted, 'in2'))).toBe(true);
  });

  it('still checks the name of the link and what sits behind it as a write', async () => {
    const { access, granted, outside } = world;
    await symlink(outside, join(granted, 'out'), dirLink);
    await expect(access.rename(join(granted, 'out', 'secret.txt'), join(granted, 'x.txt'))).rejects.toThrow(/not inside a granted folder/);
    await symlink(join(granted, 'sub'), join(granted, 'danger.lnk'), dirLink);
    await expect(access.rename(join(granted, 'danger.lnk'), join(granted, 'fine'))).rejects.toThrow(/may not be changed/);
  });
});
