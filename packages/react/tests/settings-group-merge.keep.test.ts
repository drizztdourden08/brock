/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { createElement } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import type { HubDef } from '../src/hub/hub.type';
import { mergeModules } from '../src/modules/merge-modules';
import { navGroupChecks } from '../src/review/checks/nav-group-checks';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import { resolveScreenTree } from '../src/screens/conventions/resolve-screen-tree';
import type { ScreenEntry } from '../src/screens/conventions/screen-tree.type';
import type { BucketGroupDef, ScreensConfig } from '../src/screens/conventions/screens-config.type';
import { useHubNav } from '../src/settings/SettingsHub/behavior/useHubNav';
import type { HubNavModel } from '../src/settings/SettingsHub/SettingsHub.type';
import type { TabDef } from '../src/settings/settings.type';
import { showHarness } from './show-harness';

const View = () => null;

const config = (groups: BucketGroupDef[]): ScreensConfig => ({
  buckets: [{ id: 'main', title: 'Main', icon: 'house', menu: 'entry', groups }],
  home: 'main',
});

const ENTRIES: ScreenEntry[] = [
  { kind: 'hero', bucket: 'main', id: 'home', component: View },
  { kind: 'settings', bucket: 'main', group: 'app', id: 'general', sections: [] },
  { kind: 'settings', bucket: 'main', group: 'look', id: 'colors', sections: [] },
];

const tab = (id: string, group: string, groupId?: string): TabDef<object> => ({ id, label: id, navIcon: null, group, groupId, sections: () => [] });

const moduleTabs = (...tabs: TabDef<object>[]): TabDef<object>[] =>
  mergeModules(tabs.map((def) => ({ id: `${def.id}-module`, settingsTabs: [def] }))).settingsTabs;

const groupsOf = (groups: BucketGroupDef[], tabs: TabDef<object>[]): { id: string; label: string; pages: string[] }[] => {
  const hub: HubDef | undefined = resolveScreenTree(buildScreenTree(config(groups), ENTRIES), tabs).hubs[0];
  return hub?.groups.map((group) => ({ id: group.id, label: group.label, pages: group.pages.map((page) => page.id) })) ?? [];
};

const itemId = (item: { id: string }): string => item.id;

const APP_GROUPS: BucketGroupDef[] = [{ id: 'app', label: 'App' }, { id: 'look', label: 'Look' }];

const MERGED = [
  { id: 'app', label: 'App', pages: ['general', 'display'] },
  { id: 'look', label: 'Look', pages: ['colors'] },
];

afterEach(showHarness.resetShow);

describe('settings group merge', () => {
  it('puts a module tab in the app group with the same id, after the app pages', () => {
    expect(groupsOf(APP_GROUPS, moduleTabs(tab('display', 'App', 'app')))).toEqual(MERGED);
  });

  it('puts a module tab without an id in the app group with the same label, whatever its case', () => {
    expect(groupsOf(APP_GROUPS, moduleTabs(tab('display', 'app ')))).toEqual(MERGED);
  });

  it('matches the id first, then the label', () => {
    expect(groupsOf(APP_GROUPS, moduleTabs(tab('screen', 'Hardware', 'look')))[1]).toEqual({ id: 'look', label: 'Look', pages: ['colors', 'screen'] });
    const byLabel = groupsOf([{ id: 'other', label: 'App' }], moduleTabs(tab('display', 'App', 'app')));
    expect(byLabel.filter((group) => group.label === 'App')).toHaveLength(1);
  });

  it('gives tabs no app group takes one group of their own, after the app groups, shared by id or label', () => {
    const groups = groupsOf(APP_GROUPS, moduleTabs(tab('pads', 'Hardware', 'hardware'), tab('wheel', 'hardware')));
    expect(groups.at(-1)).toEqual({ id: 'hardware', label: 'Hardware', pages: ['pads', 'wheel'] });
    expect(groupsOf(APP_GROUPS, moduleTabs(tab('pads', 'Hardware'))).at(-1)?.id).toBe('settings-hardware');
  });

  it('leaves no two groups with the same label', () => {
    const groups = groupsOf(APP_GROUPS, moduleTabs(tab('display', 'App', 'app'), tab('audio', 'App'), tab('theme', 'Look')));
    const labels = groups.map((group) => group.label);
    expect(new Set(labels).size).toBe(labels.length);
    expect(navGroupChecks('main', labels)[0]?.pass).toBe(true);
  });
});

describe('navGroupChecks', () => {
  it('fails a nav with two groups of the same label', () => {
    const [check] = navGroupChecks('settings', ['App', 'Look', 'app']);
    expect(check?.pass).toBe(false);
    expect(check?.reason).toBe('the "settings" nav shows more than one group named "app"');
  });
});

describe('useHubNav', () => {
  it('groups tabs by id first, then by label', () => {
    const seen: { model: HubNavModel<object> | null } = { model: null };
    const Probe = () => {
      seen.model = useHubNav([tab('home', 'App'), tab('general', 'App', 'app'), tab('display', 'Display', 'app'), tab('audio', 'app')], 'desktop');
      return null;
    };
    showHarness.render(createElement(Probe));
    const [group, ...rest] = seen.model?.navConfig.groups ?? [];
    expect(rest).toEqual([]);
    expect(group?.id).toBe('app');
    expect(group?.items.map(itemId)).toEqual(['general', 'display', 'audio']);
  });
});
