/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { OptionDef } from '../../../world/options/option-def.type';

interface OptionGroupEntry {
  id: string;
  label: Text;
  options: readonly OptionDef[];
}

export type { OptionGroupEntry };
