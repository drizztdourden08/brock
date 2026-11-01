/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { chordKeys, commands, useCommandChords } from '../src/commands';
import { useCommandStore } from '../src/commands/useCommandStore';
import { registerFresh } from './command-fixtures';

const flag = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };

describe('K1 chordKeys without a platform argument', () => {
  afterEach(() => useCommandStore.setState({ mac: false }));

  it('follows the platform of the command store', { tags: ['critical'] }, () => {
    useCommandStore.setState({ mac: false });
    expect(chordKeys('Mod+K')).toEqual(['ctrl', 'K']);
    useCommandStore.setState({ mac: true });
    expect(chordKeys('Mod+K')).toEqual(['cmd', 'K']);
    expect(chordKeys('Mod+K', false)).toEqual(['ctrl', 'K']);
  });

  it('gives no keycaps for a chord it cannot read', { tags: ['critical'] }, () => {
    expect(chordKeys('Ctrl+Shift', false)).toEqual([]);
  });
});

describe('S1 useCommandChords', () => {
  let root: ReturnType<typeof createRoot>;
  let unregister = (): void => {};
  const seen: (readonly string[])[] = [];

  const Reader = () => {
    seen.push(useCommandChords('redo'));
    return null;
  };

  beforeEach(() => {
    flag.IS_REACT_ACT_ENVIRONMENT = true;
    seen.length = 0;
    unregister = registerFresh([{ id: 'redo', label: 'Redo', chord: { mac: 'Mod+Shift+Z', other: ['Mod+Y', 'Mod+Shift+Z'] }, run: () => {} }]);
    root = createRoot(document.createElement('div'));
  });

  afterEach(() => {
    act(() => root.unmount());
    unregister();
  });

  it('returns the platform chords and updates on a remap and a reset', { tags: ['standard'] }, () => {
    act(() => root.render(createElement(Reader)));
    expect(seen.at(-1)).toEqual(['Mod+Y', 'Mod+Shift+Z']);
    act(() => commands.remap('redo', ['Ctrl+Alt+R']));
    expect(seen.at(-1)).toEqual(['Mod+Alt+R']);
    act(() => commands.reset('redo'));
    expect(seen.at(-1)).toEqual(['Mod+Y', 'Mod+Shift+Z']);
  });

  it('follows the platform and gives no chords for an unknown command', { tags: ['standard'] }, () => {
    act(() => root.render(createElement(Reader)));
    act(() => useCommandStore.setState({ mac: true }));
    expect(seen.at(-1)).toEqual(['Mod+Shift+Z']);
    unregister();
    act(() => root.render(createElement(Reader)));
    expect(seen.at(-1)).toEqual([]);
  });
});
