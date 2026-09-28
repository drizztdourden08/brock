/* @layer renderer-shell @kind types */
import type { HubSearchHit } from '../../../hub.type';

interface HubSearchHitsProps {
  query: string;
  index: (query: string) => HubSearchHit[];
  onOpen: (hit: HubSearchHit) => void;
}

export type { HubSearchHitsProps };
