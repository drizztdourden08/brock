/* @layer renderer-shell @kind logic */
import type { SampleBlock } from './audio.type';

const resampleBlock = (block: SampleBlock, sampleRate: number): SampleBlock => {
  const { samples, channels } = block;
  const frames = Math.floor(samples.length / channels);
  const outFrames = Math.floor((frames * sampleRate) / block.sampleRate);
  const out = new Float32Array(outFrames * channels);
  const step = block.sampleRate / sampleRate;
  for (let frame = 0; frame < outFrames; frame += 1) {
    const position = frame * step;
    const base = Math.floor(position);
    const next = Math.min(base + 1, frames - 1);
    const mix = position - base;
    for (let c = 0; c < channels; c += 1) {
      const a = samples[base * channels + c] ?? 0;
      const b = samples[next * channels + c] ?? 0;
      out[frame * channels + c] = a + (b - a) * mix;
    }
  }
  return { samples: out, channels, sampleRate };
};

export { resampleBlock };
