/* @layer core @kind types */
import type { MsuChannelReport } from './msu-channel-report.type';
import type { MsuResumeState } from './msu-resume-state.type';
import type { MsuTrackReport } from './msu-track-report.type';
import type { MusicCue } from './music-cue.type';

interface MsuEngine<Ctx = unknown> {
  onMusicCtrl: (cue: MusicCue<Ctx>) => void;
  onGameSound: (channel: number, id: number, pan: number) => void;
  isPlayingTrack: (cue: MusicCue<Ctx>) => boolean;
  syncVolume: () => void;
  snapshot: () => MsuResumeState | null;
  report: () => MsuTrackReport | null;
  reportChannel: (name: string) => MsuChannelReport | null;
  restore: (state: MsuResumeState | null) => void;
  stop: () => void;
  dispose: () => void;
}

export type { MsuEngine };
