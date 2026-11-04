/* @layer core @kind types */
interface ApGameData {
  item_name_to_id: Record<string, number>;
  location_name_to_id: Record<string, number>;
  checksum?: string;
}

interface ApNetworkItem {
  item: number;
  location: number;
  player: number;
  flags: number;
}

interface ApVersion {
  major: number;
  minor: number;
  build: number;
  class: 'Version';
}

interface ApNetworkPlayer {
  team: number;
  slot: number;
  alias: string;
  name: string;
}

interface ApNetworkSlot {
  name: string;
  game: string;
  type: number;
  group_members: number[];
}

interface ApJsonMessagePart {
  type?: string;
  text?: string;
  color?: string;
  player?: number;
  flags?: number;
  hint_status?: number;
}

export type { ApGameData, ApJsonMessagePart, ApNetworkItem, ApNetworkPlayer, ApNetworkSlot, ApVersion };
