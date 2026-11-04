/* @layer core @kind types */
interface EffectChain {
  input: AudioNode;
  output: AudioNode;
  dispose: () => void;
}

interface BiquadSpec {
  type: BiquadFilterType;
  frequency: number;
  gainDb?: number;
  q?: number;
}

export type { BiquadSpec, EffectChain };
