/* @layer core @kind types */
import type { ArchipelagoSession, OnlineConnection } from '../../archipelago';
import type { ArchipelagoGame } from '../../contract/archipelago-game.type';
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import type { RandomizerLog } from '../../contract/randomizer-log.type';
import type { LocationPoller } from '../poller/location-poller.type';
import type { ApStateStore } from '../received/ap-state-store.type';
import type { ReceivedQueue } from '../received/received-queue.type';
import type { OnlineRun } from './online-run.type';

interface OnlineLate {
  client(): ArchipelagoSession;
  publishPlacement(placement: unknown | null): void;
  refuse(reason: string): void;
}

interface OnlineParts<P, A> {
  game: RandomizerGame<P, A>;
  ap: ArchipelagoGame<P, A>;
  log: RandomizerLog;
  run: OnlineRun<A>;
  poller: LocationPoller;
  store: ApStateStore;
  received: ReceivedQueue;
  link: { connection: OnlineConnection | null };
  late: OnlineLate;
  report(key: string): void;
}

export type { OnlineLate, OnlineParts };
