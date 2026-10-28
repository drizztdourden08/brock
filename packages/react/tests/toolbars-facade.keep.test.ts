/* @layer renderer-shell @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createToolbarLayout } from '@drizztdourden08/tessera/composites';
import { defineToolbar } from '../src/toolbars/define-toolbar';
import { toolbars } from '../src/toolbars/toolbars';
import type { ToolbarSnapshot } from '../src/toolbars/toolbar.type';
import { useToolbarLayoutStore } from '../src/toolbars/useToolbarLayoutStore';

const make = (id: string, defaultSide: 'top' | 'bottom' | 'left' | 'right', hiddenByDefault = false) =>
  defineToolbar({ id, label: id.toUpperCase(), defaultSide, hiddenByDefault, render: () => null });

const DEFINITIONS = [make('tools', 'left'), make('options', 'top'), make('extra', 'top', true)];
const entry = (id: string) => {
  const found = toolbars.list().find((each) => each.id === id);
  if (!found) throw new Error(`no ${id}`);
  return found;
};

beforeEach(() => {
  useToolbarLayoutStore.setState({ definitions: [], layout: createToolbarLayout([]), pending: null });
  useToolbarLayoutStore.getState().setDefinitions(DEFINITIONS);
});

describe('toolbars.list', () => {
  it('lists each toolbar with its side, row, index and labels flag', () => {
    expect(toolbars.list()).toEqual([
      { id: 'tools', label: 'TOOLS', shown: true, side: 'left', row: 0, index: 0, labels: true, available: true },
      { id: 'options', label: 'OPTIONS', shown: true, side: 'top', row: 0, index: 0, labels: true, available: true },
      { id: 'extra', label: 'EXTRA', shown: false, side: null, row: null, index: null, labels: true, available: true },
    ]);
  });
});

describe('toolbars.show and toolbars.hide', () => {
  it('shows a hidden toolbar and hides a shown one', () => {
    toolbars.show('extra');
    expect(entry('extra')).toMatchObject({ shown: true, side: 'top' });
    toolbars.hide('tools');
    expect(entry('tools')).toMatchObject({ shown: false, side: null });
    toolbars.show('tools');
    expect(entry('tools').shown).toBe(true);
  });

  it('leaves a shown toolbar where it is on show', () => {
    const before = entry('options');
    toolbars.show('options');
    expect(entry('options')).toEqual(before);
  });
});

describe('toolbars.moveToSide', () => {
  it('moves a toolbar to another side', () => {
    toolbars.moveToSide('tools', 'bottom');
    expect(entry('tools')).toMatchObject({ side: 'bottom', row: 0 });
  });

  it('puts a toolbar on a chosen row of that side', () => {
    toolbars.moveToSide('tools', 'top', 0);
    expect(entry('tools')).toMatchObject({ side: 'top', row: 0 });
    expect(entry('options')).toMatchObject({ side: 'top', row: 1 });
  });

  it('shows a hidden toolbar on the way', () => {
    toolbars.moveToSide('extra', 'right');
    expect(entry('extra')).toMatchObject({ shown: true, side: 'right' });
  });

  it('rejects a bad side or row', () => {
    expect(() => toolbars.moveToSide('tools', 'middle' as 'top')).toThrow(/Unknown side/);
    expect(() => toolbars.moveToSide('tools', 'top', -1)).toThrow(/row/);
  });
});

describe('toolbars.labels and toolbars.reset', () => {
  it('turns the labels of one toolbar on and off', () => {
    toolbars.labels('tools', false);
    expect([entry('tools').labels, entry('options').labels]).toEqual([false, true]);
    toolbars.labels('tools', true);
    expect(entry('tools').labels).toBe(true);
  });

  it('puts every toolbar back to its default', () => {
    toolbars.moveToSide('tools', 'bottom');
    toolbars.hide('options');
    toolbars.labels('tools', false);
    toolbars.reset();
    expect(toolbars.list().map((each) => [each.side, each.labels])).toEqual([['left', true], ['top', true], [null, true]]);
  });
});

describe('toolbars.subscribe', () => {
  it('sends a fresh snapshot on a change, not on a no-op, and stops after unsubscribe', () => {
    const listener = vi.fn();
    const stop = toolbars.subscribe(listener);
    toolbars.hide('tools');
    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0]?.[0] as ToolbarSnapshot[]).find((each) => each.id === 'tools')).toMatchObject({ shown: false });
    toolbars.hide('tools');
    expect(listener).toHaveBeenCalledTimes(1);
    stop();
    toolbars.show('tools');
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe('unknown ids', () => {
  it('are rejected by every call that takes one', () => {
    const calls = [() => toolbars.show('zzz'), () => toolbars.hide('zzz'), () => toolbars.moveToSide('zzz', 'top'), () => toolbars.labels('zzz', true)];
    for (const call of calls) expect(call).toThrow(/Unknown toolbar "zzz"\. Known toolbars: tools, options, extra\./);
  });
});
