/* @layer renderer-shell @kind logic */
import { SETTINGS_TITLE } from './screens.constants';
import type { ResolvedScreenTree } from './screen-tree.type';

const settingsTitleOf = (tree: ResolvedScreenTree | null): string =>
  tree?.hubs.find((hub) => hub.id === tree.settingsBucket)?.title ?? SETTINGS_TITLE;

export { settingsTitleOf };
