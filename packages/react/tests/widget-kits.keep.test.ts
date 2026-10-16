/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { isWidgetOpen, widgetsIn } from '@drizztdourden08/tessera/composites';
import type { MenuEntry, MenuItem } from '../src/menu/menu.type';
import { KitLayer } from '../src/widgets/KitLayer';
import { buildKitMenuEntries } from '../src/widgets/kits/build-kit-menu-entries';
import { defaultKitView } from '../src/widgets/kits/default-kit-view';
import { defineWidgetKit } from '../src/widgets/kits/define-widget-kit';
import { kitStatus } from '../src/widgets/kits/kit-status';
import { readKitViews } from '../src/widgets/kits/read-kit-views';
import { useWidgetKitStore } from '../src/widgets/kits/useWidgetKitStore';
import { widgetKitsFromFiles } from '../src/widgets/kits/widget-kits-from-files';
import type { WidgetKitDef } from '../src/widgets/kits/widget-kit.type';
import { defineLayoutPreset } from '../src/widgets/define-layout-preset';
import { defineWidget } from '../src/widgets/define-widget';
import { widgetsFromFiles } from '../src/widgets/widgets-from-files';

const Nothing = () => null;

const member = (id: string, kit: string, side: 'left' | 'right' = 'right') => defineWidget({ id, label: id, kit, defaultSide: side, render: () => null });

const EDITOR = defineWidgetKit({
  id: 'editor',
  label: 'Editor',
  devOnly: true,
  requires: { context: 'scene', reason: 'Start the scene first.' },
  overlays: [{ id: 'gizmo', label: 'Gizmo', render: () => createElement('i', { className: 'gizmo' }) }],
});
const PROBE = defineWidgetKit({ id: 'probe', label: 'Probe' });
const MEMBERS = [member('tree', 'editor', 'left'), member('props', 'editor'), member('trace', 'probe')];
const KITS = [EDITOR, PROBE];

const store = () => useWidgetKitStore.getState();
const layoutOf = (id: string) => store().views[id]?.layout ?? defaultKitView(PROBE, []).layout;
const viewOf = (id: string) => store().views[id];
const children = (entry: MenuItem): MenuItem[] => (entry.children ?? []).filter((child): child is MenuItem => child !== 'separator');
const SCENE_ON = { scene: { active: true } };

beforeEach(() => {
  useWidgetKitStore.setState({ kits: [], members: [], active: null, views: {} });
  store().setKits(KITS, MEMBERS);
});

describe('kit files', () => {
  it('names a kit after its file, gives it the overlays that name it, and lets a widget file join it', () => {
    const [kit] = widgetKitsFromFiles({
      kits: [{ id: 'shadow-editor', meta: { devOnly: true } }],
      overlays: [{ id: 'shadow-gizmo', component: Nothing, meta: { kit: 'shadow-editor' } }, { id: 'other', component: Nothing, meta: { kit: 'else' } }],
    });
    expect(kit?.label).toBe('Shadow Editor');
    expect(kit?.devOnly).toBe(true);
    expect(kit?.overlays?.map((overlay) => [overlay.id, overlay.label])).toEqual([['shadow-gizmo', 'Shadow Gizmo']]);
    const [widget] = widgetsFromFiles([{ id: 'shadow-tree', component: Nothing, meta: { kit: 'shadow-editor', tools: Nothing } }]);
    expect(widget?.kit).toBe('shadow-editor');
    expect(typeof widget?.tools).toBe('function');
  });
});

describe('kit status', () => {
  it('hides a devOnly kit without developer tools and gives the reason while its context is inactive', () => {
    expect(kitStatus(EDITOR, {}, false)).toEqual({ shown: false, reason: 'Start the scene first.' });
    expect(kitStatus(EDITOR, SCENE_ON, true)).toEqual({ shown: true, reason: null });
    expect(kitStatus(PROBE, {}, false)).toEqual({ shown: true, reason: null });
  });
});

describe('the kit store', () => {
  it('opens one kit at a time and closes it as a whole', () => {
    store().open('editor');
    expect(store().active).toBe('editor');
    store().toggle('probe');
    expect(store().active).toBe('probe');
    store().close();
    expect(store().active).toBeNull();
    store().open('nothing');
    expect(store().active).toBeNull();
  });

  it('opens every member of a kit with no layout of its own, and follows a kit layout preset', () => {
    const view = defaultKitView(EDITOR, MEMBERS);
    expect(widgetsIn(view.layout.dock).sort()).toEqual(['props', 'tree']);
    const laid = defaultKitView(defineWidgetKit({ ...EDITOR, layout: defineLayoutPreset({ rows: [['props', 'main']] }) }), MEMBERS);
    expect(widgetsIn(laid.layout.dock)).toContain('props');
    expect(widgetsIn(laid.layout.dock)).toContain('tree');
  });

  it('keeps a layout per kit: closing a member changes only its kit, and a member toggled while closed opens its kit', () => {
    store().toggleMember('tree');
    expect(store().active).toBe('editor');
    store().toggleMember('tree');
    expect(isWidgetOpen(layoutOf('editor'), 'tree')).toBe(false);
    expect(isWidgetOpen(layoutOf('editor'), 'props')).toBe(true);
    expect(viewOf('probe')).toBeUndefined();
    store().close();
    store().toggleMember('trace');
    expect(store().active).toBe('probe');
    expect(isWidgetOpen(layoutOf('editor'), 'tree')).toBe(false);
    store().reset('editor');
    expect(isWidgetOpen(layoutOf('editor'), 'tree')).toBe(true);
  });

  it('hides and shows an overlay of the open kit, and loads saved views per profile with the kit closed', () => {
    store().open('editor');
    store().toggleOverlay('gizmo');
    expect(viewOf('editor')?.hidden).toEqual(['gizmo']);
    store().replace({ editor: viewOf('editor'), broken: 'no', empty: { hidden: [] } });
    expect(store().active).toBeNull();
    expect(Object.keys(store().views)).toEqual(['editor']);
  });

  it('closes the open kit when the kit leaves the list', () => {
    store().open('probe');
    store().setKits([EDITOR], MEMBERS);
    expect(store().active).toBeNull();
  });
});

describe('saved kit views', () => {
  it('keeps the layout and the hidden overlays and never a popped window', () => {
    const layout = { ...defaultKitView(EDITOR, MEMBERS).layout, popped: [{ id: 'tree' }] };
    const read = readKitViews({ editor: { layout, hidden: ['gizmo', 3] } });
    expect(read.editor?.layout.popped).toEqual([]);
    expect(read.editor?.hidden).toEqual(['gizmo']);
    expect(readKitViews(null)).toEqual({});
  });
});

describe('the kit menu', () => {
  const entries = (contexts = {}, developerTools = true): MenuItem[] =>
    buildKitMenuEntries(store(), (kit: WidgetKitDef) => kitStatus(kit, contexts, developerTools));

  it('gives each kit a sub-menu: open or close, its widgets, its overlays and a reset', () => {
    store().open('editor');
    const editor = entries(SCENE_ON).find((entry) => entry.key === 'kit-editor') ?? { key: 'none', label: 'none' };
    expect(editor.checked).toBeUndefined();
    expect(children(editor).map((child) => child.label)).toEqual(['Close kit', 'props', 'tree', 'Gizmo', 'Reset kit layout']);
    expect(children(editor).filter((child) => child.key.startsWith('widget-')).every((child) => child.checked)).toBe(true);
    expect((editor.children ?? []).filter((child: MenuEntry) => child === 'separator')).toHaveLength(2);
  });

  it('describes a blocked kit with its reason and leaves a devOnly kit out without developer tools', () => {
    expect(entries({}, true).find((entry) => entry.key === 'kit-editor')?.description).toBe('Start the scene first.');
    expect(entries({}, false).map((entry) => entry.key)).toEqual(['kit-probe']);
  });
});

describe('the kit layer', () => {
  const draw = (reason: string | null, hidden: string[] = []) => renderToStaticMarkup(createElement(KitLayer, { kit: EDITOR, hidden, reason, onClose: () => undefined }));

  it('draws the overlays and the kit bar with its close button', () => {
    const html = draw(null);
    expect(html).toContain('data-kit-overlay="gizmo"');
    expect(html).toContain('data-kit-bar="editor"');
    expect(html).toContain('data-kit-close="editor"');
    expect(draw(null, ['gizmo'])).not.toContain('data-kit-overlay');
  });

  it('draws the reason card in place of the overlays while the kit is blocked', () => {
    const html = draw('Start the scene first.');
    expect(html).toContain('data-kit-waiting="editor"');
    expect(html).toContain('Start the scene first.');
    expect(html).not.toContain('data-kit-overlay');
  });
});
