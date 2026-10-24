/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { PageBackdrop } from '../../../../screens/conventions/screens-config.type';
import type { HubPage, HubSubPage, HubTab } from '../../../hub.type';

interface HubPageFrameProps {
  page: HubPage;
  tab: HubTab | null;
  sub: HubSubPage | null;
  route: string;
  backdrop?: PageBackdrop;
  bare?: boolean;
  onSelectTab: (id: string) => void;
  onUp: () => void;
  children: ReactNode;
}

export type { HubPageFrameProps };
