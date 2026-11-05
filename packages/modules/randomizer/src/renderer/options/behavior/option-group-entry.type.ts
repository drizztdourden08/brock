/* @layer renderer-shell @kind types */
import type { OptionDef } from '../../../world/options/option-def.type';

interface OptionGroupEntry {
  id: string;
  label: string;
  options: readonly OptionDef[];
}

export type { OptionGroupEntry };
