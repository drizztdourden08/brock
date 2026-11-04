/* @layer core @kind logic */
import type { MsuSoundChannel } from '../../config';
import { createSoundChannel } from '../channel';
import type { SoundChannelApi } from '../channel';
import type { BuildChannelsParams, BuiltChannels } from './build-channels.type';
import { SOUND_CACHE_LIMIT } from './build-channels.constants';
import { soundPrograms } from './sound-programs';

const buildChannels = (params: BuildChannelsParams): BuiltChannels => {
  const { ctx, musicOut, busOut, soundChannels, manifest, loadBytes, resumeEnabled, onError, onTrack, onAmbient } = params;
  const shared = { ctx, loadBytes, onError };

  const soundChannel = (config: MsuSoundChannel): SoundChannelApi => createSoundChannel({
    ...shared,
    destination: busOut[config.bus],
    name: config.name,
    kind: config.kind,
    programs: soundPrograms(manifest, config.name),
    cacheLimit: SOUND_CACHE_LIMIT,
    resumeEnabled: config.kind === 'stateful' ? resumeEnabled : undefined,
    onStart: config.kind === 'stateful' ? onAmbient : undefined,
  });

  const music = createSoundChannel({
    ...shared,
    destination: musicOut,
    name: 'music',
    kind: 'stateful',
    programs: manifest.tracks.map((track) => ({ id: track.trackNum, layers: track.layers })),
    resumeEnabled,
    restartOnRepeat: true,
    onStart: onTrack,
  });

  return { music, sounds: soundChannels.map((config) => ({ config, api: soundChannel(config) })) };
};

export { buildChannels };
