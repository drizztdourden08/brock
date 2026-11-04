/* @layer core @kind types */
import type { ArchipelagoClient, OnlineConnection } from '../../archipelago';
import type { RandomizerSession } from '../local/randomizer-session.type';

interface OnlineSession extends RandomizerSession {
  client: ArchipelagoClient;
  reconnect(connection: OnlineConnection): void;
}

export type { OnlineSession };
