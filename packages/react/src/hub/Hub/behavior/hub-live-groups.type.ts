/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { SettingsControlProps, TabDef } from '../../../settings/settings.type';
import type { HubPage } from '../../hub.type';

interface HubLiveInput<S extends object> {
  pages: readonly HubPage[];
  tabs: readonly TabDef<S>[];
  query: string;
  control: SettingsControlProps<S>;
  text: (value: Text) => string;
}

export type { HubLiveInput };
