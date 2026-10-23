/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Platform } from '@drizztdourden08/brock-core';
import { composeTitle } from '../src/document-title/compose-title';
import { setDocumentTitle } from '../src/document-title/set-document-title';
import { useDocumentTitle } from '../src/document-title/useDocumentTitle';
import { useDocumentTitleStore } from '../src/document-title/useDocumentTitleStore';
import { useWindowTitleSync } from '../src/document-title/useWindowTitleSync';
import { PlatformContext } from '../src/platform/platform-context';
import type { DocumentTitle } from '../src/document-title/document-title.type';

const roots: Root[] = [];

const mount = (element: ReturnType<typeof createElement>): Root => {
  const root = createRoot(document.body.appendChild(document.createElement('div')));
  roots.push(root);
  act(() => root.render(element));
  return root;
};

const Editor = (props: { document: DocumentTitle | null }) => {
  useDocumentTitle(props.document);
  return null;
};

const Sync = () => {
  useWindowTitleSync('Bxel');
  return null;
};

afterEach(() => {
  for (const root of roots.splice(0)) act(() => root.unmount());
  document.body.replaceChildren();
  setDocumentTitle(null);
});

describe('composeTitle', () => {
  it('shows the app title alone when no document is open', () => {
    expect(composeTitle('Bxel', null)).toBe('Bxel');
    expect(composeTitle('Bxel', { name: '  ', dirty: true })).toBe('Bxel');
  });

  it('puts the document name first and marks unsaved changes', () => {
    expect(composeTitle('Bxel', { name: 'sprite', dirty: false })).toBe('sprite - Bxel');
    expect(composeTitle('Bxel', { name: 'sprite', dirty: true })).toBe('sprite * - Bxel');
  });
});

describe('useDocumentTitle', () => {
  it('sets the document, follows the dirty mark and clears when the editor goes away', () => {
    const root = mount(createElement(Editor, { document: { name: 'sprite', dirty: false } }));
    expect(useDocumentTitleStore.getState().document).toEqual({ name: 'sprite', dirty: false });
    act(() => root.render(createElement(Editor, { document: { name: 'sprite', dirty: true } })));
    expect(useDocumentTitleStore.getState().document).toEqual({ name: 'sprite', dirty: true });
    act(() => root.render(createElement(Editor, { document: null })));
    expect(useDocumentTitleStore.getState().document).toBeNull();
    act(() => root.render(createElement(Editor, { document: { name: 'other', dirty: false } })));
    act(() => root.unmount());
    roots.pop();
    expect(useDocumentTitleStore.getState().document).toBeNull();
  });
});

describe('useWindowTitleSync', () => {
  it('sends the composed title to the window on each change and the plain title once cleared', () => {
    const setTitle = vi.fn();
    const controls: Partial<Platform['window']> = { setTitle };
    const platform = { window: controls } as Partial<Platform> as Platform;
    mount(createElement(PlatformContext.Provider, { value: platform }, createElement(Sync)));
    expect(setTitle).not.toHaveBeenCalled();
    act(() => setDocumentTitle({ name: 'sprite', dirty: true }));
    act(() => setDocumentTitle({ name: 'sprite', dirty: false }));
    act(() => setDocumentTitle(null));
    expect(setTitle.mock.calls).toEqual([['sprite * - Bxel'], ['sprite - Bxel'], ['Bxel']]);
  });
});
