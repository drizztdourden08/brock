/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { createDefaultLayout } from '@drizztdourden08/tessera/composites';
import type { MenuEntry } from '../src/menu/menu.type';
import { arrangeWidgetMenu } from '../src/widgets/arrange-widget-menu';
import { BUILT_IN_WIDGETS } from '../src/widgets/built-in-widgets.constants';
import { buildWidgetMenuEntries } from '../src/widgets/build-widget-menu-entries';

const noop = (): void => undefined;

const keysOf = (entries: readonly MenuEntry[]): string[] => entries.map((entry) => (entry === 'separator' ? '|' : entry.key));

const arranged = (developer: boolean): MenuEntry[] =>
  arrangeWidgetMenu(buildWidgetMenuEntries(BUILT_IN_WIDGETS, createDefaultLayout(), noop, developer), undefined, developer);

describe('K1 the built-in Logs and Performance widgets', { tags: ['critical'] }, () => {
  it('sit in the Developer group of the Widgets menu while developer tools are on', () => {
    const menu = arranged(true);
    expect(keysOf(menu)).toEqual(['widgets-developer']);
    const group = menu[0];
    expect(group !== undefined && group !== 'separator' ? keysOf(group.children ?? []) : []).toEqual(['widget-logs', 'widget-performance']);
  });

  it('stay in the Widgets list while developer tools are off, so they remain reachable', () => {
    expect(keysOf(arranged(false))).toEqual(['widget-logs', 'widget-performance']);
  });
});
