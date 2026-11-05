/* @layer core @kind logic */
import { createNetworkFacts } from './facts';
import type { LifecycleControl, NetworkLifecycle } from './network-monitor.type';

const createLifecycle = (control: LifecycleControl): NetworkLifecycle => {
  const { facts, changed, forgetConnection, remember, now } = control;
  return {
    connecting() {
      facts.connection = 'connecting';
      if (facts.reconnectAttempt > 0) {
        facts.nextRetryAt = null;
        facts.retryInFlight = true;
      }
      changed();
    },
    opened(url, connection) {
      facts.url = url;
      remember(url, connection);
      changed();
    },
    retrying() {
      forgetConnection();
      facts.connection = 'reconnecting';
      facts.retryInFlight = false;
      changed();
    },
    scheduled(delayMs, attempt) {
      facts.reconnectAttempt = attempt;
      facts.nextRetryAt = now() + delayMs;
      facts.retryInFlight = false;
      changed();
    },
    refused() {
      forgetConnection();
      facts.connection = 'refused';
      changed();
    },
    closed() {
      forgetConnection();
      if (facts.connection !== 'refused' && facts.connection !== 'reconnecting') facts.connection = 'closed';
      changed();
    },
    stop() {
      forgetConnection();
      facts.connection = 'closed';
      changed();
    },
    reset() {
      forgetConnection();
      remember(null, null);
      Object.assign(facts, createNetworkFacts());
    },
  };
};

export { createLifecycle };
