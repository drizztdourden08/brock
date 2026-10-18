/* @layer renderer-shell @kind hook */
import type { SettingsStore } from '../../../stores/settings-store.type';
import type { VolumeSource } from '../../../volume/volume.type';
import { useScreenPersistence } from './useScreenPersistence';
import { useVolumeSource } from './useVolumeSource';

const useProfileViews = <S extends object>(settings: SettingsStore<S>, volume: VolumeSource | undefined, restoreNavigation = true): void => {
  useScreenPersistence(restoreNavigation);
  useVolumeSource(volume, settings);
};

export { useProfileViews };
