/* @layer renderer-shell @kind logic */
import type { Profile } from '@drizztdourden08/brock-core';
import type { RandomizerProfileConfig } from '../../../augment';
import { registeredArchipelia } from '../game/registered-archipelia';

const LOBBY_MODE = 'archipelia';

const defaultIsLobbyProfile = (config: RandomizerProfileConfig): boolean => {
  const mode: string = config.mode;
  return mode === LOBBY_MODE || config.origin === LOBBY_MODE;
};

const inLobby = (profile: Profile): boolean => {
  const config = profile.randomizer;
  if (config === undefined) return false;
  const test = registeredArchipelia()?.archipelia.isLobbyProfile ?? defaultIsLobbyProfile;
  return test(config);
};

export { inLobby };
