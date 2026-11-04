/* @layer core @kind types */

interface SchemaSet {
  current: string;
  legacy?: readonly string[];
}

export type { SchemaSet };
