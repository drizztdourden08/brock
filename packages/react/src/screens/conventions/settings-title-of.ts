/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { SETTINGS_TITLE } from './screens.constants';
import type { ResolvedScreenTree } from './screen-tree.type';

const settingsTitleOf = (tree: ResolvedScreenTree | null): Text =>
  tree?.hubs.find((hub) => hub.id === tree.settingsBucket)?.title ?? SETTINGS_TITLE;

export { settingsTitleOf };
