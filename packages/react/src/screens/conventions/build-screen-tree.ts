/* @layer renderer-shell @kind logic */
import { assertScreensConfig } from './assert-screens-config';
import { bucketHub } from './bucket-hub';
import { cardScreen } from './card-screen';
import { isBucketEntry } from './is-bucket-entry';
import { isCardEntry } from './is-card-entry';
import { pageShortcuts } from './page-shortcuts';
import { settingsTab } from './settings-tab';
import type { ScreensConfig } from './screens-config.type';
import type { SearchEntry } from '../../search/search.type';
import type { BaseEntry, ScreenEntry, ScreenTree, SettingsEntry } from './screen-tree.type';

const isSettings = (entry: ScreenEntry): entry is SettingsEntry => entry.kind === 'settings';

const isBase = (entry: ScreenEntry): entry is BaseEntry => entry.kind === 'base';

const buildScreenTree = (config: ScreensConfig, entries: readonly ScreenEntry[], search: readonly SearchEntry[] = []): ScreenTree => {
  assertScreensConfig(config, entries);
  const inBucket = (id: string) => entries.filter(isBucketEntry).filter((entry) => entry.bucket === id);
  const base = entries.find(isBase);
  return {
    config,
    hubs: config.buckets.map((bucket) => bucketHub(bucket, inBucket(bucket.id))),
    screens: entries.filter(isCardEntry).map(cardScreen),
    base: base === undefined ? undefined : cardScreen(base),
    tabs: entries.filter(isSettings).map(settingsTab),
    shortcuts: pageShortcuts(entries),
    search,
  };
};

export { buildScreenTree };
