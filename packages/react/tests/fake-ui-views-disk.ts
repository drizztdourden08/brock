/* @layer renderer-shell @kind test */
import { vi } from 'vitest';

const fakeDisk = (initial: Record<string, unknown>) => {
  const disk = { file: structuredClone(initial), saves: 0 };
  const listeners = new Map<string, () => void>();
  const api = {
    loadUiViews: () => Promise.resolve(structuredClone(disk.file)),
    saveUiViews: (data: Record<string, unknown>) => {
      disk.file = structuredClone(data);
      disk.saves += 1;
      return Promise.resolve();
    },
  };
  vi.stubGlobal('window', {
    api,
    location: { search: '' },
    addEventListener: (name: string, fn: () => void) => listeners.set(name, fn),
    removeEventListener: (name: string) => listeners.delete(name),
  });
  return { disk, listeners };
};

const settle = async (): Promise<void> => {
  for (let i = 0; i < 5; i += 1) await Promise.resolve();
};

export { fakeDisk, settle };
