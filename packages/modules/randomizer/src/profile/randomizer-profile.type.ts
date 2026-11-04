/* @layer core @kind types */
import type { RandomizerModeId } from './randomizer-modes.type';

type RandomizerOptions = Record<string, unknown>;

interface RandomizerProfileConfig {
  mode: RandomizerModeId;
  seed: string;
  options: RandomizerOptions;
  frozenSettings?: Record<string, unknown>;
  origin?: string;
}

export type { RandomizerOptions, RandomizerProfileConfig };
