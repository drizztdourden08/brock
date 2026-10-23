/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { HubLiveLists, LivePage } from '../../../hub.type';
import type { HubLiveEntry } from '../../Hub.type';

interface HubLiveSourcesProps {
  sources: readonly HubLiveEntry[];
  lists?: HubLiveLists;
  children: (lists: HubLiveLists) => ReactNode;
}

interface HubLiveNodeProps {
  entry: HubLiveEntry;
  children: (items: readonly LivePage[]) => ReactNode;
}

export type { HubLiveNodeProps, HubLiveSourcesProps };
