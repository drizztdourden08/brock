/* @layer renderer-shell @kind logic */
import type { CommandDef } from './command.type';
import { useCommandStore } from './useCommandStore';

const setCommandSource = (key: string, rank: number, defs: readonly CommandDef[]): (() => void) => {
  useCommandStore.setState((state) => {
    const kept = state.sources.some((source) => source.key === key);
    const source = { key, rank, defs };
    return { sources: kept ? state.sources.map((each) => (each.key === key ? source : each)) : [...state.sources, source] };
  });
  return () => useCommandStore.setState((state) => ({ sources: state.sources.filter((source) => source.key !== key) }));
};

export { setCommandSource };
