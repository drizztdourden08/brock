/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

type InfoValue = string | number | { id: number; width: number; name?: string };

interface InfoRow {
  label: string;
  value: InfoValue;
  mono?: boolean;
  spoiler?: boolean;
}

interface InfoBar {
  label: string;
  current: number;
  max: number;
}

interface InfoMember {
  name: string;
  badge?: string;
  level?: number;
  bars: InfoBar[];
}

interface InfoListItem {
  label: string;
  count?: number;
  group?: string;
  spoiler?: boolean;
}

interface InfoProgressItem {
  label: string;
  done: number;
  total: number;
  spoiler?: boolean;
}

interface RowsBlock {
  kind: 'rows';
  rows: InfoRow[];
}

interface MembersBlock {
  kind: 'members';
  members: InfoMember[];
}

interface ListBlock {
  kind: 'list';
  items: InfoListItem[];
  filters?: string[];
}

interface ProgressBlock {
  kind: 'progress';
  items: InfoProgressItem[];
}

type DescribedTone = 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'dim' | 'faint';

interface DescribedRow {
  label: string;
  value: string;
  description: string;
  tone?: DescribedTone;
  badge?: string;
}

interface DescribedBlock {
  kind: 'described';
  rows: DescribedRow[];
}

interface AppRenderedBlock {
  kind: 'custom';
  render: () => ReactNode;
}

type Block = RowsBlock | MembersBlock | ListBlock | ProgressBlock | DescribedBlock | AppRenderedBlock;

export type {
  Block, AppRenderedBlock, DescribedBlock, DescribedRow, DescribedTone, InfoBar, InfoListItem, InfoMember, InfoProgressItem, InfoRow, InfoValue, ListBlock, MembersBlock, ProgressBlock, RowsBlock,
};
