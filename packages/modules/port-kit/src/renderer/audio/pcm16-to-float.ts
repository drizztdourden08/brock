/* @layer renderer-shell @kind logic */
import { PCM16_SCALE } from './audio.constants';

const pcm16ToFloat = (heap: Uint8Array, pointer: number, count: number): Float32Array => {
  const view = new DataView(heap.buffer, heap.byteOffset + pointer, count * 2);
  const out = new Float32Array(count);
  for (let i = 0; i < count; i += 1) out[i] = view.getInt16(i * 2, true) / PCM16_SCALE;
  return out;
};

export { pcm16ToFloat };
