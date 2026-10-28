/* @layer renderer-shell @kind test */
import { vi } from 'vitest';

const fakeMain = (initial: Record<string, unknown> = {}) => {
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

export { fakeMain };
