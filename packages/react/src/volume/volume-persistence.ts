/* @layer renderer-shell @kind logic */
import { profileViews } from '../widgets/profile-views';
import { saneVolume } from './sane-volume';
import { useVolumeStore } from './useVolumeStore';
import { FULL_VOLUME } from './volume.constants';
import { volumeLink } from './volume-link';

const bound: { profileId: string | null } = { profileId: null };

const loadVolume = async (profileId: string | null, live: () => boolean = () => true): Promise<void> => {
  bound.profileId = null;
  if (!profileId) {
    useVolumeStore.setState(FULL_VOLUME);
    return;
  }
  const views = await profileViews.read(profileId);
  if (!live()) return;
  useVolumeStore.setState(saneVolume(views.volume));
  bound.profileId = profileId;
};

const watchVolume = (): (() => void) => useVolumeStore.subscribe((state, prev) => {
  const id = bound.profileId;
  if (!id || volumeLink.current() || (state.value === prev.value && state.muted === prev.muted)) return;
  void profileViews.patch(id, { volume: { value: state.value, muted: state.muted } });
});

const volumePersistence = { load: loadVolume, watch: watchVolume };

export { volumePersistence };
