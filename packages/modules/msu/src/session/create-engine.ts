/* @layer core @kind logic */
import { createMsuEngine } from '../player/create-msu-engine';
import type { MsuSessionOptions } from '../msu-session';
import type { MsuEngine } from '../types';

const createEngine = <Ctx>(
  ctx: AudioContext,
  destination: AudioNode,
  options: MsuSessionOptions<Ctx>,
): MsuEngine<Ctx> => createMsuEngine<Ctx>({
    ctx,
    destination,
    config: options.config,
    variant: options.variant,
    manifest: options.manifest,
    loadBytes: options.loadBytes,
    musicVolume: options.musicVolume,
    sfxVolume: options.sfxVolume,
    ambientVolume: options.ambientVolume,
    resumeEnabled: options.resumeEnabled,
    resetAtTitle: options.resetAtTitle,
    onError: (message) => options.log?.error(`[MSU] ${message}`),
    onReset: () => options.log?.info('[MSU] Back at the title. Bed and effects stopped, positions cleared'),
    onTrack: (trackNum, layerCount, resumed) =>
      options.log?.info(`[MSU] Track ${trackNum} playing with ${layerCount} layer(s)${resumed ? ', resumed' : ''}`),
    onAmbient: (soundId, layerCount, resumed) =>
      options.log?.info(`[MSU] Ambient ${soundId} playing with ${layerCount} layer(s)${resumed ? ', resumed' : ''}`),
  });

export { createEngine };
