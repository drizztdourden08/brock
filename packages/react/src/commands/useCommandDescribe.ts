/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import type { CommandDescription } from './command.type';
import { commands } from './commands';
import { useCommandGates } from './useCommandGates';
import { useCommandStore } from './useCommandStore';

const useCommandDescribe = (): ((id: string) => CommandDescription) => {
  const sources = useCommandStore((state) => state.sources);
  const views = useCommandGates((state) => state.views);
  return useCallback((id: string) => commands.describe(id), [sources, views]);
};

export { useCommandDescribe };
