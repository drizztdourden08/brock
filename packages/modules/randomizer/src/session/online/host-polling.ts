/* @layer core @kind logic */
import type { OnlineHost } from '../../archipelago';
import { beginPolling } from './begin-polling';
import type { OnlineParts } from './online-parts.type';

const hostPolling = <P, A>(parts: OnlineParts<P, A>): Pick<OnlineHost, 'startPolling' | 'pausePolling'> => ({
  startPolling() {
    if (parts.run.armed === null) {
      parts.run.pollWanted = true;
      return;
    }
    beginPolling(parts);
  },
  pausePolling() {
    parts.run.pollWanted = false;
    parts.poller.pause();
  },
});

export { hostPolling };
