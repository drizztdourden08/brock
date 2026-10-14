/* @layer renderer-shell @kind types */
import type { Hint } from '@drizztdourden08/tessera/primitives';

interface ChoiceRow {
  value: string;
  label: string;
  disabled: boolean;
  hint?: Hint;
}

export type { ChoiceRow };
