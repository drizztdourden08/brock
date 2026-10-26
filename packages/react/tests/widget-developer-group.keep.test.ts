/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { createDefaultLayout } from '@drizztdourden08/tessera/composites';
import type { MenuEntry } from '../src/menu/menu.type';
import { arrangeWidgetMenu } from '../src/widgets/arrange-widget-menu';
import { BUILT_IN_WIDGETS } from '../src/widgets/built-in-widgets.constants';
import { buildWidgetMenuEntries } from '../src/widgets/build-widget-menu-entries';
import { defineWidget } from '../src/widgets/define-widget';

const noop = (): void => undefined;

const keysOf = (entries: readonly MenuEntry[]): string[] => entries.map((entry) => (entry === 'separator' ? '|' : entry.key));

const arranged = (developer: boolean): MenuEntry[] =>
  arrangeWidgetMenu(buildWidgetMenuEntries(BUILT_IN_WIDGETS, createDefaultLayout(), noop, developer), undefined, developer);

describe('the built-in Logs and Performance widgets', () => {
  it('sit in the Developer group of the Widgets menu while developer tools are on', () => {
    const menu = arranged(true);
    expect(keysOf(menu)).toEqual(['widgets-developer']);
    const group = menu[0];
    expect(group !== undefined && group !== 'separator' ? keysOf(group.children ?? []) : []).toEqual(['widget-logs', 'widget-performance']);
  });

  it('stay in the Widgets list while developer tools are off, so they remain reachable', () => {
    expect(keysOf(arranged(false))).toEqual(['widget-logs', 'widget-performance']);
  });

  it('are not devOnly, so the widgets themselves stay available', () => {
    expect(BUILT_IN_WIDGETS.map((def) => def.devOnly)).toEqual([undefined, undefined]);
  });

  it('leave a widget with a parent of its own where it asked', () => {
    const own = defineWidget({ id: 'tuner', label: 'Tuner', menu: { developer: true, parent: 'audio' }, render: () => null });
    const [entry] = buildWidgetMenuEntries([own], createDefaultLayout(), noop, true);
    expect(entry).toMatchObject({ key: 'widget-tuner', parent: 'audio' });
  });
});
