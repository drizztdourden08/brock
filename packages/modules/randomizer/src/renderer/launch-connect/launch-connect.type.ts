/* @layer renderer-shell @kind types */
import type { Profile } from '@drizztdourden08/brock-core';
import type { ApConnect } from '../../archipelago/launch-flags';
import type { RandomizerProfileConfig } from '../../augment';
import type { LobbyCheckOk } from '../archipelia/check/lobby-check.type';

type LaunchLogLevel = 'info' | 'error';

type LaunchConnectHost = {
  log: (message: string, level?: LaunchLogLevel) => void;
  lobbyProfilePrefix: string;
  onLobbyRefused?: (why: string, code?: string) => void;
  createOnlineProfile: (active: Profile, name: string, connect: ApConnect) => Promise<Profile | null>;
  createLobbyProfile: (active: Profile, name: string, check: LobbyCheckOk) => Promise<Profile | null>;
  repoint: (config: RandomizerProfileConfig, connect: ApConnect) => RandomizerProfileConfig;
};

type LaunchFlag<T> = { kind: 'absent' } | { kind: 'invalid' } | { kind: 'set'; value: T };

type FlagParse<T> = { ok: true; value: T } | { ok: false; error: string };

type LaunchMode = 'online' | 'archipelia';

type LaunchProfilePick =
  | { kind: 'use'; profile: Profile }
  | { kind: 'create'; name: string }
  | { kind: 'refuse'; why: string };

type ConnectionVerdict = 'connected' | 'failed' | 'cancelled' | 'timed-out';

type ConnectionSignal = 'active' | 'error' | 'pending';

type ConnectionWatch = {
  current: () => ConnectionSignal;
  subscribe: (listener: () => void) => () => void;
};

export type {
  ConnectionSignal,
  ConnectionVerdict,
  ConnectionWatch,
  FlagParse,
  LaunchConnectHost,
  LaunchFlag,
  LaunchLogLevel,
  LaunchMode,
  LaunchProfilePick,
};
