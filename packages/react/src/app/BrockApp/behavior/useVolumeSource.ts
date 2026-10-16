/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { SettingsStore } from '../../../stores/settings-store.type';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { bindVolume } from '../../../volume/bind-volume';
import { volumePersistence } from '../../../volume/volume-persistence';
import type { VolumeSource } from '../../../volume/volume.type';

const useVolumeSource = <S extends object>(source: VolumeSource | undefined, settings: SettingsStore<S>): void => {
  const profileId = useProfilesStore((s) => s.active?.id ?? null);
  const bound = source !== undefined;

  useEffect(() => {
    if (!source) return undefined;
    return bindVolume(typeof source === 'function' ? source(settings) : source);
  }, [source, settings]);

  useEffect(() => {
    if (bound) return undefined;
    let live = true;
    void volumePersistence.load(profileId, () => live);
    return () => { live = false; };
  }, [bound, profileId]);

  useEffect(() => (bound ? undefined : volumePersistence.watch()), [bound]);
};

export { useVolumeSource };
