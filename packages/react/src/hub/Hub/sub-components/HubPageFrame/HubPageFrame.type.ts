/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { HubPage } from '../../../hub.type';

interface HubPageFrameProps {
  page: HubPage;
  children: ReactNode;
}

export type { HubPageFrameProps };
