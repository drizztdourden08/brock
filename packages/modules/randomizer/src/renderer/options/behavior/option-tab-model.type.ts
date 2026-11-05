/* @layer renderer-shell @kind types */
import type { OptionTab } from '../../../contract/randomizer-views.type';
import type { RuleOptionValue } from '../../../world/types/rule-option-value.type';

interface OptionTabItem {
  id: string;
  label: string;
  badge: number;
}

interface OptionTabModel {
  items: readonly OptionTabItem[];
  active: OptionTab | null;
  values: Readonly<Record<string, RuleOptionValue>>;
  select(id: string): void;
}

export type { OptionTabItem, OptionTabModel };
