/* @layer renderer-shell @kind logic */
import { joinRoute } from '../../navigation/join-route';
import type { TabDef } from '../../settings/settings.type';
import { entryLabel } from './entry-label';
import { iconNode } from './icon-node';
import { KIND_ICONS } from './screens.constants';
import type { SettingsEntry } from './screen-tree.type';
import { settingsSections } from './settings-sections';

const settingsTab = (entry: SettingsEntry): TabDef<object> => ({
  id: joinRoute(entry.bucket, entry.id),
  label: entryLabel(entry),
  navIcon: iconNode(entry.meta?.icon ?? KIND_ICONS.settings),
  group: entry.group ?? entry.bucket,
  sections: (settings) => settingsSections(entry.sections, settings),
  ...(entry.meta?.source ? { source: entry.meta.source } : {}),
  ...(entry.meta?.preview ? { preview: entry.meta.preview, previewPlacement: entry.meta.previewPlacement, previewLabel: entry.meta.previewLabel } : {}),
});

export { settingsTab };
