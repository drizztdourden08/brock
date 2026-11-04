/* @layer core @kind types */
interface RandomizerModes {
  local: true;
}

type RandomizerModeId = keyof RandomizerModes;

export type { RandomizerModes, RandomizerModeId };
