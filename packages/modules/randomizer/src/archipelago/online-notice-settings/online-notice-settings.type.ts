/* @layer core @kind types */
import type { NoticeKind } from '../messages/notice.type';

type OnlineNoticeSettingKey = `apNotify${Capitalize<NoticeKind>}`;

type OnlineNoticeSettings = Record<OnlineNoticeSettingKey, boolean>;

export type { OnlineNoticeSettingKey, OnlineNoticeSettings };
