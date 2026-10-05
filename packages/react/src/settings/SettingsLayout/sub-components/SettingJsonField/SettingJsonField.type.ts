/* @layer renderer-shell @kind types */
import type { SettingControl } from '../../../settings.type';

interface SettingJsonFieldProps {
  control: Extract<SettingControl, { kind: 'json' }>;
  value: unknown;
  onChange: (next: unknown) => void;
  label: string;
  disabled: boolean;
}

interface JsonProblem {
  message: string;
  line: number | undefined;
}

type JsonRead = { value: unknown; problem: null } | { value?: never; problem: JsonProblem };

interface JsonText {
  text: string;
  edit: (text: string) => void;
  problem: JsonProblem | null;
}

export type { JsonProblem, JsonRead, JsonText, SettingJsonFieldProps };
