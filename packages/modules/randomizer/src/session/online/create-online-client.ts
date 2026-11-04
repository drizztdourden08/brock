/* @layer core @kind logic */
import { createArchipelagoClient } from '../../archipelago';
import type { ArchipelagoSession, OnlineHost } from '../../archipelago';
import type { OnlineParts } from './online-parts.type';
import { socketFactoryOf } from './socket-factory-of';

const createOnlineClient = <P, A>(parts: OnlineParts<P, A>, host: OnlineHost): ArchipelagoSession => {
  const { ap, received, run, log } = parts;
  return createArchipelagoClient({
    game: ap.name,
    host,
    received,
    slot: (raw) => ap.slot(raw),
    locationKeyOf: (id, name) => ap.locationKeyOf(id, name),
    placed: (placement) => {
      run.placement = placement;
    },
    order: (items) => ap.receivedOrder?.(items) ?? items,
    log: (line, level) => log(line, level),
    ...socketFactoryOf(ap),
    ...(ap.dataPackages === undefined ? {} : { cache: ap.dataPackages }),
  });
};

export { createOnlineClient };
