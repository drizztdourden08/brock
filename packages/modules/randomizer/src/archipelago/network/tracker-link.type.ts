/* @layer core @kind types */
import type { ArchipelagoSocket } from '../protocol/socket.type';

interface TrackerLinkConfig {
  url: string;
  name: string;
  password?: string;
  uuid: string;
  createSocket(url: string): ArchipelagoSocket;
  onChange(): void;
}

interface TrackerProgress {
  checked: number;
  total: number;
}

interface TrackerLink {
  readonly progress: TrackerProgress | null;
  readonly linked: boolean;
  close(): void;
}

export type { TrackerLink, TrackerLinkConfig, TrackerProgress };
