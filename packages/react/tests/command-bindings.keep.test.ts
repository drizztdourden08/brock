/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { chordKeys, chordOfKeys } from '../src/commands';
import type { CommandContext } from '../src/commands/command.type';
import { commands } from '../src/commands/commands';
import { formatChord } from '../src/commands/format-chord';
import { normalizeChord } from '../src/commands/normalize-chord';
import { openKeymapAt } from '../src/commands/open-keymap-at';
import { parseChord } from '../src/commands/parse-chord';
import { nav } from '../src/navigation/nav';
import { scrollToAnchor } from '../src/search/scroll-to-anchor';
import { down, presses, releases, startHolds, stopHolds, up } from './command-fixtures';

vi.mock('../src/search/scroll-to-anchor', () => ({ scrollToAnchor: vi.fn() }));

const runs: CommandContext[] = [];

const SPACE = { key: ' ', code: 'Space' };
const B = { key: 'b', code: 'KeyB' };

const setup = (): void => {
  runs.length = 0;
  startHolds([
    {
      id: 'brush.size',
      label: 'Brush size',
      args: { size: { type: 'number', min: 1, max: 9 } },
      bindings: [{ args: { size: 3 }, chord: 'Alt+3' }, { args: { size: 5 }, chord: 'Alt+5' }],
      run: (context) => { if (context !== undefined) runs.push(context); },
    },
    {
      id: 'tool.pan',
      label: 'Pan',
      chord: 'Space+B',
      hold: { release: (context) => { releases.push(context); } },
      run: () => { presses.push('pan'); },
    },
  ]);
};

const teardown = stopHolds;

describe('K1 default bindings with bound arguments', () => {
  beforeEach(setup);
  afterEach(teardown);

  it('runs one command with the arguments of the key that was pressed', { tags: ['critical'] }, () => {
    down({ key: '3', code: 'Digit3', altKey: true });
    down({ key: '5', code: 'Digit5', altKey: true });
    expect(runs.map((context) => context.args)).toEqual([{ size: 3 }, { size: 5 }]);
  });

  it('lists the defaults as bindings and keeps them off the command list', { tags: ['critical'] }, () => {
    expect(commands.list().map((def) => def.id)).toEqual(['brush.size', 'tool.pan']);
    expect(commands.bindings('brush.size')).toEqual([
      { id: 'brush.size', args: { size: 3 }, chords: ['Alt+3'] },
      { id: 'brush.size', args: { size: 5 }, chords: ['Alt+5'] },
    ]);
  });

  it('lets the keymap remap and reset a default binding by its row id', { tags: ['standard'] }, () => {
    const [row] = commands.bindings('brush.size');
    const key = 'brush.size#{"size":3}';
    expect(row?.chords).toEqual(['Alt+3']);
    commands.remap(key, ['Alt+7']);
    expect(commands.bindings('brush.size')[0]?.chords).toEqual(['Alt+7']);
    commands.reset(key);
    expect(commands.bindings('brush.size')[0]?.chords).toEqual(['Alt+3']);
  });
});

describe('K1 hold commands on a two-key chord', () => {
  beforeEach(setup);
  afterEach(teardown);

  it('fires only while the first key is down and holds while the last key is down', { tags: ['critical'] }, () => {
    down(B);
    expect(presses).toEqual([]);
    up(B);
    down(SPACE);
    down(B);
    expect(presses).toEqual(['pan']);
    up(SPACE);
    expect(releases).toHaveLength(0);
    up(B);
    expect(releases).toMatchObject([{ cause: 'keyup' }]);
  });

  it('releases on window blur and forgets the keys that were down', { tags: ['critical'] }, () => {
    down(SPACE);
    down(B);
    window.dispatchEvent(new Event('blur'));
    expect(releases).toMatchObject([{ cause: 'blur' }]);
    up(SPACE);
    up(B);
    down(B);
    expect(presses).toEqual(['pan']);
  });

  it('reads, writes and shows a chord with a key before the last', { tags: ['standard'] }, () => {
    expect(parseChord('Space+B', false)).toMatchObject({ key: 'B', with: ['Space'] });
    expect(normalizeChord('ctrl+space+b', false)).toBe('Mod+Space+B');
    expect(formatChord('Space+B', false)).toBe('Space+B');
    expect(chordKeys('Space+B', false)).toEqual(['space', 'B']);
    expect(chordOfKeys(['space', 'B'], false)).toBe('Space+B');
    expect(parseChord('Hyper+B', false)).toBeNull();
  });
});

describe('K1 opening the keymap at one command', () => {
  beforeEach(setup);
  afterEach(teardown);

  it('opens the route and scrolls to the row of the command id', { tags: ['standard'] }, () => {
    const open = vi.spyOn(nav, 'open').mockImplementation(() => undefined);
    openKeymapAt('settings/keyboard', 'tool.pan');
    openKeymapAt('settings/keyboard', 'brush.size', { size: 3 });
    expect(open).toHaveBeenCalledWith('settings/keyboard');
    expect(vi.mocked(scrollToAnchor).mock.calls.map((call) => call[0])).toEqual(['tool.pan', 'brush.size#{"size":3}']);
    open.mockRestore();
  });
});
