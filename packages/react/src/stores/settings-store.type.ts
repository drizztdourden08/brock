/* @layer renderer-shell @kind types */
import type { StoreApi, UseBoundStore } from 'zustand';

type SettingsEffect<S> = (patch: Partial<S>, next: S, prev: S) => void;

interface SettingsState<S extends object> {
  settings: S;
  hydrated: boolean;
  profileId: string | null;
  hydrate: (profileId: string) => Promise<void>;
  patch: (patch: Partial<S>) => void;
  reset: () => void;
}

interface CreateSettingsStoreOptions<S extends object> {
  defaults: S;
  load: (profileId: string) => Promise<Partial<S> | null>;
  save: (profileId: string, settings: S) => Promise<void>;
  effects?: readonly SettingsEffect<S>[];
  saveDelayMs?: number;
}

type SettingsStore<S extends object> = UseBoundStore<StoreApi<SettingsState<S>>> & {
  addEffect: (effect: SettingsEffect<S>) => () => void;
  flush: () => Promise<void>;
};

interface UseSettingsResult<S extends object> {
  settings: S;
  patch: (patch: Partial<S>) => void;
  hydrated: boolean;
}

export type { CreateSettingsStoreOptions, SettingsEffect, SettingsState, SettingsStore, UseSettingsResult };
