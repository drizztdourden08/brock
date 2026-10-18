/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface HubSwitchProps {
  current: string;
  onSelect: (id: string) => void;
  status?: ReactNode;
}

export type { HubSwitchProps };
