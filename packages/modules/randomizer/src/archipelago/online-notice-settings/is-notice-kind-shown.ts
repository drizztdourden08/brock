/* @layer core @kind logic */
import type { NoticeKind } from '../messages/notice.type';
import { noticeSettingKey } from './notice-setting-key';
import { ONLINE_NOTICE_DEFAULTS } from './online-notice-settings.constants';
import type { OnlineNoticeSettings } from './online-notice-settings.type';

const isNoticeKindShown = (settings: Partial<OnlineNoticeSettings> | null, kind: NoticeKind): boolean => {
  const key = noticeSettingKey(kind);
  return settings?.[key] ?? ONLINE_NOTICE_DEFAULTS[key];
};

export { isNoticeKindShown };
