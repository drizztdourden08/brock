/* @layer renderer-shell @kind types */
interface AudioOutput {
  context: AudioContext;
  node: AudioNode;
}

interface SampleBlock {
  samples: Float32Array;
  channels: number;
  sampleRate: number;
}

interface AudioAdapter {
  attachNode: (context: AudioContext, node: AudioNode) => void;
  pushSamples: (block: SampleBlock) => void;
  setVolume: (percent: number) => void;
  output: () => AudioOutput | null;
  suspend: () => void;
  resume: () => void;
  dispose: () => void;
}

export type { AudioOutput, SampleBlock, AudioAdapter };
