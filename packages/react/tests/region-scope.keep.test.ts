/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { focusedId, markRegion, mount, next, SHELL, useShellRegionCommands } from './region-fixtures';

describe('what joins the region cycle', () => {
  useShellRegionCommands();

  it('adds an element an app marks with focusRegion, even inside the main area', () => {
    mount(SHELL.replace('<p>Reading only</p>', '<div id="canvas"><div id="surface" tabindex="0"></div></div>'));
    markRegion(document.getElementById('canvas'), 'canvas', 'Sprite canvas');
    next();
    next();
    next();
    expect(focusedId()).toBe('tool-b');
    next();
    expect(focusedId()).toBe('surface');
    next();
    expect(focusedId()).toBe('menu');
  });

  it('works from inside a text field', () => {
    mount(`<input id="name" />${SHELL}`);
    const input = document.getElementById('name');
    input?.focus();
    next(input ?? document);
    expect(focusedId()).toBe('menu');
  });

  it('stays inside an open modal dialog', () => {
    mount(`${SHELL}<div role="dialog" aria-modal="true"><div role="toolbar" aria-label="Dialog tools"><button id="d1">Do</button></div><div role="region" aria-label="Details"><button id="d2">More</button></div></div>`);
    next();
    expect(focusedId()).toBe('d1');
    next();
    expect(focusedId()).toBe('d2');
    next();
    expect(focusedId()).toBe('d1');
  });
});
