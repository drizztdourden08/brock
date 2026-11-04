/* @layer renderer-shell @kind types */
import type { OptionDef } from '../../../../../world/options/option-def.type';

interface OptionFieldProps {
  option: OptionDef;
  value: unknown;
  onChange(value: unknown): void;
}

export type { OptionFieldProps };
