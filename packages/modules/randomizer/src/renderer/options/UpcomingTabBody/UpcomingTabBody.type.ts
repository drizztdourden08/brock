/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { OptionDef } from '../../../world/options/option-def.type';
import type { RuleOptionValue } from '../../../world/types/rule-option-value.type';

interface UpcomingTabBodyProps {
  title: Text;
  options: readonly OptionDef[];
  valueOf: (option: OptionDef) => RuleOptionValue;
  readout?: boolean;
}

export type { UpcomingTabBodyProps };
