/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { HubPage, HubTab } from '../../../hub.type';

interface HubPageFrameProps {
  page: HubPage;
  tab: HubTab | null;
  onSelectTab: (id: string) => void;
  children: ReactNode;
}

export type { HubPageFrameProps };
