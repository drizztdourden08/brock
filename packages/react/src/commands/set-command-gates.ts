/* @layer renderer-shell @kind logic */
import { commandBlock } from './command-block';
import type { CommandDef } from './command.type';
import { useCommandGates } from './useCommandGates';

const gatesOf = (defs: readonly CommandDef[]): Record<string, boolean> =>
  Object.fromEntries(defs.flatMap((def) => (def.when === undefined ? [] : [[def.id, def.when() !== false] as const])));

const viewsOf = (defs: readonly CommandDef[]): Record<string, string> =>
  Object.fromEntries(defs.flatMap((def) => (
    def.when === undefined && def.visible === undefined && def.reason === undefined ? [] : [[def.id, JSON.stringify(commandBlock(def))] as const]
  )));

const same = <T>(a: Readonly<Record<string, T>> | undefined, b: Readonly<Record<string, T>>): boolean => {
  const keys = Object.keys(b);
  if (a === undefined) return keys.length === 0;
  return keys.length === Object.keys(a).length && keys.every((key) => a[key] === b[key]);
};

const setCommandGates = (key: string, defs: readonly CommandDef[]): void => {
  const next = gatesOf(defs);
  const views = viewsOf(defs);
  const { gates, views: seen } = useCommandGates.getState();
  if (same(gates[key], next) && same(seen[key], views)) return;
  useCommandGates.setState((state) => ({ gates: { ...state.gates, [key]: next }, views: { ...state.views, [key]: views } }));
};

export { setCommandGates };
