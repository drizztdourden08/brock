/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { fallbackText } from '../../i18n/fallback-text';
import type { ResolvedScreenTree } from '../../screens/conventions/screen-tree.type';
import { SETTINGS_BREADCRUMB } from '../search.constants';
import type { SettingsPlace } from '../search.type';

const settingsPlaceOf = (tree: ResolvedScreenTree | null, text: (value: Text) => string = fallbackText): SettingsPlace => {
  const hub = tree?.hubs.find((candidate) => candidate.id === tree.settingsBucket);
  return hub ? { bucket: hub.id, title: text(hub.title) } : { bucket: null, title: text(SETTINGS_BREADCRUMB) };
};

export { settingsPlaceOf };
