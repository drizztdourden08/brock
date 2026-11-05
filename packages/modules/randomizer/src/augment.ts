/* @layer core @kind types */
import type { LanDiscoverySettings, LanSighting } from './archipelago/lobby';
import type { FirewallStatus } from './ipc/lan-host-api.type';
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
    'randomizer:lan:start': (settings: LanDiscoverySettings) => Promise<void>;
    'randomizer:lan:stop': () => Promise<void>;
    'randomizer:lan:firewall-status': () => Promise<FirewallStatus>;
    'randomizer:lan:firewall-allow': () => Promise<FirewallStatus>;
  }
  interface EventContract {
    'randomizer:lobby-socket:event': (event: LobbySocketEvent) => void;
    'randomizer:lan:sighting': (sighting: LanSighting) => void;
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
