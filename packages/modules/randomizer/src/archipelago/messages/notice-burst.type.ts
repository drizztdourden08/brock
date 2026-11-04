/* @layer core @kind types */
import type { NoticeKind, OnlineNotice } from './notice.type';

interface NoticeEntry {
  id: string;
  notice: OnlineNotice;
  group: string;
  at: number;
  count: number;
}

interface QueueNoticeParams {
  entries: readonly NoticeEntry[];
  notice: OnlineNotice;
  shown?(kind: NoticeKind): boolean;
  now: number;
  nextId(): string;
}

export type { NoticeEntry, QueueNoticeParams };
