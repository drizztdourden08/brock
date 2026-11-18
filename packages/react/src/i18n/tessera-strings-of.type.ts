/* @layer renderer-shell @kind types */
type StringFunction = (...args: string[]) => string;
type Group = Record<string, string | StringFunction>;
type Groups = Record<string, Group>;
type ParamTable = Record<string, Record<string, readonly string[]> | undefined>;

export type { Group, Groups, ParamTable, StringFunction };
