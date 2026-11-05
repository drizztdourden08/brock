/* @layer renderer-shell @kind logic */
import type { SettingItem } from '@drizztdourden08/brock-react';
import { noticeSettingKey } from '../../../archipelago';
import type { NoticeKind } from '../../../archipelago';
import { NOTICE_ROW_COPY, NOTICE_WORDS } from '../online-settings.constants';

const noticeItem = (kind: NoticeKind): SettingItem => {
  const { label, description, keywords } = NOTICE_ROW_COPY[kind];
  return { key: noticeSettingKey(kind), label, description, keywords: `${NOTICE_WORDS} ${keywords}` };
};

export { noticeItem };
