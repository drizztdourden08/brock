/* @layer renderer-shell @kind types */
import type { OptionDef } from '../../../world/options/option-def.type';
import type { RuleOptionValue } from '../../../world/types/rule-option-value.type';
import type { OptionGroupEntry } from '../behavior/option-group-entry.type';
import type { ImpactCell } from '../PoolImpactCell';

interface OptionGroupListProps {
  groups: readonly OptionGroupEntry[];
  valueOf: (option: OptionDef) => RuleOptionValue;
  cellOf?: (key: string) => ImpactCell | undefined;
  live?: boolean;
  frozen?: boolean;
  notes?: ReadonlyMap<string, string>;
  onRowChange?: (key: string, next: RuleOptionValue) => void;
  readout?: boolean;
}

export type { OptionGroupListProps };
