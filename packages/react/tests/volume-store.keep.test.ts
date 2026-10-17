/* @layer renderer-shell @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSettingsStore } from '../src/stores/create-settings-store';
import type { SettingsStore } from '../src/stores/settings-store.type';
import { volumeBarAction } from '../src/title-bar/volume-bar-action';
import { bindVolume } from '../src/volume/bind-volume';
import { useVolumeStore } from '../src/volume/useVolumeStore';
import { volumeFromSettings } from '../src/volume/volume-from-settings';
import { volumePersistence } from '../src/volume/volume-persistence';
import type { VolumeBinding, VolumeLevel } from '../src/volume/volume.type';

const views = vi.hoisted(() => {
  const stored: Record<string, Record<string, unknown>> = {};
  const patches: [string, unknown][] = [];
  return { stored, patches };
});

vi.mock('../src/widgets/profile-views', () => ({
  profileViews: {
    read: (id: string) => Promise.resolve(views.stored[id] ?? {}),
    patch: (id: string, next: unknown) => {
      views.patches.push([id, next]);
      return Promise.resolve();
    },
  },
}));

interface AppSettings {
  theme: string;
  audio: { master: number; muted: boolean; music: number };
}

const settingsStore = (): SettingsStore<AppSettings> => createSettingsStore<AppSettings>({
  defaults: { theme: 'dark', audio: { master: 60, muted: false, music: 40 } },
  load: () => Promise.resolve(null),
  save: () => Promise.resolve(),
});

const barOf = () => {
  const { value, muted, setValue, toggleMute } = useVolumeStore.getState();
  return volumeBarAction('sound', { kind: 'volume', label: 'Volume', value, muted, onChange: setValue, onMuteToggle: toggleMute });
};

beforeEach(() => {
  useVolumeStore.setState({ value: 1, muted: false });
  views.stored = {};
  views.patches = [];
});

describe('useVolumeStore on its own', () => {
  it('keeps the level between 0 and 1 and toggles mute', () => {
    const { setValue, toggleMute } = useVolumeStore.getState();
    setValue(1.5);
    expect(useVolumeStore.getState().value).toBe(1);
    setValue(0.4);
    toggleMute();
    expect(useVolumeStore.getState()).toMatchObject({ value: 0.4, muted: true });
    toggleMute();
    expect(useVolumeStore.getState().muted).toBe(false);
  });

  it('unmutes when the level is raised, and brings back the last level from zero', () => {
    const { setValue, setMuted, toggleMute } = useVolumeStore.getState();
    setValue(0.7);
    setMuted(true);
    setValue(0.5);
    expect(useVolumeStore.getState()).toMatchObject({ value: 0.5, muted: false });
    setValue(0);
    toggleMute();
    expect(useVolumeStore.getState()).toMatchObject({ value: 0.5, muted: false });
  });

  it('loads the level of the active profile and saves each change to it', async () => {
    views.stored.p1 = { volume: { value: 0.25, muted: true } };
    await volumePersistence.load('p1');
    expect(useVolumeStore.getState()).toMatchObject({ value: 0.25, muted: true });
    const stop = volumePersistence.watch();
    useVolumeStore.getState().toggleMute();
    stop();
    expect(views.patches).toEqual([['p1', { volume: { value: 0.25, muted: false } }]]);
  });

  it('reads a stored level that is not a level as full volume', async () => {
    views.stored.p2 = { volume: { value: 'loud' } };
    await volumePersistence.load('p2');
    expect(useVolumeStore.getState()).toMatchObject({ value: 1, muted: false });
  });
});

describe('a volume binding', () => {
  const binding = (start: VolumeLevel) => {
    let level = start;
    const listeners = new Set<() => void>();
    const live: VolumeBinding = {
      get: () => level,
      set: (next) => {
        level = next;
        for (const listener of listeners) listener();
      },
      subscribe: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    };
    return live;
  };

  it('makes the store read and write through the app, and saves nothing to the profile', async () => {
    const app = binding({ value: 0.3, muted: false });
    const stop = bindVolume(app);
    expect(useVolumeStore.getState().value).toBe(0.3);
    await volumePersistence.load('p1');
    const unwatch = volumePersistence.watch();
    app.set({ value: 0.6, muted: true });
    expect(useVolumeStore.getState()).toMatchObject({ value: 0.6, muted: true });
    useVolumeStore.getState().toggleMute();
    expect(app.get()).toEqual({ value: 0.6, muted: false });
    unwatch();
    stop();
    expect(views.patches).toEqual([]);
  });
});

describe('volumeFromSettings', () => {
  it('moves the title bar item and the app settings together, both ways', () => {
    const settings = settingsStore();
    const stop = bindVolume(volumeFromSettings({ value: 'audio.master', muted: 'audio.muted', max: 100 })(settings));
    expect(barOf()).toMatchObject({ bar: 'volume', value: 0.6, muted: false });

    settings.getState().patch({ audio: { ...settings.getState().settings.audio, muted: true } });
    expect(barOf()).toMatchObject({ value: 0.6, muted: true });

    barOf().onMutedChange(false);
    expect(settings.getState().settings.audio).toEqual({ master: 60, muted: false, music: 40 });

    barOf().onChange(0.25);
    expect(settings.getState().settings).toEqual({ theme: 'dark', audio: { master: 25, muted: false, music: 40 } });
    expect(barOf()).toMatchObject({ value: 0.25, muted: false });
    stop();
  });

  it('works on top level keys with a 0 to 1 level', () => {
    const settings = createSettingsStore<{ volume: number; mute: boolean }>({ defaults: { volume: 0.5, mute: false }, load: () => Promise.resolve(null), save: () => Promise.resolve() });
    const stop = bindVolume(volumeFromSettings({ value: 'volume', muted: 'mute' })(settings));
    expect(useVolumeStore.getState()).toMatchObject({ value: 0.5, muted: false });
    useVolumeStore.getState().toggleMute();
    expect(settings.getState().settings).toEqual({ volume: 0.5, mute: true });
    stop();
  });
});
