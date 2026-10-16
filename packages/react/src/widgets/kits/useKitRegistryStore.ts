/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { KitRegistryState } from './widget-kit.type';

const useKitRegistryStore = create<KitRegistryState>()((set) => ({
  registered: [],
  add: (kits) => {
    const added = new Set(kits);
    set((state) => ({ registered: [...state.registered, ...kits] }));
    return () => set((state) => ({ registered: state.registered.filter((kit) => !added.has(kit)) }));
  },
}));

export { useKitRegistryStore };
