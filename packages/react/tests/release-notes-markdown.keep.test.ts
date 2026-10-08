/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ReleaseNotesPanel } from '../src/compounds/ReleaseNotesPanel';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const NOTE = [
  '<!-- release-notes: kept out -->',
  '# Atlas v1.2.0',
  '',
  'The map opens where you left it.',
  '',
  '## View',
  '',
  '- The map opens on the last place you looked at.',
  '- The [guide](https://example.com/guide) shows each layer.',
  '',
].join('\n');

const roots: Root[] = [];

afterEach(() => {
  act(() => { roots.splice(0).forEach((root) => root.unmount()); });
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

const render = (props: { markdown?: boolean; onOpenLink?: (href: string) => void }, children: ReactNode = NOTE): HTMLElement => {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  roots.push(root);
  act(() => root.render(createElement(ReleaseNotesPanel, { ...props, children })));
  return host;
};

describe('ReleaseNotesPanel with markdown', () => {
  it('draws the note with Tessera Markdown: no # title, ## sections as h4 under the h3 box title, a list and links', () => {
    const host = render({ markdown: true });
    expect(host.querySelector('h3')?.textContent).toBe('Release notes');
    expect(host.querySelector('.markdown.release-notes-panel__markdown')?.getAttribute('data-size')).toBe('sm');
    expect(host.textContent).not.toContain('Atlas v1.2.0');
    expect(host.textContent).not.toContain('kept out');
    expect(host.querySelector('h4')?.textContent).toBe('View');
    expect(host.querySelectorAll('li')).toHaveLength(2);
    expect(host.querySelector('a')?.textContent).toBe('guide');
  });

  it('opens a link through onOpenLink and leaves the page where it is', () => {
    const opened: string[] = [];
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const host = render({ markdown: true, onOpenLink: (href) => { opened.push(href); } });
    act(() => host.querySelector('a')?.click());
    expect(opened).toEqual(['https://example.com/guide']);
    expect(open).not.toHaveBeenCalled();
  });

  it('opens a link in the browser through openExternal when no opener is given', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const host = render({ markdown: true });
    act(() => host.querySelector('a')?.click());
    expect(open).toHaveBeenCalledWith('https://example.com/guide', '_blank', 'noopener');
  });

  it('keeps plain text without markdown, and elements as given', () => {
    expect(render({}).querySelector('.release-notes-panel__text')?.textContent).toBe(NOTE);
    const host = render({ markdown: true }, createElement('em', null, 'Formatted'));
    expect(host.querySelector('em')?.textContent).toBe('Formatted');
    expect(host.querySelector('.markdown')).toBeNull();
  });
});
