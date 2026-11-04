/* @layer renderer-shell @kind logic */
import { create } from 'zustand';
import type { ProviderState } from './provider.type';

const useProviderStore = create<ProviderState>(() => ({ provider: null }));

export { useProviderStore };
