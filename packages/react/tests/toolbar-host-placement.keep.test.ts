/* @layer renderer-shell @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createToolbarLayout, toolbarIdsOf } from '@drizztdourden08/tessera/composites';
import type { ToolbarLayout } from '@drizztdourden08/tessera/composites';
import { fakeDisk, settle } from './fake-ui-views-disk';
import type { ToolbarDef } from '../src/toolbars/toolbar.type';
import { useToolbarLayoutStore } from '../src/toolbars/useToolbarLayoutStore';

const bar = (id: string, side: ToolbarDef['defaultSide'], hidden?: boolean): ToolbarDef => ({ id, label: id, defaultSide: side, hiddenByDefault: hidden, render: () => null });

const DEFINITIONS = [bar('tools', 'left'), bar('options', 'top'), bar('extra', 'top', true)];

const store = () => useToolbarLayoutStore.getState();

beforeEach(() => {
  useToolbarLayoutStore.setState({ definitions: [], layout: createToolbarLayout([]), pending: null });
});

describe('K3 a toolbar host that mounts after the layout was loaded', { tags: ['critical'] }, () => {
  const SAVED = { v: 1, sides: { top: [], bottom: ['tools'], left: [], right: [] }, hidden: ['options'], last: {} };

  it('keeps the saved layout when the profile loads before any toolbar is registered', () => {
    store().replace(SAVED);
    expect(store().layout).toEqual(createToolbarLayout([]));
    store().setDefinitions(DEFINITIONS);
    expect(toolbarIdsOf(store().layout, 'bottom')).toEqual(['tools']);
    expect(store().layout.hidden).toEqual(expect.arrayContaining(['options', 'extra']));
    expect(store().pending).toBeNull();
  });

  it('hydrates a saved v2 layout the same way, and upgrades a saved v1 one to v2', () => {
    store().setDefinitions(DEFINITIONS);
    store().toggle('options');
    const v2 = structuredClone(store().layout);
    useToolbarLayoutStore.setState({ definitions: [], layout: createToolbarLayout([]), pending: null });
    store().replace(v2);
    store().setDefinitions(DEFINITIONS);
    expect(store().layout).toEqual(v2);
    useToolbarLayoutStore.setState({ definitions: [], layout: createToolbarLayout([]), pending: null });
    store().replace(SAVED);
    store().setDefinitions(DEFINITIONS);
    expect(store().layout.v).toBe(2);
  });

  it('reads the latest profile when two load before the host mounts', () => {
    store().replace(SAVED);
    store().replace(null);
    store().setDefinitions(DEFINITIONS);
    expect(store().layout).toEqual(createToolbarLayout(DEFINITIONS));
  });

  it('does not let an empty registration overwrite a layout that waits to be read', () => {
    store().replace(SAVED);
    store().setDefinitions([]);
    store().setDefinitions(DEFINITIONS);
    expect(toolbarIdsOf(store().layout, 'bottom')).toEqual(['tools']);
  });

  it('ignores registering the same list again', () => {
    store().setDefinitions(DEFINITIONS);
    store().toggle('options');
    const before = store().layout;
    store().setDefinitions(DEFINITIONS);
    expect(store().layout).toBe(before);
  });

  it('does not save the defaults over the stored layout before the host registers', async () => {
    const { disk } = fakeDisk({ 'profile:p1': { toolbarLayout: SAVED } });
    vi.resetModules();
    const { widgetPersistence } = await import('../src/widgets/widget-persistence');
    const { useToolbarLayoutStore: fresh } = await import('../src/toolbars/useToolbarLayoutStore');
    const stop = widgetPersistence.watch();
    await widgetPersistence.load('p1');
    await settle();
    expect(disk.saves).toBe(0);
    fresh.getState().setDefinitions(DEFINITIONS);
    expect(toolbarIdsOf(fresh.getState().layout, 'bottom')).toEqual(['tools']);
    stop();
    await settle();
    const stored = disk.file['profile:p1'] as { toolbarLayout: ToolbarLayout };
    expect(stored.toolbarLayout.v).toBe(2);
    expect(toolbarIdsOf(stored.toolbarLayout, 'bottom')).toEqual(['tools']);
  });
});
