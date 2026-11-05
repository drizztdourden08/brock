/* @layer renderer-shell @kind logic */
const remixChannels = (samples: Float32Array, from: number, to: number): Float32Array => {
  const frames = Math.floor(samples.length / from);
  const out = new Float32Array(frames * to);
  for (let frame = 0; frame < frames; frame += 1) {
    let sum = 0;
    for (let c = 0; c < from; c += 1) sum += samples[frame * from + c] ?? 0;
    const mean = sum / from;
    for (let c = 0; c < to; c += 1) {
      out[frame * to + c] = from > to ? mean : (samples[frame * from + Math.min(c, from - 1)] ?? 0);
    }
  }
  return out;
};

export { remixChannels };
