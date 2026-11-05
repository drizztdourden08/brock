/* @layer core @kind types */
import type { NetworkFacts } from './network-facts.type';
import type { Pinger } from './ping.type';
import type { Presence } from './presence.type';
import type { TrackerLinks } from './tracker-links.type';

interface NetworkStatusInput {
  facts: NetworkFacts;
  ping: Pick<Pinger, 'lastMs' | 'meanMs' | 'samples'>;
  trackers: Pick<TrackerLinks, 'progressOf'>;
  presence: Pick<Presence, 'onlineOf' | 'statusOf'>;
}

export type { NetworkStatusInput };
