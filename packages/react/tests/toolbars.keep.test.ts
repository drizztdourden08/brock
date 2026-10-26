/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createToolbarLayout, toolbarIdsOf } from '@drizztdourden08/tessera/composites';
import { fakeDisk, settle } from './fake-ui-views-disk';
import type { MenuEntry, MenuItem } from '../src/menu/menu.type';
import { mergeModules } from '../src/modules/merge-modules';
import { buildToolbarMenuEntries } from '../src/toolbars/build-toolbar-menu-entries';
import { defineToolbar } from '../src/toolbars/define-toolbar';
import { ToolbarHost } from '../src/toolbars/ToolbarHost';
import { toolbarRenderer } from '../src/toolbars/toolbar-renderer';
import { useToolbarLayoutStore } from '../src/toolbars/useToolbarLayoutStore';

const make = (id: string, defaultSide: 'top' | 'bottom' | 'left' | 'right', hiddenByDefault = false) =>
  defineToolbar({ id, label: id, defaultSide, hiddenByDefault, render: () => null });

const TOOLS = make('tools', 'left');
const OPTIONS = make('options', 'top');
const EXTRA = make('extra', 'top', true);
const DEFINITIONS = [TOOLS, OPTIONS, EXTRA];
const WORDS = { menu: 'Toolbars', reset: 'Reset toolbars' };

const store = () => useToolbarLayoutStore.getState();
const itemsOf = (entry: MenuItem): MenuItem[] => (entry.children ?? []).filter((child): child is MenuItem => child !== 'separator');
const entriesOf = (): MenuEntry[] => buildToolbarMenuEntries({ definitions: store().definitions, layout: store().layout, toggle: store().toggle, words: WORDS, reset: store().reset });

beforeEach(() => {
  useToolbarLayoutStore.setState({ definitions: [], layout: createToolbarLayout([]), pending: null });
});

describe('defineToolbar', () => {
  it('returns the definition as given', () => {
    expect(defineToolbar({ id: 'tools', label: 'Tools', defaultSide: 'left', render: () => null })).toMatchObject({ id: 'tools', label: 'Tools', defaultSide: 'left' });
  });
});

describe('the toolbar layout store', () => {
  it('places each registered toolbar on its default side, and hides one that starts hidden', () => {
    store().setDefinitions(DEFINITIONS);
    const { hidden } = store().layout;
    expect([toolbarIdsOf(store().layout, 'left'), toolbarIdsOf(store().layout, 'top'), hidden]).toEqual([['tools'], ['options'], ['extra']]);
  });

  it('loads a saved layout through migrateToolbarLayout, dropping a toolbar that no longer exists and placing a new one', () => {
    store().setDefinitions(DEFINITIONS);
    const saved = { v: 1, sides: { top: [], bottom: ['tools', 'gone'], left: [], right: [] }, hidden: [], last: {} };
    store().replace(saved);
    expect(toolbarIdsOf(store().layout, 'bottom')).toEqual(['tools']);
    expect(toolbarIdsOf(store().layout, 'top')).toEqual(['options']);
    expect(store().layout.v).toBe(2);
    expect(store().layout.hidden).toEqual(['extra']);
  });

  it('falls back to the defaults for nothing saved or for a layout it cannot read', () => {
    store().setDefinitions(DEFINITIONS);
    const defaults = createToolbarLayout(DEFINITIONS);
    store().replace(undefined);
    expect(store().layout).toEqual(defaults);
    store().replace({ v: 9, sides: 'nope' });
    expect(store().layout).toEqual(defaults);
  });

  it('toggles a toolbar and resets to the defaults', () => {
    store().setDefinitions(DEFINITIONS);
    store().toggle('options');
    expect(store().layout.hidden).toContain('options');
    store().toggle('extra');
    expect(store().layout.hidden).not.toContain('extra');
    store().reset();
    expect(store().layout).toEqual(createToolbarLayout(DEFINITIONS));
  });
});

describe('the Toolbars menu', () => {
  it('is empty when no toolbar is registered', () => {
    expect(entriesOf()).toEqual([]);
  });

  it('lists a check item per toolbar and its own Reset toolbars entry', () => {
    store().setDefinitions(DEFINITIONS);
    const [menu] = entriesOf();
    expect(menu).toMatchObject({ key: 'toolbars', label: 'Toolbars' });
    const items = itemsOf(menu as MenuItem);
    expect(items.map((item) => item.key)).toEqual(['toolbar-tools', 'toolbar-options', 'toolbar-extra', 'toolbars-reset']);
    expect(items.slice(0, 3).map((item) => item.checked)).toEqual([true, true, false]);
    expect(items.at(-1)).toMatchObject({ label: 'Reset toolbars', confirm: true });
  });

  it('toggles a toolbar and resets from the menu', () => {
    store().setDefinitions(DEFINITIONS);
    const pick = (key: string): MenuItem | undefined => itemsOf(entriesOf()[0] as MenuItem).find((item) => item.key === key);
    pick('toolbar-extra')?.onClick?.();
    expect(store().layout.hidden).not.toContain('extra');
    pick('toolbars-reset')?.onClick?.();
    expect(store().layout.hidden).toEqual(['extra']);
  });

  it('disables a hidden toolbar when every side is full', () => {
    const sides = ['top', 'bottom', 'left', 'right'] as const;
    const full = [...sides.flatMap((side) => [make(`${side}-a`, side), make(`${side}-b`, side)]), make('c', 'left', true)];
    store().setDefinitions(full);
    const items = itemsOf(entriesOf()[0] as MenuItem);
    expect(items.find((item) => item.key === 'toolbar-c')?.disabled).toBe(true);
    expect(items.find((item) => item.key === 'toolbar-left-a')?.disabled).toBe(false);
  });

  it('leaves the widgets Reset layout alone', async () => {
    const { useWidgetLayoutStore } = await import('../src/widgets/useWidgetLayoutStore');
    store().setDefinitions(DEFINITIONS);
    store().toggle('options');
    const before = store().layout;
    useWidgetLayoutStore.getState().reset();
    expect(store().layout).toBe(before);
  });
});

describe('the toolbar host', () => {
  it('draws its children in the dock centre', () => {
    const html = renderToStaticMarkup(createElement(ToolbarHost, { toolbars: [TOOLS], children: createElement('b', { className: 'work-area' }) }));
    expect(html).toContain('class="toolbar-dock"');
    expect(html).toContain('<div class="toolbar-dock__centre"><b class="work-area"></b></div>');
  });

  it('draws each toolbar through its own render, with the slot the dock gives it', () => {
    const probe = defineToolbar({ id: 'probe', label: 'Probe', defaultSide: 'left', render: (slot) => createElement('i', { className: 'probe-bar', 'data-side': slot.side }) });
    const slot = { orientation: 'vertical', handle: {}, side: 'left', menuSide: 'right' } as const;
    expect(renderToStaticMarkup(createElement('div', null, toolbarRenderer([TOOLS, probe])('probe', slot)))).toContain('<i class="probe-bar" data-side="left"></i>');
    expect(toolbarRenderer([TOOLS, probe])('missing', slot)).toBeNull();
  });
});

describe('modules', () => {
  it('add their toolbars to the merged list', () => {
    const merged = mergeModules([{ id: 'one', toolbars: [TOOLS] }, { id: 'two' }, { id: 'three', toolbars: [OPTIONS] }]);
    expect(merged.toolbars.map((toolbar) => toolbar.id)).toEqual(['tools', 'options']);
  });
});

const startApp = async () => {
  vi.resetModules();
  const { widgetPersistence } = await import('../src/widgets/widget-persistence');
  const { useToolbarLayoutStore: fresh } = await import('../src/toolbars/useToolbarLayoutStore');
  fresh.getState().setDefinitions(DEFINITIONS);
  const stop = widgetPersistence.watch();
  return { widgetPersistence, toolbars: () => fresh.getState(), stop };
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('the toolbar layout across a restart', { timeout: 60_000 }, () => {
  it('saves toolbarLayout as its own key beside widgetLayout, flushes on pagehide, and reads it back', async () => {
    const { disk, listeners } = fakeDisk({ 'profile:p1': { widgetLayout: { kept: true } } });
    const first = await startApp();
    await first.widgetPersistence.load('p1');
    expect(disk.saves).toBe(0);
    first.toolbars().toggle('options');
    await settle();
    listeners.get('pagehide')?.();
    first.stop();
    await settle();
    const saved = first.toolbars().layout;
    const stored = disk.file['profile:p1'] as Record<string, unknown>;
    expect(stored.toolbarLayout).toEqual(saved);
    expect(saved.v).toBe(2);
    expect(stored.widgetLayout).toEqual({ kept: true });

    const second = await startApp();
    await second.widgetPersistence.load('p1');
    expect(second.toolbars().layout).toEqual(saved);
    expect(second.toolbars().layout.hidden).toContain('options');
    second.stop();
  });

  it('gives a profile with nothing saved the defaults', async () => {
    fakeDisk({ 'profile:p1': {} });
    const app = await startApp();
    await app.widgetPersistence.load('p1');
    expect(app.toolbars().layout).toEqual(createToolbarLayout(DEFINITIONS));
    app.stop();
  });
});
