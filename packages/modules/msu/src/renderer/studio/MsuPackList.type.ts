/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { MsuPackRow } from './msu.type';

interface MsuPackListProps {
  loading: boolean;
  packs: MsuPackRow[];
  selected: string | null;
  isInstalled: (name: string) => boolean;
  badge: (name: string) => ReactNode;
  onSelect: (name: string) => void;
  onDelete: (name: string) => void;
}

export type { MsuPackListProps };
