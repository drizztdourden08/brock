/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StoragePage } from '../src/storage/StoragePage';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const LOCATION = { path: 'C:/Data', custom: false };

let root: Root | null = null;

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.innerHTML = '';
  Reflect.deleteProperty(window, 'api');
});

const settle = async (): Promise<void> => {
  await act(async () => { await new Promise((resolve) => { setTimeout(resolve, 0); }); });
};

describe('StoragePage when the data folder cannot be read', () => {
  it('shows a LoadError box with the raw error behind Details, and Retry reads the folder again', async () => {
    const listDataDomains = vi.fn()
      .mockRejectedValueOnce(new Error('EACCES: permission denied, scandir C:/Data'))
      .mockResolvedValue([]);
    Object.assign(window, { api: { listDataDomains, getDataLocation: vi.fn().mockResolvedValue(LOCATION), getDomainUsage: vi.fn() } });
    const host = document.createElement('div');
    document.body.append(host);
    root = createRoot(host);
    act(() => root?.render(createElement(StoragePage)));
    await settle();

    const box = host.querySelector('.load-error--box');
    expect(box?.textContent).toContain('Could not read the data folder.');
    expect(host.querySelector('details')?.textContent).toContain('EACCES: permission denied');
    const retry = [...host.querySelectorAll('button')].find((button) => button.textContent.includes('Retry'));
    act(() => retry?.click());
    await settle();
    expect(listDataDomains).toHaveBeenCalledTimes(2);
    expect(host.querySelector('.load-error')).toBeNull();
  });
});
