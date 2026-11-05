/* @layer renderer-shell @kind logic */
import type { AudioOutput } from './audio.type';

const describeSink = (sink: unknown): string => {
  if (typeof sink === 'string') return sink || 'default';
  if (sink && typeof sink === 'object' && 'type' in sink) return String(sink.type);
  return 'none';
};

const audioStateSnapshot = (output: AudioOutput): string => {
  const { context, node } = output;
  const gain = node instanceof GainNode ? node.gain.value : 'n/a';
  const sink = describeSink(Reflect.get(context, 'sinkId'));
  return `Audio ${context.state}, sampleRate ${context.sampleRate}, sinkId ${sink}, baseLatency ${context.baseLatency}, gain ${gain}`;
};

export { audioStateSnapshot };
