/* @layer renderer-shell @kind types */
import type { NoticeKind } from '../../../archipelago';
import type { CheckRow } from '../ChecksView/behavior/check-row.type';

interface CheckToastsProps {
  enabled?: boolean;
  duration?: number;
  quietMs?: number;
  noticeShown?: (kind: NoticeKind) => boolean;
  itemColor?: string;
  playerColor?: string;
}

interface CheckToastEntry {
  id: string;
  row: CheckRow;
}

export type { CheckToastEntry, CheckToastsProps };
