/* @layer core @kind logic */
import type { MsuResumeState } from '../../types';
import type { SoundChannelApi } from '../channel';

const snapshotMsu = (music: SoundChannelApi, bed: SoundChannelApi | undefined): MsuResumeState | null => {
  const track = music.snapshot();
  if (!track) return null;
  const state = bed?.snapshot();
  return {
    trackNum: track.id,
    layers: track.layers,
    ambient: state ? { soundId: state.id, layers: state.layers } : null,
  };
};

export { snapshotMsu };
