/* @layer core @kind logic */
import type { MsuResumeState } from '../../types';
import type { SoundChannelApi } from '../channel';

const restoreMsu = (music: SoundChannelApi, bed: SoundChannelApi | undefined, state: MsuResumeState | null): void => {
  music.restore(state ? { id: state.trackNum, layers: state.layers } : null);
  const savedBeforeBedsResumed = state?.ambient === undefined;
  if (savedBeforeBedsResumed || !bed) return;
  bed.restore(state.ambient ? { id: state.ambient.soundId, layers: state.ambient.layers } : null);
};

export { restoreMsu };
