/* @layer renderer-shell @kind logic */
import { useBootProgressStore } from './useBootProgressStore';

const bootProgress = {
  start: (message: string, ratio: number | null = null): void =>
    useBootProgressStore.getState().update({ phase: 'working', message, ratio }),
  update: (message: string, ratio: number | null): void =>
    useBootProgressStore.getState().update({ message, ratio }),
  ready: (message = ''): void => useBootProgressStore.getState().update({ phase: 'ready', message, ratio: 1 }),
  error: (message: string): void => useBootProgressStore.getState().update({ phase: 'error', message }),
  reset: (): void => useBootProgressStore.getState().reset(),
};

export { bootProgress };
