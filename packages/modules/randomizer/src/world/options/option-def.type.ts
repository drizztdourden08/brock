/* @layer core @kind types */
interface OptionDef {
  key: string;
  label: string;
  default: unknown;
  frozen?: boolean;
}

export type { OptionDef };
