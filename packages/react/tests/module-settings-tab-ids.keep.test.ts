/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { HubDef } from '../src/hub/hub.type';
import { mergeModules } from '../src/modules/merge-modules';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import { resolveScreenTree } from '../src/screens/conventions/resolve-screen-tree';
import type { ScreenEntry } from '../src/screens/conventions/screen-tree.type';
import type { ScreensConfig } from '../src/screens/conventions/screens-config.type';
import { moduleTabId } from '../src/settings/module-tab-id';
import { separateModuleTabs } from '../src/settings/separate-module-tabs';
import type { TabDef } from '../src/settings/settings.type';

const View = () => null;

const CONFIG: ScreensConfig = {
  buckets: [{ id: 'main', title: 'Main', icon: 'house', menu: 'entry', groups: [{ id: 'look', label: 'Look' }] }],
  home: 'main',
};

const tab = (id: string, extra: Partial<TabDef<object>> = {}): TabDef<object> => ({ id, label: id, navIcon: null, group: 'Hardware', sections: () => [], ...extra });

const moduleTabs = (...defs: [string, string][]): TabDef<object>[] =>
  mergeModules(defs.map(([module, id]) => ({ id: module, settingsTabs: [tab(id)] }))).settingsTabs;

const pagesOf = (hub: HubDef | undefined): string[] => hub?.groups.flatMap((group) => group.pages.map((page) => page.id)) ?? [];

const entries = (pageId: string): ScreenEntry[] => [
  { kind: 'hero', bucket: 'main', id: 'home', component: View },
  { kind: 'settings', bucket: 'main', group: 'look', id: pageId, sections: [] },
];

describe('module settings tab ids', () => {
  it('records which module a tab came from', () => {
    expect(moduleTabs(['monitor', 'screen']).map((t) => [t.id, t.moduleId])).toEqual([['screen', 'monitor']]);
  });

  it('keeps a module tab id that nothing else uses, so existing links still open it', () => {
    const resolved = resolveScreenTree(buildScreenTree(CONFIG, entries('colors')), moduleTabs(['monitor', 'screen']));
    expect(pagesOf(resolved.hubs[0])).toEqual(['colors', 'screen']);
    expect(resolved.settingsAlias({ tab: 'screen' })).toEqual({ active: 'main/screen', params: {} });
  });

  it('moves a module tab to its namespaced id when an app page has the same id, and the app page keeps the plain one', () => {
    const resolved = resolveScreenTree(buildScreenTree(CONFIG, entries('screen')), moduleTabs(['monitor', 'screen']));
    const hub = resolved.hubs[0];
    expect(pagesOf(hub)).toEqual(['screen', moduleTabId('monitor', 'screen')]);
    expect(new Set(pagesOf(hub)).size).toBe(pagesOf(hub).length);
    expect(resolved.tabs.map((t) => t.id)).toEqual(['main/screen', 'monitor.screen']);
    expect(hub?.groups.at(-1)?.pages[0]?.settingsTab).toBe('monitor.screen');
    expect(resolved.settingsAlias({ tab: 'screen' })).toEqual({ active: 'main/screen', params: {} });
    expect(resolved.settingsAlias({ tab: 'monitor.screen' })).toEqual({ active: 'main/monitor.screen', params: {} });
  });

  it('separates a module tab from an app tab and from an earlier module tab of the same id', () => {
    const tabs = separateModuleTabs([tab('screen'), ...moduleTabs(['monitor', 'screen'], ['panel', 'screen'], ['panel', 'audio'])]);
    expect(tabs.map((t) => t.id)).toEqual(['screen', 'monitor.screen', 'panel.screen', 'audio']);
  });

  it('is stable when run twice and leaves app tabs alone', () => {
    const once = separateModuleTabs([tab('screen'), ...moduleTabs(['monitor', 'screen'])]);
    expect(separateModuleTabs(once, new Set(['screen']))).toEqual(once);
    expect(separateModuleTabs([tab('screen'), tab('screen')]).map((t) => t.id)).toEqual(['screen', 'screen']);
  });
});
