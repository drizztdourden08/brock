/* @layer core @kind logic */
import type { MsuTrackReport } from '../../types';
import type { SoundChannelApi } from '../channel';

const reportTrack = (music: SoundChannelApi): MsuTrackReport | null => {
  const state = music.report();
  if (!state) return null;
  return { trackNum: state.id, elapsedSeconds: state.elapsedSeconds, layers: state.layers };
};

export { reportTrack };
