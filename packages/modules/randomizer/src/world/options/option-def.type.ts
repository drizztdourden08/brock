/* @layer core @kind types */
import type { RuleOptionValue } from '../types/rule-option-value.type';
import type { OptionDetail, OptionImplementation, OptionKind, OptionRange } from './option-parts.type';

interface OptionDef {
  key: string;
  label: string;
  default: unknown;
  frozen?: boolean;
  choices?: readonly RuleOptionValue[];
  choiceLabels?: Readonly<Record<string, string>>;
  section?: string;
  hint?: string;
  kind?: OptionKind;
  range?: OptionRange;
  group?: string;
  description?: string;
  details?: readonly OptionDetail[];
  implementation?: OptionImplementation;
}

export type { OptionDef };
