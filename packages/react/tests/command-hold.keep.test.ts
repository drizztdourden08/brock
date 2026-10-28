/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { commands } from '../src/commands/commands';
import type { HoldContext } from '../src/commands/command.type';
import { dispatchCommand } from '../src/commands/dispatch-command';
import { listenHolds } from '../src/commands/hold-listeners';
import { registerFresh } from './command-fixtures';

const presses: string[] = [];
const releases: HoldContext[] = [];
const stops: { listeners: () => void; commands: () => void } = { listeners: () => {}, commands: () => {} };

const down = (init: KeyboardEventInit): void => {
  document.documentElement.addEventListener('keydown', (each) => dispatchCommand(each, null), { once: true });
  document.documentElement.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }));
};

const up = (init: KeyboardEventInit): void => {
  document.documentElement.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, ...init }));
};

const setup = (): void => {
  presses.length = 0;
  releases.length = 0;
  stops.commands = registerFresh([
    { id: 'tool.hand', label: 'Hand', chord: 'H', hold: { tapMs: 200, release: (context) => { releases.push(context); } }, run: () => { presses.push('hand'); } },
    { id: 'tool.zoom', label: 'Zoom', chord: 'Mod+H', hold: { release: (context) => { releases.push(context); } }, run: () => { presses.push('zoom'); } },
  ]);
  stops.listeners = listenHolds();
};

const teardown = (): void => {
  stops.listeners();
  stops.commands();
  vi.useRealTimers();
};

describe('hold commands on the keyboard', () => {
  beforeEach(setup);
  afterEach(teardown);

  it('runs on key down, ignores repeat and releases once on key up', () => {
    down({ key: 'h', code: 'KeyH' });
    down({ key: 'h', code: 'KeyH', repeat: true });
    down({ key: 'h', code: 'KeyH', repeat: true });
    expect(presses).toEqual(['hand']);
    up({ key: 'h', code: 'KeyH' });
    up({ key: 'h', code: 'KeyH' });
    expect(releases).toHaveLength(1);
    expect(releases[0]).toMatchObject({ cause: 'keyup', trigger: 'keyboard' });
  });

  it('calls a quick release a tap and a slow one a hold', () => {
    vi.useFakeTimers();
    down({ key: 'h', code: 'KeyH' });
    vi.advanceTimersByTime(50);
    up({ key: 'h', code: 'KeyH' });
    down({ key: 'h', code: 'KeyH' });
    vi.advanceTimersByTime(500);
    up({ key: 'h', code: 'KeyH' });
    expect(releases.map((context) => context.tap)).toEqual([true, false]);
  });

  it('releases a chord hold when its modifier goes up first', () => {
    down({ key: 'h', code: 'KeyH', ctrlKey: true });
    up({ key: 'Control', code: 'ControlLeft', ctrlKey: false });
    expect(releases).toHaveLength(1);
    up({ key: 'h', code: 'KeyH' });
    expect(releases).toHaveLength(1);
  });
});

describe('hold commands that end without a key up', () => {
  beforeEach(setup);
  afterEach(teardown);

  it('releases once when the window loses focus, and the later key up does nothing', () => {
    down({ key: 'h', code: 'KeyH' });
    window.dispatchEvent(new Event('blur'));
    up({ key: 'h', code: 'KeyH' });
    expect(releases).toHaveLength(1);
    expect(releases[0]).toMatchObject({ cause: 'blur', tap: false });
  });

  it('releases every hold when the listeners are removed', () => {
    down({ key: 'h', code: 'KeyH' });
    stops.listeners();
    expect(releases).toMatchObject([{ cause: 'dispose' }]);
    stops.listeners = listenHolds();
  });

  it('treats a run from a menu as a tap: run, then release at once', async () => {
    await commands.run('tool.hand');
    expect(presses).toEqual(['hand']);
    expect(releases).toMatchObject([{ tap: true, cause: 'run' }]);
  });

  it('reports the modifiers held for a pointer drag', () => {
    document.documentElement.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, shiftKey: true, altKey: true }));
    expect(commands.heldModifiers()).toEqual(['alt', 'shift']);
    expect(commands.heldModifiers({ ctrlKey: true, altKey: false, shiftKey: false, metaKey: false })).toEqual(['ctrl']);
    window.dispatchEvent(new Event('blur'));
    expect(commands.heldModifiers()).toEqual([]);
  });
});
