/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ReleaseNotesPanel } from '../src/compounds/ReleaseNotesPanel';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const NOTE = '# Atlas v1.2.0\n\nThe map opens where you left it.\n\n## View\n\n- The map opens on the last place you looked at.\n';

const seen = vi.hoisted((): { source: string; onOpenLink?: (href: string) => void }[] => []);

vi.mock('@drizztdourden08/tessera/primitives', async (original) => {
  const { createElement: element } = await import('react');
  return {
    ...(await original<Record<string, unknown>>()),
    Markdown: (props: { source: string; onOpenLink?: (href: string) => void }) => {
      seen.push(props);
      return element('div', { 'data-part': 'markdown' }, props.source);
    },
  };
});

const hosts: HTMLElement[] = [];

afterEach(() => {
  hosts.splice(0).forEach((host) => host.remove());
  seen.splice(0);
});

const render = async (props: { markdown?: boolean; onOpenLink?: (href: string) => void }, children: ReactNode = NOTE): Promise<HTMLElement> => {
  const host = document.createElement('div');
  document.body.append(host);
  hosts.push(host);
  act(() => { createRoot(host).render(createElement(ReleaseNotesPanel, { ...props, children })); });
  return host;
};

describe('ReleaseNotesPanel with a Tessera that exports Markdown', () => {
  it('hands a markdown note to Tessera Markdown, with the link opener', async () => {
    const opened: string[] = [];
    const host = await render({ markdown: true, onOpenLink: (href) => { opened.push(href); } });
    expect(host.querySelector('[data-part="markdown"]')?.textContent).toBe(NOTE);
    expect(host.querySelector('.release-notes-panel__text')).toBeNull();
    seen[0]?.onOpenLink?.('https://example.com/notes');
    expect(opened).toEqual(['https://example.com/notes']);
  });

  it('keeps plain text without markdown, and elements as given', async () => {
    expect((await render({})).querySelector('.release-notes-panel__text')?.textContent).toBe(NOTE);
    expect(seen).toEqual([]);
    const host = await render({ markdown: true }, createElement('em', null, 'Formatted'));
    expect(host.querySelector('em')?.textContent).toBe('Formatted');
  });
});
