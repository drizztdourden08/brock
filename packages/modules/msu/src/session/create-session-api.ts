/* @layer core @kind logic */
import { msuSessionState } from '../msu-session';
import type { MsuSessionOptions } from '../msu-session';
import { createTraceHandlers } from '../music-debug';
import type { MsuEngine } from '../types';
import { disposeMsuSession } from './dispose-msu-session';
import type { EngineHolder, MsuSession } from './session.type';

const createSessionApi = <Ctx>(options: MsuSessionOptions<Ctx>, holder: EngineHolder<Ctx>): MsuSession<Ctx> => {
  const trace = createTraceHandlers(options.config);
  const live = (): MsuEngine<Ctx> | null =>
    (holder.engine !== null && msuSessionState.engine === holder.engine ? holder.engine : null);
  return {
    onMusicCue: (cue) => live()?.onMusicCtrl(cue),
    onGameSound: (channel, id, pan) => live()?.onGameSound(channel, id, pan),
    isPlaying: (cue) => live()?.isPlayingTrack(cue) ?? false,
    onSoundTrace: trace.onSoundTrace,
    onMusicTrace: trace.onMusicTrace,
    dispose: () => {
      if (msuSessionState.owner === holder) disposeMsuSession();
    },
  };
};

export { createSessionApi };
