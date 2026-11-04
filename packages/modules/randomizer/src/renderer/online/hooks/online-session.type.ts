/* @layer renderer-shell @kind types */
import type { ArchipelagoClient, OnlineConnection } from '../../../archipelago';
import type { RandomizerSession } from '../../../session/local/randomizer-session.type';

interface OnlineSessionView extends RandomizerSession {
  client?: ArchipelagoClient;
  reconnect?(connection: OnlineConnection): void;
}

export type { OnlineSessionView };
