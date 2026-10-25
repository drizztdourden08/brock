/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createToolbarLayout } from '@drizztdourden08/tessera/composites';
import { fakeDisk, settle } from './fake-ui-views-disk';
import { AppStage } from '../src/app/BrockApp/sub-components/AppStage';
import { ToolbarHost } from '../src/toolbars/ToolbarHost';
import type { ToolbarDef } from '../src/toolbars/toolbar.type';
import { useToolbarLayoutStore } from '../src/toolbars/useToolbarLayoutStore';

const bar = (id: string, side: ToolbarDef['defaultSide'], hidden?: boolean): ToolbarDef => ({ id, label: id, defaultSide: side, hiddenByDefault: hidden, render: () => null });

const DEFINITIONS = [bar('tools', 'left'), bar('options', 'top'), bar('extra', 'top', true)];

const store = () => useToolbarLayoutStore.getState();

beforeEach(() => {
  useToolbarLayoutStore.setState({ definitions: [], layout: createToolbarLayout([]), pending: null });
});

describe('where the toolbar host is mounted', () => {
  const probe: ToolbarDef = { id: 'probe', label: 'Probe', defaultSide: 'left', render: () => createElement('i', { className: 'probe-bar' }) };
  const work = createElement('b', { className: 'work-area' });
  const count = (html: string, text: string): number => html.split(text).length - 1;

  it('wraps the widget host in the dock by default', () => {
    const html = renderToStaticMarkup(createElement(AppStage, { toolbars: [probe], railed: false, children: work }));
    expect(count(html, 'class="toolbar-dock"')).toBe(1);
    expect(html).toContain('brock-app__stage--docked');
  });

  it('leaves the widget host alone with placement app, and draws the toolbars where the app mounts its own host', () => {
    store().setDefinitions([probe]);
    const bare = renderToStaticMarkup(createElement(AppStage, { toolbars: [probe], placement: 'app', railed: false, children: work }));
    expect(bare).toBe('<b class="work-area"></b>');
    const page = createElement(ToolbarHost, { children: work });
    const html = renderToStaticMarkup(createElement(AppStage, { toolbars: [probe], placement: 'app', railed: false, children: page }));
    expect(count(html, 'class="toolbar-dock"')).toBe(1);
    expect(html).toContain('probe-bar');
    expect(html).toContain('<div class="toolbar-dock__centre"><b class="work-area"></b></div>');
    expect(html).not.toContain('brock-app__stage--docked');
  });
});

describe('a toolbar host that mounts after the layout was loaded', () => {
  const SAVED = { v: 1, sides: { top: [], bottom: ['tools'], left: [], right: [] }, hidden: ['options'], last: {} };

  it('keeps the saved layout when the profile loads before any toolbar is registered', () => {
    store().replace(SAVED);
    expect(store().layout).toEqual(createToolbarLayout([]));
    store().setDefinitions(DEFINITIONS);
    expect(store().layout.sides.bottom).toEqual(['tools']);
    expect(store().layout.hidden).toEqual(expect.arrayContaining(['options', 'extra']));
    expect(store().pending).toBeNull();
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
    expect(store().layout.sides.bottom).toEqual(['tools']);
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
    expect(fresh.getState().layout.sides.bottom).toEqual(['tools']);
    stop();
    await settle();
    const stored = disk.file['profile:p1'] as { toolbarLayout: { sides: { bottom: string[] } } };
    expect(stored.toolbarLayout.sides.bottom).toEqual(['tools']);
  });
});
