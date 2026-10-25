/* @layer renderer-shell @kind logic */
import { create } from 'zustand';
import type { RegistryState } from './registry-store.type';

const createRegistryStore = <T>() => create<RegistryState<T>>()((set) => ({
  groups: [],
  add: (items) => {
    const group = [...items];
    set(({ groups }) => ({ groups: [...groups, group] }));
    return () => set(({ groups }) => ({ groups: groups.filter((candidate) => candidate !== group) }));
  },
}));

export { createRegistryStore };
