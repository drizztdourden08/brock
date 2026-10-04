/* @layer renderer-shell @kind logic */
import { defineHub } from '../../hub/define-hub';
import type { TabDef } from '../../settings/settings.type';
import { deriveMenu } from './derive-menu';
import { placeSettingsTabs } from './place-settings-tabs';
import { settingsAlias } from './settings-alias';
import { settingsBucketOf } from './settings-bucket-of';
import { SETTINGS_ALIAS, SETTINGS_SHORTCUT } from './screens.constants';
import type { ResolvedScreenTree, ScreenTree } from './screen-tree.type';

const resolveScreenTree = (tree: ScreenTree, builtInTabs: readonly TabDef<object>[]): ResolvedScreenTree => {
  const { config } = tree;
  const settingsBucket = settingsBucketOf(config);
  const hubs = tree.hubs.map((hub) => (hub.id === settingsBucket ? placeSettingsTabs(hub, builtInTabs) : hub));
  const owner = hubs.find((hub) => hub.id === settingsBucket);
  const tabs = [...tree.tabs, ...builtInTabs];
  if (owner === undefined) throw new Error(`screens.config.ts: settings bucket "${settingsBucket}" is not declared.`);
  return {
    home: config.home,
    base: tree.base?.id ?? null,
    settingsBucket,
    hubs,
    screens: [...hubs.map((hub) => defineHub(hub)), ...tree.screens, ...(tree.base ? [tree.base] : [])],
    tabs,
    menu: deriveMenu(config, hubs, tree.screens),
    shortcuts: [{ shortcut: SETTINGS_SHORTCUT, target: SETTINGS_ALIAS }, ...tree.shortcuts],
    settingsAlias: settingsAlias(owner, tabs, config.settings?.page),
    search: tree.search,
  };
};

export { resolveScreenTree };
