/* @layer core @kind logic */
import type { CreateSocket } from '../../archipelago';
import type { ArchipelagoGame } from '../../contract/archipelago-game.type';

const socketFactoryOf = <P, A>(ap: ArchipelagoGame<P, A>): { createSocket?: CreateSocket } => {
  const create = ap.createSocket?.bind(ap);
  return create === undefined ? {} : { createSocket: create };
};

export { socketFactoryOf };
