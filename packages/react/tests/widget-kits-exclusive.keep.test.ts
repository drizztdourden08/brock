/* @layer renderer-shell @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultLayout, isWidgetOpen } from '@drizztdourden08/tessera/composites';
import { defaultKitView } from '../src/widgets/kits/default-kit-view';
import { defineWidgetKit } from '../src/widgets/kits/define-widget-kit';
import { groupedMembers } from '../src/widgets/kits/grouped-members';
import { useWidgetKitStore } from '../src/widgets/kits/useWidgetKitStore';
import { widgetKits } from '../src/widgets/kits/widget-kits';
import { defineWidget } from '../src/widgets/define-widget';
import { poppedSources } from '../src/widgets/popped-sources';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';
import { widgets } from '../src/widgets/widgets';
import { widgetsFromFiles } from '../src/widgets/widgets-from-files';

const widget = (id: string, extra: { kit?: string; popOut?: boolean } = {}) => defineWidget({ id, label: id, defaultSide: 'right', render: () => null, ...extra });

const EDITOR = defineWidgetKit({ id: 'editor', label: 'Editor' });
const PROBE = defineWidgetKit({ id: 'probe', label: 'Probe' });
const MEMBERS = [widget('tree', { kit: 'editor', popOut: true }), widget('props', { kit: 'editor' }), widget('trace', { kit: 'probe' })];
const NORMAL = [widget('logs', { popOut: true }), widget('notes')];

const kits = () => useWidgetKitStore.getState();
const kitLayout = (id: string) => kits().views[id]?.layout ?? defaultKitView(EDITOR, []).layout;
const normalLayout = () => useWidgetLayoutStore.getState().layout;

beforeEach(() => {
  useWidgetKitStore.setState({ kits: [], members: [], active: null, views: {} });
  kits().setKits([EDITOR, PROBE], MEMBERS);
  useWidgetLayoutStore.setState({ definitions: NORMAL, layout: createDefaultLayout(), externalDrag: null });
});

describe('one kit at a time', () => {
  it('closes the open kit when another kit opens, from the store or the API', () => {
    widgetKits.open('editor');
    widgetKits.open('probe');
    expect(widgetKits.active()).toBe('probe');
    expect(widgetKits.isOpen('editor')).toBe(false);
    kits().toggleMember('tree');
    expect(widgetKits.active()).toBe('editor');
  });
});

describe('a normal widget closes the open kit', () => {
  it('closes the kit and opens the widget in the normal layout, from open, toggle and popOut', () => {
    widgetKits.open('editor');
    widgets.open('logs');
    expect(widgetKits.active()).toBeNull();
    expect(isWidgetOpen(normalLayout(), 'logs')).toBe(true);
    widgetKits.open('editor');
    widgets.toggle('logs');
    expect(widgetKits.active()).toBeNull();
    expect(isWidgetOpen(normalLayout(), 'logs')).toBe(true);
    widgets.toggle('logs');
    expect(isWidgetOpen(normalLayout(), 'logs')).toBe(false);
    widgetKits.open('editor');
    widgets.popOut('logs');
    expect(widgetKits.active()).toBeNull();
    expect(normalLayout().popped.map((p) => p.id)).toEqual(['logs']);
  });

  it('leaves the kit open for an unknown id, a widget close, and closes it for Reset layout', () => {
    widgetKits.open('editor');
    widgets.open('nothing');
    widgets.close('logs');
    expect(widgetKits.active()).toBe('editor');
    widgets.reset();
    expect(widgetKits.active()).toBeNull();
  });
});

describe('the widgets API on a kit widget', () => {
  it('opens its kit, closing any other, and shows the widget even after the user closed it', () => {
    widgetKits.open('editor');
    kits().toggleMember('tree');
    expect(isWidgetOpen(kitLayout('editor'), 'tree')).toBe(false);
    widgetKits.open('probe');
    widgets.open('tree');
    expect(widgetKits.active()).toBe('editor');
    expect(isWidgetOpen(kitLayout('editor'), 'tree')).toBe(true);
    expect(widgets.isVisible('tree')).toBe(true);
    expect(isWidgetOpen(normalLayout(), 'tree')).toBe(false);
  });

  it('opens a list of widgets of one kit together and leaves an open one open', () => {
    widgetKits.open('editor');
    kits().toggleMember('tree');
    kits().toggleMember('props');
    widgetKits.close();
    for (const id of ['tree', 'props', 'tree']) widgets.open(id);
    expect(widgetKits.active()).toBe('editor');
    expect(isWidgetOpen(kitLayout('editor'), 'tree')).toBe(true);
    expect(isWidgetOpen(kitLayout('editor'), 'props')).toBe(true);
  });

  it('toggles a kit widget within its open kit, and opens the kit when it is closed', () => {
    widgets.toggle('props');
    expect(widgetKits.active()).toBe('editor');
    expect(isWidgetOpen(kitLayout('editor'), 'props')).toBe(true);
    widgets.toggle('props');
    expect(widgetKits.active()).toBe('editor');
    expect(widgets.isVisible('props')).toBe(false);
    widgets.close('tree');
    expect(isWidgetOpen(kitLayout('editor'), 'tree')).toBe(false);
  });

  it('has widgetKits.openWidget as the explicit form', () => {
    widgetKits.openWidget('trace');
    expect(widgetKits.active()).toBe('probe');
    widgetKits.openWidget('logs');
    expect(widgetKits.active()).toBe('probe');
  });
});

describe('kit widgets in Tessera', () => {
  it('gives each kit widget its kit id as group, leaves normal widgets ungrouped, and reads chrome from a widget file', () => {
    const grouped = groupedMembers([...MEMBERS, ...NORMAL, widget('stray', { kit: 'gone' })], [EDITOR, PROBE]);
    expect(grouped.map((def) => [def.id, def.group])).toEqual([['tree', 'editor'], ['props', 'editor'], ['trace', 'probe']]);
    const [compact] = widgetsFromFiles([{ id: 'tool', component: () => null, meta: { kit: 'editor', chrome: 'compact' } }]);
    expect(compact?.chrome).toBe('compact');
  });
});

describe('kit widgets in their own window', () => {
  it('pops a kit widget out within its kit, keeps it popped through a close, and drops it from the windows while closed', () => {
    widgets.popOut('tree');
    expect(widgetKits.active()).toBe('editor');
    expect(kitLayout('editor').popped.map((p) => p.id)).toEqual(['tree']);
    expect(normalLayout().popped).toEqual([]);
    expect(poppedSources.anyPopped()).toBe(true);
    widgetKits.close();
    expect(poppedSources.anyPopped()).toBe(false);
    widgetKits.open('editor');
    expect(kitLayout('editor').popped.map((p) => p.id)).toEqual(['tree']);
    widgets.popOut('props');
    expect(kitLayout('editor').popped.map((p) => p.id)).toEqual(['tree']);
  });

  it('shares the frames of the open kit with the normal ones', () => {
    widgets.popOut('tree');
    kits().change((layout) => ({ ...layout, frame: { tree: { opacity: 0.5, show: 'always' } } }));
    expect(poppedSources.framesSource.getState().tree?.opacity).toBe(0.5);
    widgetKits.close();
    expect(poppedSources.framesSource.getState().tree).toBeUndefined();
  });
});
