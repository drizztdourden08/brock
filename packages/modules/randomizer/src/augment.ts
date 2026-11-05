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

type RandomizerConnectionValues = Readonly<Record<string, unknown>>;

interface RandomizerTypeRegistry {}

type RandomizerProfileOptions = RandomizerTypeRegistry extends { options: infer O } ? O : RandomizerOptions;

type RandomizerFrozenSettings = RandomizerTypeRegistry extends { frozenSettings: infer F } ? F : object;

interface RandomizerProfileConfig extends ArchipelagoConnection {
  mode: RandomizerModeId;
  seed: string;
  options: RandomizerProfileOptions;
  frozenSettings?: RandomizerFrozenSettings;
  origin?: string;
  romFile?: string;
}

declare module '@drizztdourden08/brock-core/augment' {
  interface ProfileExtension {
    randomizer?: RandomizerProfileConfig;
  }
  interface ProfileCreateExtension {
    randomizer?: RandomizerProfileConfig;
    randomizerConnection?: RandomizerConnectionValues;
  }
  interface ProfilePatchExtension {
    randomizer?: RandomizerProfileConfig;
  }
}

export type {
  ArchipelagoConnection,
  RandomizerModes,
  RandomizerModeId,
  RandomizerConnectionValues,
  RandomizerTypeRegistry,
  RandomizerOptions,
  RandomizerProfileOptions,
  RandomizerFrozenSettings,
  RandomizerProfileConfig,
};
