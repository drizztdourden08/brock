/* @layer core @kind logic */
import type { MsuGameConfig, MsuHost } from '../config';
import { audibleLength } from './audible-length';
import { audioContext } from './audio-context';
import { CACHEABLE_SECONDS, PCM_FULL_SCALE } from './original-sound.constants';
import { originalSoundState } from './original-sound-state';
import type { OriginalSound } from './original-sound.type';
import { previewSeconds } from './preview-seconds';
import { soundKeyOf } from './sound-key';

const toAudioBuffer = (samples: Int16Array, sampleRate: number, frames: number): AudioBuffer => {
  const buffer = audioContext().createBuffer(2, Math.max(1, frames), sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  for (let i = 0; i < frames; i++) {
    left[i] = (samples[i * 2] ?? 0) / PCM_FULL_SCALE;
    right[i] = (samples[i * 2 + 1] ?? 0) / PCM_FULL_SCALE;
  }
  return buffer;
};

const loadOriginalSound = (
  host: MsuHost,
  config: MsuGameConfig<never>,
  target: string,
  soundId: number,
): OriginalSound | null => {
  const key = soundKeyOf(target, soundId);
  const cached = originalSoundState.cache.get(key);
  if (cached !== undefined) return cached;

  const seconds = previewSeconds(config, target);
  if (seconds === null) return null;
  const rendered = host.renderOriginalSound?.(target, soundId, seconds) ?? null;
  if (rendered === null) return null;

  const frames = audibleLength(rendered.samples);
  const sound: OriginalSound = {
    buffer: toAudioBuffer(rendered.samples, rendered.sampleRate, frames),
    audible: frames > 0,
  };
  if (frames <= CACHEABLE_SECONDS * rendered.sampleRate) originalSoundState.cache.set(key, sound);
  return sound;
};

export { loadOriginalSound };
