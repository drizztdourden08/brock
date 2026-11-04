/* @layer core @kind logic */
import { createNetworkFacts } from './facts';
import type { LifecycleControl, NetworkLifecycle } from './network-monitor.type';

const createLifecycle = (control: LifecycleControl): NetworkLifecycle => {
  const { facts, changed, forgetConnection, remember } = control;
  return {
    connecting() {
      facts.connection = 'connecting';
      changed();
    },
    opened(url, connection) {
      facts.url = url;
      remember(url, connection);
      changed();
    },
    retrying() {
      facts.connection = 'reconnecting';
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
