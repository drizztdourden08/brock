/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import type { DocumentsPort, Platform } from '@drizztdourden08/brock-core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type * as DndModule from '../src/dnd';
import type { DropTargetOptions, PathDrop } from '../src/dnd';
import { DocumentFolderField } from '../src/documents/DocumentFolderField';
import { platformState } from '../src/platform/platform-state';
import { renderInBody, unmountAll } from './react-roots';

const targets = vi.hoisted((): DropTargetOptions<PathDrop>[] => []);

vi.mock('../src/dnd', async (original) => ({
  ...(await original<typeof DndModule>()),
  useDropTarget: (_ref: unknown, options: DropTargetOptions<PathDrop>): void => {
    targets.push(options);
  },
}));

afterEach(() => {
  unmountAll();
  platformState.platform = null;
  targets.length = 0;
});

const DROP_INFO = { type: 'paths', point: { x: 0, y: 0 }, index: null, source: null };

const osDrop = (paths: PathDrop['paths'], rejected: PathDrop['rejected']): PathDrop => ({ origin: 'os', paths, rejected, entries: [], truncated: false });

const settle = (): Promise<void> => act(async () => { await Promise.resolve(); });

const mount = async (documents: Partial<DocumentsPort>, props: { value: string | null; roots?: readonly string[]; onChange?: (path: string | null) => void }): Promise<HTMLElement> => {
  platformState.platform = { documents, filePicker: {} } as Platform;
  const host = renderInBody(createElement(DocumentFolderField, { label: 'Destination', onChange: () => undefined, ...props }));
  await settle();
  return host;
};

const browseButton = (host: HTMLElement): HTMLButtonElement => {
  const button = [...host.querySelectorAll('button')].find((candidate) => /browse|change/i.test(candidate.textContent));
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
    unmountAll();
    const withoutRoots = await mount({}, { value: null });
    expect(withoutRoots.querySelector('[aria-label="Folders of the project"]')).toBeNull();
  });

  it('takes a dropped folder, then checks it again once main has granted it', async () => {
    const canWrite = vi.fn(() => Promise.resolve({ ok: true as const, path: 'C:/art' }));
    const onChange = vi.fn();
    const host = await mount({ canWrite }, { value: 'C:/art', onChange });
    await act(async () => { targets.at(-1)?.onDrop(osDrop([{ path: 'C:/art', name: 'art', kind: 'folder' }], []), DROP_INFO); await Promise.resolve(); });
    expect(onChange).toHaveBeenCalledWith('C:/art');
    expect(canWrite).toHaveBeenCalledTimes(2);
    expect(host.querySelector('[role="alert"]')).toBeNull();
  });

  it('shows the reason of a refused drop and ignores a dropped file', async () => {
    const onChange = vi.fn();
    const host = await mount({}, { value: null, onChange });
    await act(async () => { targets.at(-1)?.onDrop(osDrop([], [{ name: 'Windows', reason: 'The folder is protected' }]), DROP_INFO); await Promise.resolve(); });
    expect(host.textContent).toContain('The folder is protected');
    await act(async () => { targets.at(-1)?.onDrop(osDrop([{ path: 'C:/a.png', name: 'a.png', kind: 'file' }], []), DROP_INFO); await Promise.resolve(); });
    expect(host.textContent).toContain('Drop a folder');
    expect(onChange).not.toHaveBeenCalled();
  });
});
