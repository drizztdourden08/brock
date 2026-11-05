/* @layer renderer-shell @kind types */
import type { OptionDef } from '../../../world/options/option-def.type';
import type { RuleOptionValue } from '../../../world/types/rule-option-value.type';
import type { ImpactCell } from '../PoolImpactCell';

interface RandomizerOptionRowProps {
  option: OptionDef;
  value: RuleOptionValue;
  onChange?: (value: RuleOptionValue) => void;
  impact?: ImpactCell;
  disabled?: boolean;
  note?: string;
  readout?: boolean;
}

export type { RandomizerOptionRowProps };
