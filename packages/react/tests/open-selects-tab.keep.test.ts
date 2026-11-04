/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { activateTab } from '../src/widgets/activate-tab';

const grouped = (active: string): WidgetLayout => ({
  v: 2,
  dock: { kind: 'pane', key: 'side', widgets: ['notes', 'log'], active, makeRoom: false },
  floating: [],
  popped: [],
  frame: {},
});

describe('opening a grouped widget', { tags: ['critical'] }, () => {
  it('brings a hidden tab to the front', () => {
    const next = activateTab(grouped('notes'), 'log');
    expect(next.dock).toMatchObject({ active: 'log' });
  });

  it('keeps the same layout when the tab is already active', () => {
    const layout = grouped('notes');
    expect(activateTab(layout, 'notes')).toBe(layout);
  });
});
