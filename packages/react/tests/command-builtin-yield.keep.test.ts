/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { shellCommands } from '../src/app/BrockApp/behavior/shell-commands';
import { BROCK_COMMANDS, COMMAND_RANKS } from '../src/commands/commands.constants';
import { commands } from '../src/commands/commands';
import { dispatchCommand } from '../src/commands/dispatch-command';
import { setCommandSource } from '../src/commands/set-command-source';
import { useCommandStore } from '../src/commands/useCommandStore';

const key = (init: KeyboardEventInit): KeyboardEvent => new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });

const altEnter = { key: 'Enter', code: 'Enter', altKey: true };

let toggle: Mock<() => void>;
let properties: Mock<() => void>;

const boot = (): void => {
  useCommandStore.setState({ sources: [], overrides: {}, mac: false, persist: null });
  setCommandSource('shell', COMMAND_RANKS.brock, shellCommands(() => { toggle(); }));
};

beforeEach(() => {
  toggle = vi.fn<() => void>();
  properties = vi.fn<() => void>();
  boot();
});

afterEach(() => {
  useCommandStore.setState({ sources: [], overrides: {}, mac: false, persist: null });
});

describe('built-in chords yield to app commands', () => {
  it('binds fullscreen to F11 and Alt+Enter while no app command wants Alt+Enter', () => {
    expect(commands.chords(BROCK_COMMANDS.fullscreen)).toEqual(['F11', 'Alt+Enter']);
    expect(dispatchCommand(key(altEnter), null)).toBe(true);
    expect(toggle).toHaveBeenCalledTimes(1);
    expect(dispatchCommand(key({ key: 'F11', code: 'F11' }), null)).toBe(true);
    expect(toggle).toHaveBeenCalledTimes(2);
  });

  it('gives Alt+Enter to an app command and keeps F11 on fullscreen', () => {
    setCommandSource('app', COMMAND_RANKS.app, [{ id: 'app.properties', label: 'Properties', chord: 'Alt+Enter', run: () => { properties(); } }]);
    expect(commands.chords(BROCK_COMMANDS.fullscreen)).toEqual(['F11']);
    expect(commands.chords('app.properties')).toEqual(['Alt+Enter']);
    expect(dispatchCommand(key(altEnter), null)).toBe(true);
    expect(properties).toHaveBeenCalledTimes(1);
    expect(toggle).not.toHaveBeenCalled();
    expect(dispatchCommand(key({ key: 'F11', code: 'F11' }), null)).toBe(true);
    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it('keeps the app command in charge while it is disabled, and reports no conflict', () => {
    setCommandSource('app', COMMAND_RANKS.app, [{ id: 'app.properties', label: 'Properties', chord: 'Alt+Enter', when: () => false, run: () => { properties(); } }]);
    expect(dispatchCommand(key(altEnter), null)).toBe(false);
    expect(toggle).not.toHaveBeenCalled();
    expect(commands.conflicts()).toEqual([]);
  });

  it('yields to a command registered at runtime', () => {
    const stop = commands.register([{ id: 'runtime.properties', label: 'Properties', chord: 'Alt+Enter', run: () => { properties(); } }]);
    expect(commands.chords(BROCK_COMMANDS.fullscreen)).toEqual(['F11']);
    expect(commands.conflicts()).toEqual([]);
    stop();
    expect(commands.chords(BROCK_COMMANDS.fullscreen)).toEqual(['F11', 'Alt+Enter']);
  });

  it('follows the chord an app command is rebound to', () => {
    setCommandSource('app', COMMAND_RANKS.app, [{ id: 'app.properties', label: 'Properties', chord: 'Alt+Enter', run: () => { properties(); } }]);
    commands.remap('app.properties', ['Mod+I']);
    expect(commands.chords(BROCK_COMMANDS.fullscreen)).toEqual(['F11', 'Alt+Enter']);
    expect(commands.conflicts()).toEqual([]);
  });

  it('leaves a chord the user set on a built-in command alone and reports its conflict', () => {
    setCommandSource('app', COMMAND_RANKS.app, [{ id: 'app.properties', label: 'Properties', chord: 'Alt+Enter', run: () => { properties(); } }]);
    commands.remap(BROCK_COMMANDS.fullscreen, ['Alt+Enter']);
    expect(commands.chords(BROCK_COMMANDS.fullscreen)).toEqual(['Alt+Enter']);
    expect(commands.conflicts()).toEqual([{ chord: 'Alt+Enter', ids: [BROCK_COMMANDS.fullscreen, 'app.properties'] }]);
  });

  it('still reports a clash between two app commands', () => {
    setCommandSource('app', COMMAND_RANKS.app, [
      { id: 'app.properties', label: 'Properties', chord: 'Alt+Enter', run: () => { properties(); } },
      { id: 'app.other', label: 'Other', chord: 'Alt+Enter', run: () => undefined },
    ]);
    expect(commands.conflicts()).toEqual([{ chord: 'Alt+Enter', ids: ['app.properties', 'app.other'] }]);
  });
});
