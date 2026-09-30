/* @layer renderer-shell @kind logic */
import type { ResolvedScreenTree } from '../../screens/conventions/screen-tree.type';
import { SETTINGS_BREADCRUMB } from '../search.constants';
import type { SettingsPlace } from '../search.type';

const settingsPlaceOf = (tree: ResolvedScreenTree | null): SettingsPlace => {
  const hub = tree?.hubs.find((candidate) => candidate.id === tree.settingsBucket);
  return hub ? { bucket: hub.id, title: hub.title } : { bucket: null, title: SETTINGS_BREADCRUMB };
};

export { settingsPlaceOf };
