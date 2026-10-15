/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPlatform } from '../src/platform/get-platform';
import { platformState } from '../src/platform/platform-state';
import { setPlatformPorts } from '../src/platform/set-platform-ports';
import { setDataDomains } from '../src/storage/set-data-domains';

interface Entry { data: string; directory: boolean }

const fakeFilesystem = () => {
  const disk = new Map<string, Entry>();
  const key = (options: { path: string; directory: string }) => `${options.directory}:${options.path}`;
  const missing = () => Promise.reject(new Error('File does not exist'));
  return {
    disk,
    plugin: {
      addListener: () => ({ remove: () => undefined }),
      readFile: (options: { path: string; directory: string }) => {
        const found = disk.get(key(options));
        return found && !found.directory ? Promise.resolve({ data: found.data }) : missing();
      },
      writeFile: (options: { path: string; directory: string; data: string }) => { disk.set(key(options), { data: options.data, directory: false }); return Promise.resolve({}); },
      readdir: (options: { path: string; directory: string }) => Promise.resolve({
        files: [...disk.entries()]
          .filter(([name]) => name.startsWith(`${key(options)}/`) && !name.slice(key(options).length + 1).includes('/'))
          .map(([name, entry]) => ({ name: name.slice(key(options).length + 1), type: entry.directory ? 'directory' : 'file', size: entry.data.length })),
      }),
      stat: (options: { path: string; directory: string }) => {
        const found = disk.get(key(options));
        return found ? Promise.resolve({ name: options.path, type: found.directory ? 'directory' : 'file', size: found.data.length, mtime: 5 }) : missing();
      },
      mkdir: (options: { path: string; directory: string }) => { disk.set(key(options), { data: '', directory: true }); return Promise.resolve(); },
      rmdir: (options: { path: string; directory: string }) => { disk.delete(key(options)); return Promise.resolve(); },
      deleteFile: (options: { path: string; directory: string }) => { disk.delete(key(options)); return Promise.resolve(); },
      getUri: () => Promise.resolve({ uri: 'file:///data/user/0/app/files' }),
    },
  };
};

const onAndroid = () => {
  const files = fakeFilesystem();
  const listeners = new Map<string, (data: unknown) => void>();
  const app = { addListener: (name: string, fn: (data: unknown) => void) => { listeners.set(name, fn); return { remove: () => listeners.delete(name) }; }, exitApp: vi.fn(() => Promise.resolve()) };
  const haptics = { addListener: () => ({ remove: () => undefined }), vibrate: vi.fn(() => Promise.resolve()) };
  const events = new EventTarget();
  vi.stubGlobal('window', {
    Capacitor: { isNativePlatform: () => true, getPlatform: () => 'android', Plugins: { Filesystem: files.plugin, App: app, Haptics: haptics } },
    addEventListener: events.addEventListener.bind(events),
    dispatchEvent: events.dispatchEvent.bind(events),
  });
  platformState.platform = null;
  platformState.ports = {};
  return { files, app, haptics, listeners };
};

const backEdge = (detail: string): void => { window.dispatchEvent(new CustomEvent('brock:back', { detail })); };

afterEach(() => {
  setDataDomains([]);
  vi.unstubAllGlobals();
  platformState.platform = null;
  platformState.ports = {};
});

describe('the Capacitor host', () => {
  it('runs on its own factory: a mobile touch host with the title bar and no window controls', () => {
    onAndroid();
    const { info, capabilities } = getPlatform();
    expect(info).toMatchObject({ host: 'capacitor', os: 'android', formFactor: 'mobile', input: 'touch' });
    expect(capabilities).toMatchObject({ titleBar: true, windowChrome: false, hapticFeedback: true, selfUpdate: false });
  });

  it('keeps the app files in the app data folder through the Filesystem plugin', async () => {
    const { files } = onAndroid();
    const store = getPlatform().files;
    await store.writeText('profiles/p1/config.json', '{"a":1}');
    await store.writeBytes('saves/slot.bin', new Uint8Array([1, 2, 250]));
    expect(await store.readText('profiles/p1/config.json')).toBe('{"a":1}');
    expect([...(await store.readBytes('saves/slot.bin')) ?? []]).toEqual([1, 2, 250]);
    expect(await store.readText('missing.json')).toBeNull();
    expect(await store.exists('saves/slot.bin')).toBe(true);
    expect(await store.stat('saves/slot.bin')).toMatchObject({ isDirectory: false, mtimeMs: 5 });
    await store.remove('saves/slot.bin');
    expect(await store.exists('saves/slot.bin')).toBe(false);
    expect(files.disk.has('DATA:profiles/p1/config.json')).toBe(true);
    expect((await getPlatform().storage.getLocation()).osLabel).toBe('Android (app storage)');
  });

  it('drives the device and the back button through the App and Haptics plugins', () => {
    const { app, haptics, listeners } = onAndroid();
    const { device, window: win } = getPlatform();
    device.vibrate(5000);
    expect(haptics.vibrate).toHaveBeenCalledWith({ duration: 1000 });
    const back = vi.fn();
    const stop = device.onBackButton(back);
    listeners.get('backButton')?.({});
    expect(back).toHaveBeenCalledWith('left');
    stop();
    win.close();
    expect(app.exitApp).toHaveBeenCalled();
  });

});

describe('the Capacitor host on a phone', () => {
  it('takes the ports a module or the app gives for capacitor', () => {
    onAndroid();
    const own = { getSummary: () => Promise.resolve({ location: { path: 'x', osLabel: 'Mine', canReveal: false }, domains: [], totalBytes: 0 }), getLocation: vi.fn(), reveal: vi.fn(), revealProfile: vi.fn() };
    setPlatformPorts({ capacitor: { storage: () => own } });
    expect(getPlatform().storage).toBe(own);
  });

  it('hands the edge of the back gesture over, and leaves the app when nothing listens', () => {
    const { app } = onAndroid();
    const { device } = getPlatform();
    const back = vi.fn();
    backEdge('right');
    expect(app.exitApp).toHaveBeenCalledOnce();
    const stop = device.onBackButton(back);
    backEdge('right');
    backEdge('left');
    backEdge('up');
    expect(back.mock.calls).toEqual([['right'], ['left'], ['left']]);
    expect(app.exitApp).toHaveBeenCalledOnce();
    stop();
    backEdge('left');
    expect(back).toHaveBeenCalledTimes(3);
  });

  it('filters the file picker by extension, and opens it unfiltered with anyType for an extension Android has no type for', async () => {
    onAndroid();
    const input = { type: '', accept: '', files: null as File[] | null, onchange: null as (() => void) | null, click: vi.fn() };
    vi.stubGlobal('document', { createElement: () => input });
    void getPlatform().filePicker.pickFile({ extensions: ['sav', 'zip'] });
    expect(input.accept).toBe('.sav,.zip');
    input.accept = '';
    const picked = getPlatform().filePicker.pickFile({ extensions: ['sav', 'zip'], anyType: true });
    expect(input.accept).toBe('');
    expect(input.click).toHaveBeenCalled();
    input.files = [new File([new Uint8Array([1, 2])], 'slot.sav')];
    input.onchange?.();
    expect(await picked).toMatchObject({ name: 'slot.sav', bytes: new Uint8Array([1, 2]) });
  });

  it('sums each declared data domain for the Storage page', async () => {
    const { files } = onAndroid();
    setDataDomains([{ domain: 'saves', label: 'Saves', dir: 'saves' }, { domain: 'media', label: 'Media', dir: 'media' }]);
    const store = getPlatform().files;
    await store.writeText('saves/a.json', '12345');
    await store.writeText('saves/b.json', '123');
    files.disk.set('DATA:saves/old', { data: '', directory: true });
    files.disk.set('DATA:saves/old/c.bin', { data: '1234567', directory: false });
    const summary = await getPlatform().storage.getSummary();
    expect(summary.location.osLabel).toBe('Android (app storage)');
    expect(summary.domains).toEqual([{ domain: 'saves', label: 'Saves', count: 3, bytes: 15 }, { domain: 'media', label: 'Media', count: 0, bytes: 0 }]);
    expect(summary.totalBytes).toBe(15);
  });

});
