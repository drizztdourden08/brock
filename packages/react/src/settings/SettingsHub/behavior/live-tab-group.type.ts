/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { SearchResultsGroup } from '@drizztdourden08/tessera/composites';
import type { SettingsControlProps, TabDef } from '../../settings.type';

interface LiveTabGroupInput<S extends object> {
  tab: TabDef<S>;
  count: number;
  query: string;
  text?: (value: Text) => string;
  control: SettingsControlProps<S>;
  page?: Pick<SearchResultsGroup, 'id' | 'label' | 'icon'>;
}

export type { LiveTabGroupInput };
