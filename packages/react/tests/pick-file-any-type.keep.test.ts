/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AnyTypeOption } from '@drizztdourden08/brock-core';
import { createCapacitorFilePicker } from '../src/platform/hosts/capacitor/capacitor-file-picker';
import { createElectronFactory } from '../src/platform/hosts/electron-factory';
import { createWebFactory } from '../src/platform/hosts/web-factory';

const EXTENSIONS = ['sav', 'zip'];

const browserAccept = (pick: (anyType: AnyTypeOption) => unknown, anyType: AnyTypeOption): string => {
  const input = { type: '', accept: '', files: null, onchange: null, click: vi.fn() };
  vi.stubGlobal('document', { createElement: () => input });
  void pick(anyType);
  return input.accept;
};

const electronFilter = async (anyType: AnyTypeOption): Promise<string[]> => {
  const pickFile = vi.fn((_extensions: string[]) => Promise.resolve(null));
  vi.stubGlobal('window', { api: { pickFile, os: 'win32', isDev: false } });
  await createElectronFactory().ports.filePicker().pickFile({ extensions: EXTENSIONS, anyType });
  return pickFile.mock.calls[0]?.[0] ?? [];
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('pickFile anyType per host', () => {
  it('drops the filter on a phone only when anyType names the mobile form factor or the Capacitor host', () => {
    const phone = (anyType: AnyTypeOption) => createCapacitorFilePicker().pickFile({ extensions: EXTENSIONS, anyType });
    expect(browserAccept(phone, 'mobile')).toBe('');
    expect(browserAccept(phone, { mobile: true })).toBe('');
    expect(browserAccept(phone, 'capacitor')).toBe('');
    expect(browserAccept(phone, { desktop: true })).toBe('.sav,.zip');
    expect(browserAccept(phone, { mobile: true, capacitor: false })).toBe('.sav,.zip');
    expect(browserAccept(phone, true)).toBe('');
    expect(browserAccept(phone, false)).toBe('.sav,.zip');
  });

  it('keeps the filter in the browser and the Electron picker for a mobile-only anyType', async () => {
    const browser = (anyType: AnyTypeOption) => createWebFactory().ports.filePicker().pickFile({ extensions: EXTENSIONS, anyType });
    expect(browserAccept(browser, 'mobile')).toBe('.sav,.zip');
    expect(browserAccept(browser, { mobile: true })).toBe('.sav,.zip');
    expect(browserAccept(browser, { web: true })).toBe('');
    expect(await electronFilter('mobile')).toEqual(EXTENSIONS);
    expect(await electronFilter({ mobile: true })).toEqual(EXTENSIONS);
    expect(await electronFilter({ electron: true })).toEqual([]);
    expect(await electronFilter(true)).toEqual([]);
  });
});
