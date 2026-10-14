/* @layer electron-main @kind test */
import { mkdtemp, mkdir, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import { createInstallSize } from '../src/main/create-install-size';
import { installLocation } from '../src/main/install-location';
import { measurePath } from '../src/main/measure-path';
import { parseRegValue } from '../src/main/parse-reg-value';
import type { RunCommand } from '../src/main/updater-main.type';

const KEY = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\my-app';

const fakeReg = (stdout: string | null) => {
  const calls: string[][] = [];
  const run: RunCommand = (_file, args) => {
    calls.push([...args]);
    if (args[0] === 'query') return stdout === null ? Promise.reject(new Error('missing')) : Promise.resolve({ stdout });
    return Promise.resolve({ stdout: '' });
  };
  return { run, calls };
};

describe('installLocation', () => {
  it('finds a Velopack install root on Windows and names its uninstall key', () => {
    const facts = { platform: 'win32' as const, execPath: 'C:\\Users\\me\\AppData\\Local\\my-app\\current\\My App.exe', appId: 'my-app' };
    expect(installLocation({ ...facts, exists: () => true })).toEqual({ path: 'C:\\Users\\me\\AppData\\Local\\my-app', uninstallKey: KEY });
    expect(installLocation({ ...facts, exists: () => false })).toBeNull();
  });

  it('measures the bundle on macOS and the AppImage on Linux', () => {
    const exists = () => true;
    expect(installLocation({ platform: 'darwin', execPath: '/Applications/My App.app/Contents/MacOS/My App', appId: 'my-app', exists })?.path).toBe('/Applications/My App.app');
    expect(installLocation({ platform: 'linux', execPath: '/tmp/.mount/my-app', appId: 'my-app', appImage: '/home/me/My-App.AppImage', exists })).toEqual({ path: '/home/me/My-App.AppImage', uninstallKey: null });
    expect(installLocation({ platform: 'linux', execPath: '/opt/my-app/my-app', appId: 'my-app', exists })).toBeNull();
  });
});

describe('parseRegValue', () => {
  it('reads hex and decimal values', () => {
    expect(parseRegValue('\n    EstimatedSize    REG_QWORD    0x1f4\n', 'EstimatedSize')).toEqual({ type: 'REG_QWORD', value: 500 });
    expect(parseRegValue('    EstimatedSize    REG_SZ    2048\n', 'EstimatedSize')).toEqual({ type: 'REG_SZ', value: 2048 });
    expect(parseRegValue('nothing here', 'EstimatedSize')).toBeNull();
  });
});

describe('createInstallSize', () => {
  it('writes the measured size as a DWORD in kilobytes when the uninstall key holds another type', async () => {
    const reg = fakeReg('    EstimatedSize    REG_QWORD    0x10\n');
    await createInstallSize({ path: 'root', uninstallKey: KEY }, reg.run, () => Promise.resolve(3 * 1024 + 1)).publish();
    expect(reg.calls[1]).toEqual(['add', KEY, '/v', 'EstimatedSize', '/t', 'REG_DWORD', '/d', '4', '/f']);
  });

  it('leaves a matching DWORD alone and never creates a missing key', async () => {
    const same = fakeReg('    EstimatedSize    REG_DWORD    0x4\n');
    await createInstallSize({ path: 'root', uninstallKey: KEY }, same.run, () => Promise.resolve(4096)).publish();
    expect(same.calls).toHaveLength(1);
    const missing = fakeReg(null);
    await createInstallSize({ path: 'root', uninstallKey: KEY }, missing.run, () => Promise.resolve(4096)).publish();
    expect(missing.calls).toHaveLength(1);
  });

  it('measures once and reports nothing outside an install', async () => {
    let measured = 0;
    const size = createInstallSize({ path: 'root', uninstallKey: null }, fakeReg(null).run, () => { measured += 1; return Promise.resolve(10); });
    expect(await size.measure()).toBe(10);
    expect(await size.measure()).toBe(10);
    expect(measured).toBe(1);
    expect(await createInstallSize(null, fakeReg(null).run).measure()).toBeNull();
  });
});

describe('measurePath', () => {
  it('adds up every file under a folder', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'brock-size-'));
    try {
      await mkdir(join(dir, 'nested'));
      await writeFile(join(dir, 'a.bin'), Buffer.alloc(10));
      await writeFile(join(dir, 'nested', 'b.bin'), Buffer.alloc(5));
      expect(await measurePath(dir)).toBe(15);
      expect(await measurePath(join(dir, 'gone'))).toBe(0);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
