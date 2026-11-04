/* @layer core @kind logic */
import type { MsuChannelReport, MsuEngine, MsuResumeState, MusicCue } from '../types';
import { buildChannels } from './build-channels';
import { applyFade } from './fade';
import { createTitleReset } from './title-reset';
import { createEngineGains } from './engine-parts/create-engine-gains';
import { reportTrack } from './engine-parts/report-track';
import { restoreMsu } from './engine-parts/restore-msu';
import { snapshotMsu } from './engine-parts/snapshot-msu';
import type { MsuEngineOptions } from './msu-engine-options.type';
import { targetTrack } from './target-track';

const createMsuEngine = <Ctx = unknown>(options: MsuEngineOptions<Ctx>): MsuEngine<Ctx> => {
  const {
    ctx, destination, manifest, loadBytes, config, variant,
    musicVolume, sfxVolume, ambientVolume, resumeEnabled, resetAtTitle, onError, onReset,
    onTrack, onAmbient,
  } = options;

  const gains = createEngineGains(ctx, destination, {
    music: musicVolume, ambient: ambientVolume ?? musicVolume, sfx: sfxVolume ?? musicVolume,
  });

  const channels = buildChannels({
    ctx, musicOut: gains.musicGain, busOut: { ambient: gains.ambientGain, sfx: gains.sfxGain },
    soundChannels: config.soundChannels, manifest, loadBytes, resumeEnabled, onError, onTrack, onAmbient,
  });
  const { music, sounds } = channels;
  const bed = sounds.find((entry) => entry.config.kind === 'stateful')?.api;
  const all = [music, ...sounds.map((entry) => entry.api)];
  const titleReset = createTitleReset(channels, config.isTitleScene, resetAtTitle, onReset);

  let fadedToZero = false;

  const onMusicCtrl = (cue: MusicCue<Ctx>): void => {
    titleReset(cue.scene);
    const command = config.classifyMusic(cue.ctrl);
    if (command.kind === 'ignore') return;
    if (command.kind === 'fade') {
      fadedToZero = command.target === 0;
      applyFade(music.fadeNode, ctx.currentTime, command.target, command.step);
      return;
    }
    fadedToZero = false;
    music.trigger(targetTrack(config, variant, command.track, cue.context));
  };

  const isPlayingTrack = (cue: MusicCue<Ctx>): boolean => {
    const command = config.classifyMusic(cue.ctrl);
    if (fadedToZero || command.kind !== 'track') return false;
    return music.report()?.id === targetTrack(config, variant, command.track, cue.context);
  };

  const onGameSound = (channel: number, id: number, pan: number): void => {
    sounds.find((entry) => entry.config.coreIndex === channel)?.api.trigger(id, pan);
  };

  const reportChannel = (name: string): MsuChannelReport | null =>
    (name === 'music' ? music : sounds.find((entry) => entry.config.name === name)?.api)?.report() ?? null;

  const stop = (): void => { all.forEach((channel) => channel.stop()); };

  const dispose = (): void => {
    all.forEach((channel) => channel.dispose());
    gains.disconnect();
  };

  return {
    onMusicCtrl,
    onGameSound,
    isPlayingTrack,
    syncVolume: gains.sync,
    snapshot: () => snapshotMsu(music, bed),
    report: () => reportTrack(music),
    reportChannel,
    restore: (state: MsuResumeState | null) => restoreMsu(music, bed, state),
    stop,
    dispose,
  };
};

export { createMsuEngine };
