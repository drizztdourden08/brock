/* @layer renderer-shell @kind test */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { fakeMain } from './ui-views-fake-main';

const freshModules = async () => {
  vi.resetModules();
  const { profileViews } = await import('../src/widgets/profile-views');
  const { uiViews } = await import('../src/stores/ui-views');
  return { profileViews, uiViews };
};

beforeAll(async () => {
  await import('../src/widgets/profile-views');
}, 60_000);

afterEach(() => {
  vi.doUnmock('../src/platform/get-platform');
  vi.unstubAllGlobals();
});

describe('ui-views writes', () => {
  it('sends only the keys that changed, so an app key written by someone else survives', async () => {
    const disk = fakeMain({ 'profile:p1': { screens: {} }, 'app:layout-editor': { zoom: 2 } });
    const { profileViews } = await freshModules();
    await profileViews.patch('p1', { widgetPrefs: { log: { level: 'warn' } } });
    disk.file['app:other'] = { written: 'by the app since Brock loaded the file' };
    profileViews.flush();
    expect(disk.wholeWrites).toBe(0);
    expect(disk.patches).toEqual([{ 'profile:p1': { screens: {}, widgetPrefs: { log: { level: 'warn' } } } }]);
    expect(disk.file['app:layout-editor']).toEqual({ zoom: 2 });
    expect(disk.file['app:other']).toEqual({ written: 'by the app since Brock loaded the file' });
  });

  it('gives the app its own keys to read, write and remove, and keeps the Brock keys to Brock', async () => {
    const disk = fakeMain({ 'app:editor': { zoom: 2 } });
    const { uiViews } = await freshModules();
    expect(await uiViews.read('app:editor', null)).toEqual({ zoom: 2 });
    expect(await uiViews.read('app:missing', 'fallback')).toBe('fallback');
    await uiViews.write('app:panel', { open: true });
    await uiViews.remove('app:editor');
    uiViews.flush();
    expect(disk.patches).toEqual([{ 'app:panel': { open: true }, 'app:editor': null }]);
    expect(disk.file).toEqual({ 'app:panel': { open: true } });
    await expect(uiViews.write('profile:p1', {})).rejects.toThrow(/Brock's/);
  });
});

describe('ui-views on Capacitor', () => {
  it('live in ui-views.json of the file store, so they outlast a restart', async () => {
    const disk = new Map<string, string>([['ui-views.json', JSON.stringify({ 'app:editor': { zoom: 2 } })]]);
    const files = {
      readText: (path: string) => Promise.resolve(disk.get(path) ?? null),
      writeText: (path: string, text: string) => { disk.set(path, text); return Promise.resolve(); },
    };
    vi.stubGlobal('window', { Capacitor: { isNativePlatform: () => true }, location: { search: '' } });
    vi.resetModules();
    vi.doMock('../src/platform/get-platform', () => ({ getPlatform: () => ({ files }) }));
    const { uiViews } = await import('../src/stores/ui-views');
    expect(await uiViews.read('app:editor', null)).toEqual({ zoom: 2 });
    await uiViews.write('app:panel', { open: true });
    uiViews.flush();
    await vi.waitFor(() => expect(JSON.parse(disk.get('ui-views.json') ?? '{}')).toEqual({ 'app:editor': { zoom: 2 }, 'app:panel': { open: true } }));
    vi.resetModules();
    const again = await import('../src/stores/ui-views');
    expect(await again.uiViews.read('app:panel', null)).toEqual({ open: true });
  });
});
