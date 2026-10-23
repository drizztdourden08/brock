/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import { commandEnabled } from './command-enabled';
import { useCommandGates } from './useCommandGates';
import { useCommandStore } from './useCommandStore';

const useCommandEnabled = (): ((id: string) => boolean) => {
  const sources = useCommandStore((state) => state.sources);
  const gates = useCommandGates((state) => state.gates);
  return useCallback((id: string) => commandEnabled({ sources, gates }, id), [sources, gates]);
};

export { useCommandEnabled };
