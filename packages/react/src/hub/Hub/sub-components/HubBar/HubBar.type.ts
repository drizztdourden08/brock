/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { HubDef } from '../../../hub.type';

interface HubBarProps {
  def: HubDef;
  subtitle?: ReactNode;
}

export type { HubBarProps };
