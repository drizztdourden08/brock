/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { isToolbarShown, isWidgetOpen } from '@drizztdourden08/tessera/composites';
import '../src/widgets/widget-persistence';
import { fakeDisk, settle } from './fake-ui-views-disk';

const startApp = async () => {
  vi.resetModules();
  const { widgetPersistence } = await import('../src/widgets/widget-persistence');
  const { useWidgetLayoutStore } = await import('../src/widgets/useWidgetLayoutStore');
  const { useToolbarLayoutStore } = await import('../src/toolbars/useToolbarLayoutStore');
  const { defineWidget } = await import('../src/widgets/define-widget');
  const { defineToolbar } = await import('../src/toolbars/define-toolbar');
  const { defineWorkspace } = await import('../src/widgets/workspaces/define-workspace');
  const { useWorkspaceStore } = await import('../src/widgets/workspaces/useWorkspaceStore');
  const { workspaces } = await import('../src/widgets/workspaces/workspaces');
  const { chosenWorkspace } = await import('../src/widgets/workspaces/chosen-workspace');
  const { buildWorkspaceMenuEntries } = await import('../src/widgets/workspaces/build-workspace-menu-entries');
  const definitions = ['a', 'b', 'c'].map((id) => defineWidget({ id, label: id.toUpperCase(), render: () => null }));
  const bars = ['tools', 'options'].map((id) => defineToolbar({ id, label: id, defaultSide: 'top', render: () => null }));
  useWidgetLayoutStore.getState().setDefinitions(definitions);
  useToolbarLayoutStore.getState().setDefinitions(bars);
  const defs = [
    defineWorkspace({ id: 'anim', label: 'Animation', order: 1, layout: { rows: [[['c'], 'main']] }, toolbars: ['options'], when: { when: ({ flags }) => flags.kind === 'anim' } }),
    defineWorkspace({ id: 'map', label: 'Map', order: 2, layout: { rows: [[['b'], 'main']] }, when: { when: ({ flags }) => flags.kind === 'map' } }),
    defineWorkspace({ id: 'manual', label: 'Manual' }),
  ];
  useWorkspaceStore.getState().setDefs(defs);
  const stop = widgetPersistence.watch();
  return {
    widgetPersistence, workspaces, defs, chosenWorkspace, buildWorkspaceMenuEntries, stop,
    widgets: () => useWidgetLayoutStore.getState(),
    bars: () => useToolbarLayoutStore.getState(),
    store: () => useWorkspaceStore.getState(),
  };
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('workspaces', { timeout: 60_000 }, () => {
  it('builds a workspace from its preset the first time and brings the standard layout back', async () => {
    fakeDisk({});
    const app = await startApp();
    await app.widgetPersistence.load('p1');
    app.widgets().open('a');
    const standard = app.widgets().layout;
    const standardBars = app.bars().layout;

    app.workspaces.activate('anim');
    expect(app.workspaces.active()).toBe('anim');
    expect(isWidgetOpen(app.widgets().layout, 'c')).toBe(true);
    expect(isWidgetOpen(app.widgets().layout, 'a')).toBe(false);
    expect(isToolbarShown(app.bars().layout, 'options')).toBe(true);
    expect(isToolbarShown(app.bars().layout, 'tools')).toBe(false);

    app.workspaces.activate(null);
    expect(app.widgets().layout).toBe(standard);
    expect(app.bars().layout).toBe(standardBars);
    app.stop();
  });

  it('keeps a workspace layout through a switch, and the standard layout is not overwritten by it', async () => {
    const { disk } = fakeDisk({});
    const app = await startApp();
    await app.widgetPersistence.load('p1');
    app.widgets().open('a');
    await settle();
    const standardOnDisk = (disk.file['profile:p1'] as Record<string, unknown>).widgetLayout;

    app.workspaces.activate('anim');
    app.widgets().open('b');
    await settle();
    expect((disk.file['profile:p1'] as Record<string, unknown>).widgetLayout).toEqual(standardOnDisk);

    app.workspaces.activate('map');
    expect(isWidgetOpen(app.widgets().layout, 'b')).toBe(true);
    expect(isWidgetOpen(app.widgets().layout, 'c')).toBe(false);
    app.workspaces.activate('anim');
    expect(isWidgetOpen(app.widgets().layout, 'b')).toBe(true);
    expect(isWidgetOpen(app.widgets().layout, 'c')).toBe(true);
    app.stop();
  });

  it('comes back after a restart', async () => {
    const { disk } = fakeDisk({});
    const first = await startApp();
    await first.widgetPersistence.load('p1');
    first.workspaces.activate('anim');
    first.widgets().open('a');
    first.bars().hide('options');
    await settle();
    const animLayout = first.widgets().layout;
    first.stop();
    expect(Object.keys((disk.file['profile:p1'] as { workspaces: object }).workspaces)).toEqual(['anim']);

    const second = await startApp();
    await second.widgetPersistence.load('p1');
    expect(second.store().ready).toBe(true);
    second.workspaces.activate('anim');
    expect(second.widgets().layout).toEqual(animLayout);
    expect(isToolbarShown(second.bars().layout, 'options')).toBe(false);
    second.stop();
  });

  it('resets one workspace to its preset and leaves the others alone', async () => {
    fakeDisk({});
    const app = await startApp();
    await app.widgetPersistence.load('p1');
    app.workspaces.activate('anim');
    app.widgets().open('a');
    app.workspaces.activate('map');
    app.widgets().open('a');
    app.workspaces.reset('anim');
    app.workspaces.activate('anim');
    expect(isWidgetOpen(app.widgets().layout, 'a')).toBe(false);
    expect(isWidgetOpen(app.widgets().layout, 'c')).toBe(true);
    app.workspaces.activate('map');
    expect(isWidgetOpen(app.widgets().layout, 'a')).toBe(true);
    app.stop();
  });

  it('throws for an unknown workspace and does nothing before the views are loaded', async () => {
    fakeDisk({});
    const app = await startApp();
    expect(() => app.workspaces.activate('anim')).not.toThrow();
    expect(app.workspaces.active()).toBeNull();
    await app.widgetPersistence.load('p1');
    expect(() => app.workspaces.activate('nope')).toThrow(/Unknown workspace "nope"/);
    app.stop();
  });

  it('lists the workspaces with the active one and the one a rule would pick', async () => {
    fakeDisk({});
    const app = await startApp();
    await app.widgetPersistence.load('p1');
    app.workspaces.activate('manual');
    expect(app.workspaces.list().map((each) => [each.id, each.active, each.matches])).toEqual([['anim', false, false], ['map', false, false], ['manual', true, false]]);
    const flagged = { profile: null, host: 'web' as const, formFactor: 'desktop' as const, flags: { kind: 'map' } };
    expect(app.chosenWorkspace(app.defs, flagged)).toBe('map');
    expect(app.chosenWorkspace(app.defs, { ...flagged, flags: {} })).toBeNull();
    app.stop();
  });

  it('builds a Workspace menu with a check on the active entry and a Reset entry', async () => {
    fakeDisk({});
    const app = await startApp();
    const calls: unknown[] = [];
    const [menu] = app.buildWorkspaceMenuEntries({ defs: app.defs, active: 'map', activate: (id) => calls.push(id), reset: () => calls.push('reset') });
    const items = (menu?.children ?? []).filter((entry) => typeof entry === 'object');
    expect(items.map((item) => [item.label, item.checked])).toEqual([['Standard', false], ['Animation', false], ['Map', true], ['Manual', false], ['Reset this workspace', undefined]]);
    items[1]?.onClick?.();
    items[4]?.onClick?.();
    expect(calls).toEqual(['anim', 'reset']);
    expect(app.buildWorkspaceMenuEntries({ defs: [], active: null, activate: () => undefined, reset: () => undefined })).toEqual([]);
    app.stop();
  });
});
