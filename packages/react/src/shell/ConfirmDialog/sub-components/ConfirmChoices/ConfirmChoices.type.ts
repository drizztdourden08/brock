/* @layer renderer-shell @kind types */
import type { ChoiceLook, DialogChoice } from '../../../../stores/dialog.type';

interface ConfirmChoicesProps {
  choices: readonly DialogChoice[];
  value: string | undefined;
  label: string;
  look?: ChoiceLook;
  searchable?: boolean;
  onChange: (value: string) => void;
}

export type { ConfirmChoicesProps };
