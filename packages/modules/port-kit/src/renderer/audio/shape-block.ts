/* @layer renderer-shell @kind logic */
import type { AudioAdapterOptions, SampleBlock } from './audio.type';
import { remixChannels } from './remix-channels';
import { resampleBlock } from './resample-block';

const shapeBlock = (block: SampleBlock, { sampleRate, channels }: AudioAdapterOptions): SampleBlock => {
  const resampled = sampleRate && sampleRate !== block.sampleRate ? resampleBlock(block, sampleRate) : block;
  if (!channels || channels === resampled.channels) return resampled;
  return { ...resampled, samples: remixChannels(resampled.samples, resampled.channels, channels), channels };
};

export { shapeBlock };
