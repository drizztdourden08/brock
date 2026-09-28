/* @layer renderer-shell @kind logic */
import type { SampleBlock } from './audio.type';
import { MAX_QUEUE_S, SCHEDULE_LEAD_S } from './audio.constants';

const fillBuffer = (buffer: AudioBuffer, { samples, channels }: SampleBlock): void => {
  for (let channel = 0; channel < channels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < data.length; i += 1) data[i] = samples[i * channels + channel] ?? 0;
  }
};

const scheduleSamples = (context: AudioContext, target: AudioNode, block: SampleBlock, startAt: number): number => {
  const frames = Math.floor(block.samples.length / block.channels);
  if (frames === 0) return startAt;
  const now = context.currentTime;
  if (startAt - now > MAX_QUEUE_S) return startAt;
  const buffer = context.createBuffer(block.channels, frames, block.sampleRate);
  fillBuffer(buffer, block);
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(target);
  const at = Math.max(startAt, now + SCHEDULE_LEAD_S);
  source.start(at);
  return at + buffer.duration;
};

export { scheduleSamples };
