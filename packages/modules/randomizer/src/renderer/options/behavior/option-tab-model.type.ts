/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { OptionTab } from '../../../contract/randomizer-views.type';
import type { RuleOptionValue } from '../../../world/types/rule-option-value.type';

interface OptionTabItem {
  id: string;
  label: Text;
  badge: number;
}

interface OptionTabModel {
  items: readonly OptionTabItem[];
  active: OptionTab | null;
  values: Readonly<Record<string, RuleOptionValue>>;
  select(id: string): void;
}

export type { OptionTabItem, OptionTabModel };
