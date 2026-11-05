/* @layer renderer-shell @kind types */
import type { OptionDef } from '../../../world/options/option-def.type';
import type { RuleOptionValue } from '../../../world/types/rule-option-value.type';

interface UpcomingTabBodyProps {
  title: string;
  options: readonly OptionDef[];
  valueOf: (option: OptionDef) => RuleOptionValue;
  readout?: boolean;
}

export type { UpcomingTabBodyProps };
