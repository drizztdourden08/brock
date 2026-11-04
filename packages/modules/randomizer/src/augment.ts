/* @layer core @kind types */
import type { RandomizerOptions } from './randomizer-options.type';

interface RandomizerModes {
  local: true;
}

type RandomizerModeId = keyof RandomizerModes;

interface RandomizerTypeRegistry {}


type RandomizerFrozenSettings = RandomizerTypeRegistry extends { frozenSettings: infer F } ? F : object;

interface RandomizerProfileConfig {
  mode: RandomizerModeId;
  seed: string;
  options: RandomizerOptions;
  frozenSettings?: RandomizerFrozenSettings;
  origin?: string;
}

declare module '@drizztdourden08/brock-core/augment' {
  interface ProfileExtension {
    randomizer?: RandomizerProfileConfig;
  }
  interface ProfileCreateExtension {
    randomizer?: RandomizerProfileConfig;
  }
  interface ProfilePatchExtension {
    randomizer?: RandomizerProfileConfig;
  }
}

export type {
  RandomizerModes,
  RandomizerModeId,
  RandomizerTypeRegistry,
  RandomizerOptions,
  RandomizerFrozenSettings,
  RandomizerProfileConfig,
};
