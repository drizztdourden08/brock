/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { StatusTone } from '@drizztdourden08/tessera/primitives';

interface RowChipDef {
  label: Text;
  tone: StatusTone;
}

export type { RowChipDef };
