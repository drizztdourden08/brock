/* @layer core @kind types */
import type { NetworkFacts } from './network-facts.type';
import type { Pinger } from './ping.type';
import type { Presence } from './presence.type';

interface NetworkStatusInput {
  facts: NetworkFacts;
  ping: Pick<Pinger, 'lastMs'>;
  presence: Pick<Presence, 'onlineOf' | 'statusOf'>;
}

export type { NetworkStatusInput };
