/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createToolbarLayout } from '@drizztdourden08/tessera/composites';
import { availableToolbars } from '../src/toolbars/available-toolbars';
import { defineToolbar } from '../src/toolbars/define-toolbar';
import { toolbarIdOf } from '../src/toolbars/toolbar-id-of';
import { toolbarItemEntries } from '../src/toolbars/toolbar-item-entries';
import { toolbarItemZone } from '../src/toolbars/toolbar-item-zone';
import { toolbars } from '../src/toolbars/toolbars';
import { useToolbarLayoutStore } from '../src/toolbars/useToolbarLayoutStore';
import { mode, availableIn, setMode } from './rule-mode-fixture';
import { showHarness } from './show-harness';

afterEach(() => {
  showHarness.resetShow();
});

describe('W4 toolbar when', () => {
  const BAR = defineToolbar({ id: 'pencil', label: 'Pencil', defaultSide: 'top', render: () => null, when: mode('sheet') });
  const ALWAYS = defineToolbar({ id: 'tools', label: 'Tools', defaultSide: 'left', render: () => null });

  beforeEach(() => {
    useToolbarLayoutStore.setState({ definitions: [], layout: createToolbarLayout([]), pending: null });
    useToolbarLayoutStore.getState().setDefinitions([BAR, ALWAYS]);
  });

  it('keeps only the toolbars whose rule passes and returns the same list when none is ruled out', () => {
    expect(availableToolbars([BAR, ALWAYS]).map((def) => def.id)).toEqual(['tools']);
    setMode('sheet');
    const both = [BAR, ALWAYS];
    expect(availableToolbars(both)).toBe(both);
  });

  it('leaves the user layout alone while the rule hides the toolbar', () => {
    const before = useToolbarLayoutStore.getState().layout;
    expect(toolbars.list().find((each) => each.id === 'pencil')).toMatchObject({ shown: true, available: false });
    setMode('sheet');
    expect(toolbars.list().find((each) => each.id === 'pencil')).toMatchObject({ shown: true, available: true });
    expect(useToolbarLayoutStore.getState().layout).toBe(before);
  });

  it('notifies a subscriber when the rule flips', () => {
    const seen: boolean[] = [];
    const stop = toolbars.subscribe((snapshot) => seen.push(availableIn(snapshot, 'pencil')));
    setMode('sheet');
    stop();
    expect(seen).toEqual([true]);
  });
});

describe('W5 toolbar contextEntries', () => {
  const BAR = defineToolbar({
    id: 'tools',
    label: 'Tools',
    defaultSide: 'left',
    render: () => null,
    contextEntries: (itemId) => [{ label: `Edit ${itemId}`, run: () => undefined }],
  });

  beforeEach(() => {
    useToolbarLayoutStore.setState({ definitions: [], layout: createToolbarLayout([]), pending: null });
    useToolbarLayoutStore.getState().setDefinitions([BAR]);
  });

  const target = (): Element => {
    const bar = document.body.appendChild(document.createElement('div'));
    bar.setAttribute('data-toolbar-id', 'tools');
    const item = bar.appendChild(document.createElement('button'));
    return item;
  };
  const context = (data: unknown, at: Element | null) => ({ point: { x: 0, y: 0 }, target: at, trigger: 'pointer' as const, data });

  it('finds the toolbar from the item and puts its entries above the Brock ones', () => {
    const entries = toolbarItemEntries(context('pencil', target()));
    expect(entries[0]).toMatchObject({ label: 'Edit pencil' });
    expect(entries[1]).toBe('separator');
    expect(entries.length).toBeGreaterThan(3);
  });

  it('shows only the Brock entries when the toolbar has no contextEntries or the item is unknown', () => {
    useToolbarLayoutStore.getState().setDefinitions([defineToolbar({ id: 'tools', label: 'Tools', defaultSide: 'left', render: () => null })]);
    const entries = toolbarItemEntries(context('pencil', target()));
    expect(entries.some((entry) => typeof entry === 'object' && 'label' in entry && entry.label === 'Edit pencil')).toBe(false);
    expect(toolbarItemEntries(context('pencil', null))).toEqual([]);
  });

  it('marks an item with its id and reads the toolbar id back', () => {
    expect(toolbarItemZone('pencil')).toMatchObject({ 'data-context-menu': 'brock.toolbar-item' });
    expect(toolbarIdOf(target())).toBe('tools');
    expect(toolbarIdOf(null)).toBeNull();
  });
});
