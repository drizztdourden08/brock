/* @layer core @kind types */
interface ReceivedItem {
  index: number;
  item: number;
  location: number;
  player: number;
  flags: number;
  itemName: string;
  senderName: string;
}

interface ScoutedLocation {
  location: number;
  item: number;
  player: number;
  flags: number;
  itemName: string;
  gameName: string;
  locationKey: string;
}

interface ScoutedInput {
  seedName: string;
  slot: number;
  team: number;
  scouted: readonly ScoutedLocation[];
}

type SlotReading<P> =
  | { kind: 'ok'; deathLink: boolean; version?: string; placement(input: ScoutedInput): P }
  | { kind: 'malformed' }
  | { kind: 'version'; message: string };

interface OnlineConnection {
  url: string;
  fallbackUrl?: string;
  slotName: string;
  password?: string;
  deathLink: boolean;
  trackOtherPlayers: boolean;
}

type DeliverResult = 'delivered' | 'unknown' | 'not-ready';

type LinkKill = 'armed' | 'down' | 'unsupported';

interface OnlineHost {
  arm(): void;
  disarm(): void;
  armScouted(input: ScoutedInput): readonly number[];
  deliver(item: ReceivedItem): DeliverResult;
  cancelDeliveries(): void;
  onDeliveryReady(f: () => void): () => void;
  isFileInPlay(): boolean;
  onSaveSwap(f: () => void): () => void;
  goalReached(): boolean;
  startPolling(): void;
  pausePolling(): void;
  readCursor(): { index: number; roomHash: string } | null;
  writeCursor(c: { index: number; roomHash: string }): void;
  markCollected(locationIds: readonly number[]): void;
  setDeathLink(on: boolean): void;
  killLink(): LinkKill;
  onLinkDied(f: (cause: string) => void): () => void;
}

export type {
  DeliverResult,
  LinkKill,
  OnlineConnection,
  OnlineHost,
  ReceivedItem,
  ScoutedInput,
  ScoutedLocation,
  SlotReading,
};
