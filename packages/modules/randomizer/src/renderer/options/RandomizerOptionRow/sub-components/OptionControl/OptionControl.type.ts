/* @layer renderer-shell @kind types */
import type { OptionDef } from '../../../../../world/options/option-def.type';
import type { RuleOptionValue } from '../../../../../world/types/rule-option-value.type';

interface OptionControlProps {
  option: OptionDef;
  value: RuleOptionValue;
  frozen: boolean;
  readout: boolean;
  onChange?: (value: RuleOptionValue) => void;
}

export type { OptionControlProps };
