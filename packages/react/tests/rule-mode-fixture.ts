/* @layer renderer-shell @kind test */
import { act } from 'react';
import type { ShowContext } from '../src/screens/show/show.type';
import { useShowFlagsStore } from '../src/screens/show/useShowFlagsStore';

const mode = (name: string) => ({ when: ({ flags }: ShowContext): boolean => flags.mode === name });

const setMode = (name: string | null): void => {
  act(() => useShowFlagsStore.getState().put('test', name === null ? {} : { mode: name }));
};

const availableIn = (snapshot: readonly { id: string; available: boolean }[], id: string): boolean => snapshot.find((each) => each.id === id)?.available ?? false;

export { availableIn, mode, setMode };
