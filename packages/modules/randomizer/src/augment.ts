/* @layer core @kind types */
import type { LobbySocketEvent } from './ipc/lobby-socket-event.type';
import type { RandomizerHostApi } from './ipc/randomizer-host-api.type';
import type { SaveArchipelagoFilesRequest, SaveArchipelagoFilesResult } from './ipc/save-files.type';
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
  interface InvokeContract {
    'randomizer:lobby-socket:open': (id: string, url: string) => Promise<void>;
    'randomizer:lobby-socket:send': (id: string, data: string) => Promise<void>;
    'randomizer:lobby-socket:close': (id: string) => Promise<void>;
    'randomizer:archipelago:save-files': (request: SaveArchipelagoFilesRequest) => Promise<SaveArchipelagoFilesResult>;
  }
  interface EventContract {
    'randomizer:lobby-socket:event': (event: LobbySocketEvent) => void;
  }
  interface IpcNamespaces {
    randomizer: RandomizerHostApi;
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
