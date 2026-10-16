/* @layer renderer-shell @kind types */
import type { SettingsStore } from '../stores/settings-store.type';

interface VolumeLevel {
  value: number;
  muted: boolean;
}

interface VolumeBinding {
  get: () => VolumeLevel;
  set: (next: VolumeLevel) => void;
  subscribe: (listener: () => void) => () => void;
}

type VolumeBindingFactory = (settings: SettingsStore<object>) => VolumeBinding;

type VolumeSource = VolumeBinding | VolumeBindingFactory;

interface VolumeState extends VolumeLevel {
  setValue: (value: number) => void;
  setMuted: (muted: boolean) => void;
  toggleMute: () => void;
}

interface VolumeSettingsKeys {
  value: string;
  muted: string;
  max?: number;
}

interface VolumeItemOptions {
  label?: string;
  shortcut?: string;
}

export type { VolumeBinding, VolumeBindingFactory, VolumeItemOptions, VolumeLevel, VolumeSettingsKeys, VolumeSource, VolumeState };
