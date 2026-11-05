/* @layer core @kind types */
import type { PlatformArch, PlatformOs } from '@drizztdourden08/archipelia-lobby-protocol';

type LobbyPlatform = { os: PlatformOs; arch: PlatformArch };

type ClientInfoInput = { version: string; build?: string; signed?: boolean; platform: LobbyPlatform };

type LobbyClientIdentity = {
  id: string;
  name: string;
  homepage: string;
  unsignedId: string;
  unsignedName: string;
  shortName: string;
};

export type { ClientInfoInput, LobbyClientIdentity, LobbyPlatform };
