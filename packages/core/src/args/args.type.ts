/* @layer core @kind types */
type ArgValue = string | number | boolean;

interface ArgOption {
  value: ArgValue;
  label: string;
}

interface ArgField {
  type: 'string' | 'number' | 'boolean';
  label?: string;
  options?: readonly ArgOption[];
  min?: number;
  max?: number;
  optional?: boolean;
}

type ArgSchema = Readonly<Record<string, ArgField>>;

export type { ArgField, ArgOption, ArgSchema, ArgValue };
