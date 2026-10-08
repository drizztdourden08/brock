/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { ReleaseNotesPanel } from '../src/compounds/ReleaseNotesPanel';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const NOTE = '# Atlas v1.2.0\n\nThe map opens where you left it.\n';

describe('ReleaseNotesPanel with a Tessera that has no Markdown part', () => {
  it('shows a markdown note as text that keeps its line breaks', () => {
    const host = document.createElement('div');
    document.body.append(host);
    act(() => { createRoot(host).render(createElement(ReleaseNotesPanel, { markdown: true, children: NOTE })); });
    expect(host.querySelector('.release-notes-panel__text')?.textContent).toBe(NOTE);
    expect(host.querySelector('h4')?.textContent).toBe('Release notes');
    host.remove();
  });
});
