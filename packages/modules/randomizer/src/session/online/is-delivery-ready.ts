/* @layer core @kind logic */
import type { OnlineParts } from './online-parts.type';

const isDeliveryReady = <P, A>({ run, game }: OnlineParts<P, A>): boolean =>
  run.armed !== null && run.queue !== null && game.core.state().status === 'running';

export { isDeliveryReady };
