/* @layer core @kind types */
import type { RuleOptionValue } from '../types/rule-option-value.type';

interface OptionDef {
  key: string;
  label: string;
  default: unknown;
  frozen?: boolean;
  choices?: readonly RuleOptionValue[];
  choiceLabels?: Readonly<Record<string, string>>;
  section?: string;
  hint?: string;
}

export type { OptionDef };
