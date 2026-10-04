/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { HubPage, HubSubPage, HubTab } from '../../../hub.type';

interface HubPageFrameProps {
  page: HubPage;
  tab: HubTab | null;
  sub: HubSubPage | null;
  route: string;
  onSelectTab: (id: string) => void;
  onUp: () => void;
  children: ReactNode;
}

export type { HubPageFrameProps };
