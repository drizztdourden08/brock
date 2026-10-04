/* @layer renderer-shell @kind types */
import type { StoreApi, UseBoundStore } from 'zustand';

type SettingsEffect<S> = (patch: Partial<S>, next: S, prev: S) => void;

type SettingsSaveStatus = 'idle' | 'saving' | 'saved' | 'failed';

interface SettingsWrite<S> {
  profileId: string;
  settings: S;
}

interface SettingsSaveState {
  saveStatus: SettingsSaveStatus;
  saveError: string | null;
  savedAt: number | null;
}

type SettingsSaveReport = (report: Partial<SettingsSaveState>) => void;

interface SettingsSaver<S> {
  schedule: (profileId: string, settings: S) => void;
  flush: () => Promise<void>;
  retry: () => Promise<void>;
  clear: () => void;
}

interface SettingsState<S extends object> extends SettingsSaveState {
  settings: S;
  hydrated: boolean;
  profileId: string | null;
  hydrate: (profileId: string) => Promise<void>;
  patch: (patch: Partial<S>) => void;
  retrySave: () => Promise<void>;
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

export type {
  CreateSettingsStoreOptions, SettingsEffect, SettingsSaveReport, SettingsSaver, SettingsSaveState, SettingsSaveStatus, SettingsState, SettingsStore, SettingsWrite,
  UseSettingsResult,
};
