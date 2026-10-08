/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { mountLine, wslMountPath } from '../src/linux/build-steps.mjs';
import { wslDistros } from '../src/linux/linux-checks.mjs';
import { machineTemplate } from '../src/linux/linux-init.mjs';
import { machineFile, parseMachine } from '../src/linux/linux-machine.mjs';
import { linuxSettings } from '../src/linux/linux-settings.mjs';
import { wslUncPath } from '../src/linux/private-key.mjs';
import { bashStdin, remoteTarget, scriptText, shellQuote } from '../src/linux/remote.mjs';
import { vmStateOf } from '../src/linux/vbox.mjs';
import { SCRIPT_FILES } from '../src/linux/linux.constants.mjs';

const made = [];

afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const FILE = 'vm.json';
const MACHINE = { vmName: 'atlas-linux', host: '192.168.56.101', user: 'tester' };

describe('the machine settings', () => {
  it('reads the VM, the target and the defaults', () => {
    expect(parseMachine(MACHINE, FILE)).toEqual({
      file: FILE, vmName: 'atlas-linux', host: '192.168.56.101', user: 'tester', port: null, identityFile: null, builder: 'vm', wslDistro: 'Ubuntu-24.04',
    });
    expect(parseMachine({ ...MACHINE, port: '2222', builder: 'wsl', identityFile: '/home/me/.ssh/id_ed25519' }, FILE)).toMatchObject({ port: 2222, builder: 'wsl', identityFile: '/home/me/.ssh/id_ed25519' });
  });

  it('refuses a password or any secret, at any depth', () => {
    expect(() => parseMachine({ ...MACHINE, password: 'x' }, FILE)).toThrow(/never stores one/);
    expect(() => parseMachine({ ...MACHINE, ssh: { passphrase: 'x' } }, FILE)).toThrow(/ssh\.passphrase/);
    expect(() => parseMachine({ ...MACHINE, token: 'x' }, FILE)).toThrow(/secret/);
  });

  it('names what is missing or wrong', () => {
    expect(() => parseMachine({ host: 'h', user: 'u' }, FILE)).toThrow(/vmName/);
    expect(() => parseMachine({ ...MACHINE, builder: 'docker' }, FILE)).toThrow(/builder/);
    expect(() => parseMachine({ ...MACHINE, port: 70000 }, FILE)).toThrow(/port/);
  });

  it('keeps the file per machine, outside the repo, unless the environment names one', () => {
    expect(machineFile('atlas', {})).toMatch(/[\\/]\.brock[\\/]linux[\\/]atlas\.json$/);
    expect(machineFile('atlas', { BROCK_LINUX_CONFIG: 'X:/vm.json' })).toBe('X:/vm.json');
  });

  it('writes a template with no password field', () => {
    const template = machineTemplate('atlas');
    expect(Object.keys(template).some((key) => /pass|secret|token/i.test(key))).toBe(false);
    expect(() => parseMachine(template, FILE)).not.toThrow();
  });
});

describe('the remote calls', () => {
  it('runs ssh key-only, so it fails instead of asking for a password', () => {
    const remote = remoteTarget({ host: 'vm', user: 'me', port: 2222 }, 'C:/key');
    expect(remote.target).toBe('me@vm');
    expect(remote.ssh).toEqual(expect.arrayContaining(['-p', '2222', '-i', 'C:/key', 'BatchMode=yes']));
    expect(remote.scp).toEqual(expect.arrayContaining(['-P', '2222', 'BatchMode=yes']));
    expect(remoteTarget({ host: 'vm', user: 'me', port: null }, null).ssh).not.toContain('-i');
  });

  it('quotes each argument as one shell word', () => {
    expect(shellQuote('apps/desktop')).toBe('apps/desktop');
    expect(shellQuote('Atlas Studio')).toBe("'Atlas Studio'");
    expect(shellQuote("it's")).toBe("'it'\\''s'");
    expect(bashStdin(['a b', 'c'])).toBe("bash -s -- 'a b' c");
  });

  it('mounts a share only when it is not mounted, with sudo that never prompts', () => {
    const line = mountLine('atlas-src', 'brock-atlas-src');
    expect(line).toContain('mountpoint -q "$HOME"/atlas-src');
    expect(line).toContain('sudo -n mount -t vboxsf');
  });

  it('ships every script it pipes, each with its layer header', () => {
    for (const name of Object.values(SCRIPT_FILES)) expect(scriptText(name)).toMatch(/^#!\/usr\/bin\/env bash\n# @layer tooling-scripts @kind script\n/);
  });
});

describe('the host helpers', () => {
  it('maps a Windows folder to its WSL mount and a WSL file to its share', () => {
    expect(wslMountPath('X:\\atlas')).toBe('/mnt/x/atlas');
    expect(wslMountPath('C:/')).toBe('/mnt/c');
    expect(() => wslMountPath('/home/me')).toThrow(/WSL/);
    expect(wslUncPath('Ubuntu-24.04', '/home/me/.ssh/id')).toBe('\\\\wsl.localhost\\Ubuntu-24.04\\home\\me\\.ssh\\id');
  });

  it('reads the VM state and the WSL distros', () => {
    expect(vmStateOf('name="x"\nVMState="running"\n')).toBe('running');
    expect(vmStateOf('nothing')).toBeNull();
    expect(wslDistros('U\0b\0u\0n\0t\0u\0-\x002\x004\0.\x000\x004\0\r\0\n\0')).toEqual(['Ubuntu-24.04']);
  });
});

describe('the repo settings', () => {
  const repo = () => {
    const root = mkdtempSync(join(tmpdir(), 'brock-linux-'));
    made.push(root);
    mkdirSync(join(root, 'apps', 'desktop'), { recursive: true });
    return root;
  };

  it('defaults to the first electron target, brock package and its AppImage folder', async () => {
    const root = repo();
    const workspace = { name: 'atlas', targets: { app: { kind: 'electron', appDir: (checkout) => join(checkout.path, 'apps', 'desktop') } } };
    const settings = await linuxSettings(root, workspace);
    expect(settings).toMatchObject({ repoName: 'atlas', appDir: 'apps/desktop', build: ['pnpm', 'exec', 'brock', 'package'], artifactDir: 'release/velopack', shares: [], launchFlags: ['--muted'], icon: null });
    expect(settings.product).toEqual({ id: 'atlas', name: 'atlas' });
  });

  it('takes the workspace linux block and refuses a bad share', async () => {
    const root = repo();
    writeFileSync(join(root, 'apps', 'desktop', 'package.json'), '{}');
    const linux = { app: 'apps/desktop', build: ['pnpm', 'build:linux'], shares: [{ name: 'fixtures', path: 'tests/fixtures' }], launchFlags: [] };
    expect(await linuxSettings(root, { name: 'atlas', linux })).toMatchObject({ build: ['pnpm', 'build:linux'], shares: [{ name: 'fixtures', path: 'tests/fixtures' }], launchFlags: [] });
    await expect(linuxSettings(root, { name: 'atlas', linux: { shares: [{ name: 'a b', path: 'x' }] } })).rejects.toThrow(/shares/);
    await expect(linuxSettings(root, { name: 'atlas', linux: { build: [] } })).rejects.toThrow(/build/);
  });
});
