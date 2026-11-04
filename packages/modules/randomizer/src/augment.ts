/* @layer core @kind types */
import type { RandomizerOptions } from './randomizer-options.type';

interface RandomizerModes {
  local: true;
  online: true;
}

interface ArchipelagoConnection {
  serverUrl?: string;
  fallbackServerUrl?: string;
  slotName?: string;
  password?: string;
  deathLink?: boolean;
  trackOtherPlayers?: boolean;
}

type RandomizerModeId = keyof RandomizerModes;

interface RandomizerTypeRegistry {}


type RandomizerFrozenSettings = RandomizerTypeRegistry extends { frozenSettings: infer F } ? F : object;

interface RandomizerProfileConfig extends ArchipelagoConnection {
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
  ArchipelagoConnection,
  RandomizerModes,
  RandomizerModeId,
  RandomizerTypeRegistry,
  RandomizerOptions,
  RandomizerFrozenSettings,
  RandomizerProfileConfig,
};
