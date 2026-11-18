/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { ResolvedScreenTree } from '../screens/conventions/screen-tree.type';
import type { ScreenRegistry } from '../screens/screen-registry.type';
import type { TabDef } from '../settings/settings.type';
import type { SettingsStore } from '../stores/settings-store.type';

interface ControlSources {
  tabs: readonly TabDef<object>[];
  settings: SettingsStore<object> | null;
  screens: ScreenRegistry | null;
  tree: ResolvedScreenTree | null;
  text: (value: Text) => string;
}

export type { ControlSources };
