/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DocumentsPort, Platform, RecentDocument, RecoverableSnapshot } from '@drizztdourden08/brock-core';
import type { MenuItem } from '../src/menu/menu.type';
import { useRecentMenu } from '../src/documents/useRecentMenu';
import { useRecentDocumentsStore } from '../src/documents/useRecentDocumentsStore';
import { useRecoverableStore } from '../src/documents/useRecoverableStore';
import { platformState } from '../src/platform/platform-state';

const roots: Root[] = [];
const A: RecentDocument = { path: 'C:\\art\\a.bxel', name: 'a.bxel', lastOpened: 2 };
const B: RecentDocument = { path: 'C:\\art\\b.bxel', name: 'b.bxel', lastOpened: 1 };
const SNAP: RecoverableSnapshot = { key: 'doc-1', name: 'sprite', path: null, savedAt: 5, size: 2 };

const documents = {
  recent: vi.fn<() => Promise<RecentDocument[]>>(),
  clearRecent: vi.fn<() => Promise<void>>(),
  openRecent: vi.fn<(path: string) => Promise<string | null>>(),
  recoverable: vi.fn<() => Promise<RecoverableSnapshot[]>>(),
  restoreSnapshot: vi.fn<(key: string) => Promise<Uint8Array | null>>(),
  discardSnapshot: vi.fn<(key: string) => Promise<void>>(),
};

const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve(); });

beforeEach(() => {
  platformState.platform = { documents: documents as Partial<DocumentsPort> as DocumentsPort } as Partial<Platform> as Platform;
  documents.recent.mockResolvedValue([A, B]);
  documents.clearRecent.mockResolvedValue(undefined);
  documents.openRecent.mockImplementation((path) => Promise.resolve(path));
  documents.recoverable.mockResolvedValue([SNAP]);
  documents.restoreSnapshot.mockResolvedValue(new Uint8Array([8, 9]));
  documents.discardSnapshot.mockResolvedValue(undefined);
  useRecentDocumentsStore.setState({ recent: [] });
  useRecoverableStore.setState({ snapshots: [] });
});

afterEach(() => {
  for (const root of roots.splice(0)) act(() => root.unmount());
  document.body.replaceChildren();
  platformState.platform = null;
  for (const fn of Object.values(documents)) fn.mockReset();
});

describe('the recent documents store', () => {
  it('loads the list and clears it', async () => {
    await useRecentDocumentsStore.getState().refresh();
    expect(useRecentDocumentsStore.getState().recent).toEqual([A, B]);
    await useRecentDocumentsStore.getState().clear();
    expect(useRecentDocumentsStore.getState().recent).toEqual([]);
    expect(documents.clearRecent).toHaveBeenCalledTimes(1);
  });

  it('reopens through the port and reloads the list, keeping null for a missing file', async () => {
    expect(await useRecentDocumentsStore.getState().open(A.path)).toBe(A.path);
    documents.openRecent.mockResolvedValue(null);
    documents.recent.mockResolvedValue([B]);
    expect(await useRecentDocumentsStore.getState().open(A.path)).toBeNull();
    expect(useRecentDocumentsStore.getState().recent).toEqual([B]);
  });

  it('reads an empty list when the port fails', async () => {
    documents.recent.mockRejectedValue(new Error('gone'));
    await useRecentDocumentsStore.getState().refresh();
    expect(useRecentDocumentsStore.getState().recent).toEqual([]);
  });
});

describe('the Recent menu entry', () => {
  const mountMenu = (onOpen: (path: string) => void): { current: () => MenuItem } => {
    let latest: MenuItem | null = null;
    const Probe = () => {
      latest = useRecentMenu({ onOpen });
      return null;
    };
    const root = createRoot(document.body.appendChild(document.createElement('div')));
    roots.push(root);
    act(() => root.render(createElement(Probe)));
    return { current: () => { if (latest === null) throw new Error('not rendered'); return latest; } };
  };

  it('builds one item per recent file and a clear item', async () => {
    const menu = mountMenu(vi.fn());
    await flush();
    const children = menu.current().children ?? [];
    expect(menu.current().label).toBe('Recent');
    expect(children.map((child) => (child === 'separator' ? child : child.label))).toEqual(['a.bxel', 'b.bxel', 'separator', 'Clear recent documents']);
  });

  it('shows a disabled line while the list is empty', async () => {
    documents.recent.mockResolvedValue([]);
    const menu = mountMenu(vi.fn());
    await flush();
    expect(menu.current().children).toEqual([{ key: 'recent-none', label: 'No recent documents', disabled: true }]);
  });

  it('hands the app the allowed path, and nothing when the file is gone', async () => {
    const onOpen = vi.fn();
    const menu = mountMenu(onOpen);
    await flush();
    const first = menu.current().children?.[0];
    if (first === undefined || first === 'separator') throw new Error('no first item');
    await act(async () => { first.onClick?.(); await Promise.resolve(); });
    expect(onOpen).toHaveBeenCalledWith(A.path);
    documents.openRecent.mockResolvedValue(null);
    await act(async () => { first.onClick?.(); await Promise.resolve(); });
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});

describe('the recoverable store', () => {
  it('lists the snapshots and restores the bytes of one', async () => {
    await useRecoverableStore.getState().refresh();
    expect(useRecoverableStore.getState().snapshots).toEqual([SNAP]);
    const recovered = await useRecoverableStore.getState().restore('doc-1');
    expect(recovered?.snapshot).toEqual(SNAP);
    expect([...(recovered?.bytes ?? [])]).toEqual([8, 9]);
    expect(await useRecoverableStore.getState().restore('other')).toBeNull();
  });

  it('discards a snapshot and reloads the list', async () => {
    await useRecoverableStore.getState().refresh();
    documents.recoverable.mockResolvedValue([]);
    await useRecoverableStore.getState().discard('doc-1');
    expect(documents.discardSnapshot).toHaveBeenCalledWith('doc-1');
    expect(useRecoverableStore.getState().snapshots).toEqual([]);
  });
});
