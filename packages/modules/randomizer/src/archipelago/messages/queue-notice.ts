/* @layer core @kind logic */
import { admitNotice } from './admit-notice';
import type { NoticeEntry, QueueNoticeParams } from './notice-burst.type';

const queueNotice = (params: QueueNoticeParams): readonly NoticeEntry[] => {
  const { entries, notice, shown, now, nextId } = params;
  return shown === undefined || shown(notice.kind) ? admitNotice(entries, notice, now, nextId) : entries;
};

export { queueNotice };
