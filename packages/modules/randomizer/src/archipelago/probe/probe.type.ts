/* @layer core @kind types */
import type { ArchipelagoSocket } from '../protocol/socket.type';

type ProbeResult = { ok: true; url?: string; version?: string } | { ok: false; reason: string };

interface ProbeConfig {
  url: string;
  game?: string;
  createSocket?(url: string): ArchipelagoSocket;
}

export type { ProbeConfig, ProbeResult };
