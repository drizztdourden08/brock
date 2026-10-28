/* @layer renderer-shell @kind logic */
import { hostApi } from '../../host/host-api';
import { ALIVE_PING_MS } from '../review.constants';

let lastPing = Number.NEGATIVE_INFINITY;

const reviewAlive = (force = false): void => {
  const now = performance.now();
  if (!force && now >= lastPing && now - lastPing < ALIVE_PING_MS) return;
  lastPing = now;
  hostApi()?.reviewAlive();
};

export { reviewAlive };
