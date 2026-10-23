/* @layer renderer-shell @kind hook */
import { useShallow } from 'zustand/react/shallow';
import type { CommandState } from './command.type';
import { useCommandStore } from './useCommandStore';

const useCommandState = (): Omit<CommandState, 'persist'> =>
  useCommandStore(useShallow(({ sources, overrides, mac }) => ({ sources, overrides, mac })));

export { useCommandState };
