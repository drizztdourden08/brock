/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';

const fakeMain = (initial: Record<string, unknown>) => {
  const disk = { file: structuredClone(initial), patches: [] as Record<string, unknown>[], wholeWrites: 0 };
  const api = {
    loadUiViews: () => Promise.resolve(structuredClone(disk.file)),
    saveUiViews: () => { disk.wholeWrites += 1; return Promise.resolve(); },
    patchUiViews: (entries: Record<string, unknown>) => {
      disk.patches.push(structuredClone(entries));
      for (const [key, value] of Object.entries(entries)) {
        if (value === null) Reflect.deleteProperty(disk.file, key);
        else disk.file[key] = structuredClone(value);
      }
      return Promise.resolve();
    },
  };
  vi.stubGlobal('window', { api, location: { search: '' } });
  return disk;
};

const freshModules = async () => {
  vi.resetModules();
  const { profileViews } = await import('../src/widgets/profile-views');
  const { uiViews } = await import('../src/stores/ui-views');
  return { profileViews, uiViews };
};

afterEach(() => {
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
