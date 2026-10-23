/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { chordOfKeys } from '../src/commands/chord-of-keys';
import { commands } from '../src/commands/commands';
import type { CommandDef } from '../src/commands/command.type';
import { dispatchCommand } from '../src/commands/dispatch-command';
import { formatChord } from '../src/commands/format-chord';
import { matchesChord } from '../src/commands/matches-chord';
import { normalizeChord } from '../src/commands/normalize-chord';
import { parseChord } from '../src/commands/parse-chord';
import { useCommandStore } from '../src/commands/useCommandStore';

const key = (init: KeyboardEventInit): KeyboardEvent => new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });

describe('chord parsing and formatting', () => {
  it('reads modifiers in any case and order, with Mod as the platform key', () => {
    expect(parseChord('shift+mod+k', false)).toEqual({ ctrl: true, meta: false, alt: false, shift: true, key: 'K' });
    expect(parseChord('Mod+K', true)).toEqual({ ctrl: false, meta: true, alt: false, shift: false, key: 'K' });
    expect(parseChord('Cmd+Option+ArrowLeft', true)).toEqual({ ctrl: false, meta: true, alt: true, shift: false, key: 'Left' });
  });

  it('refuses unknown modifiers and a chord made of modifiers only', () => {
    expect(parseChord('Hyper+K', false)).toBeNull();
    expect(parseChord('Ctrl+Shift', false)).toBeNull();
    expect(parseChord('', false)).toBeNull();
  });

  it('reads a plus key', () => {
    expect(parseChord('Mod++', false)?.key).toBe('+');
    expect(normalizeChord('Mod++', false)).toBe('Mod+Plus');
  });

  it('writes one canonical form per platform', () => {
    expect(normalizeChord('ctrl+shift+s', false)).toBe('Mod+Shift+S');
    expect(normalizeChord('Cmd+S', true)).toBe('Mod+S');
    expect(normalizeChord('Ctrl+S', true)).toBe('Ctrl+S');
    expect(normalizeChord('Alt+Comma', false)).toBe('Alt+,');
  });

  it('formats a chord for display', () => {
    expect(formatChord('Mod+Shift+K', false)).toBe('Ctrl+Shift+K');
    expect(formatChord('Mod+Alt+K', true)).toBe('Option+Cmd+K');
    expect(formatChord('F5', false)).toBe('F5');
  });

  it('turns recorded keycaps into a chord', () => {
    expect(chordOfKeys(['ctrl', 'shift', 'S'], false)).toBe('Mod+Shift+S');
    expect(chordOfKeys(['cmd', 'Z'], true)).toBe('Mod+Z');
    expect(chordOfKeys(['shift'], false)).toBeNull();
  });
});

describe('the platform modifier', () => {
  it('is Ctrl on Windows and Linux and Cmd on macOS', () => {
    expect(matchesChord(key({ key: 'k', ctrlKey: true }), 'Mod+K', false)).toBe(true);
    expect(matchesChord(key({ key: 'k', metaKey: true }), 'Mod+K', false)).toBe(false);
    expect(matchesChord(key({ key: 'k', metaKey: true }), 'Mod+K', true)).toBe(true);
    expect(matchesChord(key({ key: 'k', ctrlKey: true }), 'Mod+K', true)).toBe(false);
  });

  it('matches by the physical key when a modifier changes the character', () => {
    expect(matchesChord(key({ key: '˚', code: 'KeyK', altKey: true }), 'Alt+K', true)).toBe(true);
    expect(matchesChord(key({ key: '/', code: 'Digit7', ctrlKey: true, shiftKey: true }), 'Mod+/', false)).toBe(true);
    expect(matchesChord(key({ key: 'K', ctrlKey: true, shiftKey: true }), 'Mod+K', false)).toBe(false);
  });
});

describe('the dispatcher', () => {
  const ran: string[] = [];
  const command = (def: Omit<CommandDef, 'run'>): CommandDef => ({ ...def, run: () => { ran.push(def.id); } });
  let unregister = (): void => {};

  beforeEach(() => {
    ran.length = 0;
    useCommandStore.setState({ sources: [], overrides: {}, mac: false, persist: null });
    unregister = commands.register([
      command({ id: 'pencil', label: 'Pencil', chord: 'B' }),
      command({ id: 'save', label: 'Save', chord: 'Mod+S' }),
      command({ id: 'fill', label: 'Fill', chord: 'G', whileTyping: true }),
      command({ id: 'editor-undo', label: 'Undo stroke', chord: 'Mod+Z', scope: 'editor' }),
      command({ id: 'undo', label: 'Undo', chord: 'Mod+Z' }),
      command({ id: 'locked', label: 'Locked', chord: 'L', when: () => false }),
    ]);
  });

  afterEach(() => unregister());

  const pressIn = (target: HTMLElement, init: KeyboardEventInit, route: string | null = null): boolean => {
    document.body.append(target);
    const event = key(init);
    const result = { handled: false };
    target.addEventListener('keydown', (each) => { result.handled = dispatchCommand(each, route); }, { once: true });
    target.dispatchEvent(event);
    target.remove();
    return result.handled && event.defaultPrevented;
  };

  it('runs a command from its chord', () => {
    expect(pressIn(document.createElement('div'), { key: 'b' })).toBe(true);
    expect(ran).toEqual(['pencil']);
  });

  it('holds a plain key while typing in a field, but lets a Mod chord through', () => {
    const field = document.createElement('input');
    expect(pressIn(field, { key: 'b' })).toBe(false);
    expect(pressIn(document.createElement('textarea'), { key: 's', ctrlKey: true })).toBe(true);
    expect(ran).toEqual(['save']);
  });

  it('fires while typing when the command allows it', () => {
    expect(pressIn(document.createElement('input'), { key: 'g' })).toBe(true);
    expect(ran).toEqual(['fill']);
  });

  it('prefers the command scoped to the open screen over a global one', () => {
    pressIn(document.createElement('div'), { key: 'z', ctrlKey: true }, 'editor');
    pressIn(document.createElement('div'), { key: 'z', ctrlKey: true }, 'gallery');
    expect(ran).toEqual(['editor-undo', 'undo']);
  });

  it('skips a command whose when returns false', () => {
    expect(pressIn(document.createElement('div'), { key: 'l' })).toBe(false);
    expect(commands.run('locked')).toBe(false);
  });
});

describe('remapping', () => {
  const written: unknown[] = [];
  let unregister = (): void => {};

  beforeEach(() => {
    written.length = 0;
    useCommandStore.setState({ sources: [], overrides: {}, mac: false, persist: (overrides) => written.push(overrides) });
    unregister = commands.register([
      { id: 'save', label: 'Save', chord: 'Mod+S', run: () => {} },
      { id: 'redo', label: 'Redo', chord: { mac: 'Mod+Shift+Z', other: ['Mod+Y', 'Mod+Shift+Z'] }, run: () => {} },
      { id: 'export', label: 'Export', chord: 'Mod+E', run: () => {} },
      { id: 'brush', label: 'Brush', chord: 'Mod+E', scope: 'editor', run: () => {} },
    ]);
  });

  afterEach(() => unregister());

  it('takes the platform defaults', () => {
    expect(commands.chords('redo')).toEqual(['Mod+Y', 'Mod+Shift+Z']);
    useCommandStore.setState({ mac: true });
    expect(commands.chords('redo')).toEqual(['Mod+Shift+Z']);
  });

  it('stores a remap through the settings writer and shows it at once', () => {
    commands.remap('save', ['ctrl+alt+s']);
    expect(commands.chords('save')).toEqual(['Mod+Alt+S']);
    expect(written.at(-1)).toEqual({ save: ['Mod+Alt+S'] });
  });

  it('drops an override that equals the defaults, and resets one or all', () => {
    commands.remap('save', ['Mod+S']);
    expect(useCommandStore.getState().overrides).toEqual({});
    commands.remap('save', []);
    commands.remap('export', ['F2']);
    expect(commands.chords('save')).toEqual([]);
    commands.reset('save');
    expect(useCommandStore.getState().overrides).toEqual({ export: ['F2'] });
    commands.reset();
    expect(written.at(-1)).toEqual({});
  });

  it('reports chords that two commands share in the same scope', () => {
    expect(commands.conflicts()).toEqual([{ chord: 'Mod+E', ids: ['export', 'brush'] }]);
    commands.remap('export', ['Mod+S']);
    expect(commands.conflicts()).toEqual([{ chord: 'Mod+S', ids: ['save', 'export'] }]);
  });
});
