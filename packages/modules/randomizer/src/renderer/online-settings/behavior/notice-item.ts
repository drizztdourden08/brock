/* @layer renderer-shell @kind logic */
import type { SettingItemDef } from '@drizztdourden08/brock-react';
import { noticeSettingKey } from '../../../archipelago';
import type { NoticeKind } from '../../../archipelago';
import { NOTICE_ROW_COPY } from '../online-settings.constants';

const noticeItem = (kind: NoticeKind): SettingItemDef => ({ key: noticeSettingKey(kind), ...NOTICE_ROW_COPY[kind] });

export { noticeItem };
