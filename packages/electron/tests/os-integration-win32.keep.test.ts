/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Koffi } from '../src/main/os-integration/koffi.type';
import { registerOsIntegration } from '../src/main/os-integration/register-os-integration';
import { unregisterOsIntegration } from '../src/main/os-integration/unregister-os-integration';
import type { OsIntegrationProduct } from '../src/main/os-integration/os-integration.type';

interface NativeCall {
  name: string;
  args: unknown[];
}

const native = vi.hoisted(() => ({ calls: [] as NativeCall[], codes: {} as Record<string, number>, koffi: null as Koffi | null }));
const spawned = vi.hoisted(() => ({ names: [] as string[] }));

vi.mock('../src/main/os-integration/load-koffi', () => ({ loadKoffi: () => native.koffi }));
vi.mock('child_process', () => {
  const spy = (name: string) => (): never => {
    spawned.names.push(name);
    throw new Error(`${name} must not run`);
  };
  return { spawn: spy('spawn'), spawnSync: spy('spawnSync'), exec: spy('exec'), execSync: spy('execSync'), execFile: spy('execFile'), execFileSync: spy('execFileSync'), fork: spy('fork') };
});

const fakeKoffi = (): Koffi => ({
  load: () => ({
    func: (signature: string) => {
      const name = /(\w+)\(/.exec(signature)?.[1] ?? signature;
      return (...args: unknown[]) => {
        native.calls.push({ name, args });
        if (name === 'RegCreateKeyExW') (args[7] as number[])[0] = 4242;
        return native.codes[name] ?? 0;
      };
    },
  }),
  decode: Object.assign(() => null, { string16: () => '' }),
});

const PRODUCT: OsIntegrationProduct = {
  id: 'my-app',
  name: 'My App',
  protocols: [{ scheme: 'my-app' }],
  fileAssociations: [{ ext: 'MYPACK', name: 'Music Pack', progId: 'MyApp.Pack', mimeType: 'application/x-mypack' }],
};

const EXE = 'C:\\Users\\me\\AppData\\Local\\my-app\\current\\My App.exe';
const realPlatform = process.platform;
const setPlatform = (value: string): void => {
  Object.defineProperty(process, 'platform', { value, configurable: true });
};

const calls = (name: string): NativeCall[] => native.calls.filter((call) => call.name === name);

const written = (): { key: string; name: unknown; text: string }[] => {
  const keys = new Map<number, string>();
  const writes: { key: string; name: unknown; text: string }[] = [];
  for (const { name, args } of native.calls) {
    if (name === 'RegCreateKeyExW') keys.set(4242, String(args[1]));
    if (name === 'RegSetValueExW') writes.push({ key: keys.get(4242) ?? '', name: args[1], text: (args[4] as Buffer).toString('utf16le').replace(/\0$/, '') });
  }
  return writes;
};

beforeEach(() => {
  native.calls.length = 0;
  native.codes = {};
  native.koffi = fakeKoffi();
  spawned.names.length = 0;
  setPlatform('win32');
  Object.defineProperty(process, 'resourcesPath', { value: 'C:/no-such-resources', configurable: true });
});

afterEach(() => {
  setPlatform(realPlatform);
  Reflect.deleteProperty(process, 'resourcesPath');
});

describe('registering with Windows through direct calls', () => {
  it('writes each key and value, then tells the shell once, without any child process', () => {
    expect(registerOsIntegration(PRODUCT, EXE)).toEqual({ success: true });
    const creates = calls('RegCreateKeyExW').map((call) => call.args[1]);
    expect(creates).toContain('Software\\Classes\\my-app');
    expect(creates).toContain('Software\\Classes\\my-app\\shell\\open\\command');
    expect(creates).toContain('Software\\Classes\\.mypack\\OpenWithProgids');
    expect(calls('RegCloseKey')).toHaveLength(creates.length);
    expect(calls('RegCreateKeyExW')[0]?.args[0]).toBe(-2_147_483_647);
    const writes = written();
    expect(writes).toContainEqual({ key: 'Software\\Classes\\my-app', name: null, text: 'URL:My App' });
    expect(writes).toContainEqual({ key: 'Software\\Classes\\my-app', name: 'URL Protocol', text: '' });
    expect(writes.some((write) => write.text === `"${EXE}" "%1"`)).toBe(true);
    expect(calls('SHChangeNotify')).toEqual([{ name: 'SHChangeNotify', args: [0x08_00_00_00, 0x10_00, null, null] }]);
    expect(spawned.names).toEqual([]);
  });

  it('stops at the first failed key and says which call failed', () => {
    native.codes = { RegSetValueExW: 5 };
    const result = registerOsIntegration(PRODUCT, EXE);
    expect(result.success).toBe(false);
    expect(result.success ? '' : result.error).toBe('registering My App with Windows failed at Software\\Classes\\my-app: RegSetValueExW failed with code 5');
    expect(calls('RegSetValueExW')).toHaveLength(1);
    expect(calls('RegCloseKey')).toHaveLength(1);
    expect(calls('SHChangeNotify')).toHaveLength(0);
  });

  it('returns an error, never throws, when the binding is missing or a call throws', () => {
    native.koffi = null;
    expect(registerOsIntegration(PRODUCT, EXE)).toEqual({ success: false, error: 'registering My App with Windows failed: the native Windows binding (koffi) is not installed' });
    native.koffi = { load: () => ({ func: () => (): never => { throw new Error('boom'); } }) };
    const result = registerOsIntegration(PRODUCT, EXE);
    expect(result.success ? '' : result.error).toContain('boom');
    expect(spawned.names).toEqual([]);
  });

  it('does nothing when the product has no protocol or file type, and nothing off Windows', () => {
    expect(registerOsIntegration({ ...PRODUCT, protocols: [], fileAssociations: [] }, EXE)).toEqual({ success: true });
    setPlatform('linux');
    expect(registerOsIntegration(PRODUCT, EXE)).toEqual({ success: true });
    expect(native.calls).toEqual([]);
  });
});

describe('unregistering from Windows through direct calls', () => {
  it('deletes the key trees and the progId value, then tells the shell once', () => {
    unregisterOsIntegration(PRODUCT);
    expect(calls('RegDeleteTreeW').map((call) => call.args[1])).toEqual(['Software\\Classes\\my-app', 'Software\\Classes\\MyApp.Pack']);
    expect(calls('RegDeleteKeyValueW').map((call) => call.args.slice(1))).toEqual([['Software\\Classes\\.mypack\\OpenWithProgids', 'MyApp.Pack']]);
    expect(calls('SHChangeNotify')).toHaveLength(1);
    expect(spawned.names).toEqual([]);
  });

  it('treats a missing key as removed and keeps going when one removal fails', () => {
    native.codes = { RegDeleteTreeW: 2, RegDeleteKeyValueW: 5 };
    expect(() => unregisterOsIntegration(PRODUCT)).not.toThrow();
    expect(calls('RegDeleteTreeW')).toHaveLength(2);
    expect(calls('SHChangeNotify')).toHaveLength(1);
  });

  it('does nothing without the binding or off Windows', () => {
    native.koffi = null;
    expect(() => unregisterOsIntegration(PRODUCT)).not.toThrow();
    setPlatform('linux');
    native.koffi = fakeKoffi();
    unregisterOsIntegration(PRODUCT);
    expect(native.calls).toEqual([]);
    expect(spawned.names).toEqual([]);
  });
});
