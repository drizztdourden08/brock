/* @layer renderer-shell @kind types */
import type { StoreApi, UseBoundStore } from 'zustand';

type SessionStore<T> = UseBoundStore<StoreApi<T>> & { reset: () => void };

export type { SessionStore };
