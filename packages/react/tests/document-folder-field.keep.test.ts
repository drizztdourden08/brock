/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import type { DocumentsPort, Platform } from '@drizztdourden08/brock-core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DocumentFolderField } from '../src/documents/DocumentFolderField';
import { platformState } from '../src/platform/platform-state';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

let root: Root | null = null;

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.innerHTML = '';
  platformState.platform = null;
});

const settle = (): Promise<void> => act(async () => { await Promise.resolve(); });

const mount = async (documents: Partial<DocumentsPort>, props: { value: string | null; roots?: readonly string[]; onChange?: (path: string | null) => void }): Promise<HTMLElement> => {
  platformState.platform = { documents, filePicker: {} } as Platform;
  const host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  act(() => root?.render(createElement(DocumentFolderField, { label: 'Destination', onChange: () => undefined, ...props })));
  await settle();
  return host;
};

const browseButton = (host: HTMLElement): HTMLButtonElement => {
  const button = [...host.querySelectorAll('button')].find((candidate) => /browse|change/i.test(candidate.textContent ?? ''));
  if (!button) throw new Error('no Browse button');
  return button;
};

describe('K1 DocumentFolderField', { tags: ['critical'] }, () => {
  it('shows the reason of a refused folder under the field', async () => {
    const canWrite = vi.fn(() => Promise.resolve({ ok: false as const, reason: 'The folder may not be changed' }));
    const host = await mount({ canWrite }, { value: 'C:\\art\\.git' });
    expect(canWrite).toHaveBeenCalledWith('C:\\art\\.git');
    expect(host.textContent).toContain('The folder may not be changed');
  });

  it('shows no reason for a folder that can be written', async () => {
    const canWrite = vi.fn(() => Promise.resolve({ ok: true as const, path: 'C:\\art' }));
    const host = await mount({ canWrite }, { value: 'C:\\art' });
    expect(canWrite).toHaveBeenCalledWith('C:\\art');
    expect(host.querySelector('[role="alert"]')).toBeNull();
  });

  it('does not check an empty value', async () => {
    const canWrite = vi.fn(() => Promise.resolve({ ok: true as const, path: '' }));
    await mount({ canWrite }, { value: null });
    expect(canWrite).not.toHaveBeenCalled();
  });

  it('browses from the first root and hands the picked folder to onChange', async () => {
    const openFolder = vi.fn(() => Promise.resolve<string | null>('C:\\art\\out'));
    const onChange = vi.fn();
    const host = await mount({ openFolder }, { value: null, roots: ['C:\\art'], onChange });
    act(() => browseButton(host).click());
    await settle();
    expect(openFolder).toHaveBeenCalledWith({ defaultPath: 'C:\\art' });
    expect(onChange).toHaveBeenCalledWith('C:\\art\\out');
  });

  it('offers the roots as a list only when there are some', async () => {
    const withRoots = await mount({}, { value: null, roots: ['C:\\art', 'C:\\art\\sprites'] });
    expect(withRoots.querySelector('[aria-label="Folders of the project"]')).not.toBeNull();
    act(() => root?.unmount());
    root = null;
    document.body.innerHTML = '';
    const withoutRoots = await mount({}, { value: null });
    expect(withoutRoots.querySelector('[aria-label="Folders of the project"]')).toBeNull();
  });
});
