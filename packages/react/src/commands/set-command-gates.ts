/* @layer renderer-shell @kind logic */
import type { CommandDef } from './command.type';
import { useCommandGates } from './useCommandGates';

const gatesOf = (defs: readonly CommandDef[]): Record<string, boolean> =>
  Object.fromEntries(defs.flatMap((def) => (def.when === undefined ? [] : [[def.id, def.when() !== false] as const])));

const same = (a: Readonly<Record<string, boolean>> | undefined, b: Readonly<Record<string, boolean>>): boolean => {
  const keys = Object.keys(b);
  if (a === undefined) return keys.length === 0;
  return keys.length === Object.keys(a).length && keys.every((key) => a[key] === b[key]);
};

const setCommandGates = (key: string, defs: readonly CommandDef[]): void => {
  const next = gatesOf(defs);
  if (same(useCommandGates.getState().gates[key], next)) return;
  useCommandGates.setState((state) => ({ gates: { ...state.gates, [key]: next } }));
};

export { setCommandGates };
