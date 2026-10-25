/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { commands } from '../src/commands/commands';
import { rememberFocus } from '../src/regions/remember-focus';
import { REGION_COMMANDS } from '../src/regions/regions.constants';
import { focusedId, mount, next, previous, SHELL, useShellRegionCommands } from './region-fixtures';

describe('region cycling', () => {
  useShellRegionCommands();

  it('is a command with the F6 and Shift+F6 chords, so it shows in the shortcut list and can be rebound', () => {
    expect(commands.chords(REGION_COMMANDS.next)).toEqual(['F6']);
    expect(commands.chords(REGION_COMMANDS.previous)).toEqual(['Shift+F6']);
    commands.remap(REGION_COMMANDS.next, ['Alt+J']);
    expect(commands.chords(REGION_COMMANDS.next)).toEqual(['Alt+J']);
  });

  it('moves focus to the next region on F6 and wraps after the last', () => {
    mount(SHELL);
    next();
    expect(focusedId()).toBe('menu');
    next();
    expect(focusedId()).toBe('rail');
    next();
    expect(focusedId()).toBe('tool-b');
    next();
    expect(document.activeElement?.tagName).toBe('MAIN');
    next();
    expect(focusedId()).toBe('menu');
  });

  it('moves to the previous region on Shift+F6 and wraps before the first', () => {
    mount(SHELL);
    previous();
    expect(document.activeElement?.tagName).toBe('MAIN');
    previous();
    expect(focusedId()).toBe('tool-b');
    document.getElementById('menu')?.focus();
    previous();
    expect(document.activeElement?.tagName).toBe('MAIN');
  });

  it('lands on the region itself when it has no tabbable control', () => {
    mount(SHELL);
    next();
    next();
    next();
    next();
    expect(document.activeElement?.getAttribute('tabindex')).toBe('-1');
  });

  it('lands on the control that had focus last when it returns to a region', () => {
    mount('<div role="toolbar" aria-label="One"><button id="a1">1</button><button id="a2">2</button></div><div role="toolbar" aria-label="Two"><button id="b1">1</button></div>');
    const second = document.getElementById('a2');
    second?.focus();
    rememberFocus(second);
    next();
    expect(focusedId()).toBe('b1');
    next();
    expect(focusedId()).toBe('a2');
  });
});
