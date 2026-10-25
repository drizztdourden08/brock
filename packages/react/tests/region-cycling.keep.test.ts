/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { shellCommands } from '../src/app/BrockApp/behavior/shell-commands';
import { commands } from '../src/commands/commands';
import { dispatchCommand } from '../src/commands/dispatch-command';
import { focusRegion } from '../src/regions/focus-region';
import { rememberFocus } from '../src/regions/region-memory';
import { REGION_COMMANDS } from '../src/regions/regions.constants';
import { registerFresh } from './command-fixtures';

const press = (init: KeyboardEventInit, target: EventTarget = document): void => {
  document.addEventListener('keydown', (each) => dispatchCommand(each, null), { once: true });
  target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }));
};

const next = (target?: EventTarget): void => press({ key: 'F6', code: 'F6' }, target);
const previous = (): void => press({ key: 'F6', code: 'F6', shiftKey: true });

const mount = (html: string): void => {
  document.body.innerHTML = html;
};

const focusedId = (): string | undefined => document.activeElement?.id;

const SHELL = `
  <div role="banner" aria-label="Title bar"><button id="menu">Menu</button></div>
  <nav aria-label="Screens"><button id="rail">Home</button></nav>
  <div role="toolbar" aria-label="Tools"><button id="tool-a" tabindex="-1">A</button><button id="tool-b" tabindex="0">B</button></div>
  <main aria-label="Main"><p>Reading only</p></main>
`;

describe('region cycling', () => {
  let unregister = (): void => {};

  beforeEach(() => {
    unregister = registerFresh(shellCommands(undefined));
  });

  afterEach(() => {
    unregister();
    document.body.replaceChildren();
  });

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

  it('lands on the first tabbable control when none was focused before, and on the region itself when it has none', () => {
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

  it('adds an element an app marks with focusRegion to the cycle, even inside the main area', () => {
    mount(`${SHELL.replace('<p>Reading only</p>', '<div id="canvas"><div id="surface" tabindex="0"></div></div>')}`);
    const canvas = document.getElementById('canvas');
    for (const [name, value] of Object.entries(focusRegion('canvas', 'Sprite canvas'))) canvas?.setAttribute(name, value);
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
