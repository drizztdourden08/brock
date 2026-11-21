/* @layer core @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { RuleOptionValue } from '../types/rule-option-value.type';
import type { OptionDetail, OptionImplementation, OptionKind, OptionRange } from './option-parts.type';

interface OptionDef {
  key: string;
  label: Text;
  default: unknown;
  frozen?: boolean;
  choices?: readonly RuleOptionValue[];
  choiceLabels?: Readonly<Record<string, Text>>;
  section?: string;
  hint?: Text;
  kind?: OptionKind;
  range?: OptionRange;
  group?: string;
  description?: Text;
  details?: readonly OptionDetail[];
  implementation?: OptionImplementation;
}

export type { OptionDef };
