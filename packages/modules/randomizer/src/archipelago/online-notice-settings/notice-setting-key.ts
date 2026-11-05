/* @layer core @kind logic */
import type { NoticeKind } from '../messages/notice.type';
import type { OnlineNoticeSettingKey } from './online-notice-settings.type';

const noticeSettingKey = (kind: NoticeKind): OnlineNoticeSettingKey =>
  `apNotify${kind.charAt(0).toUpperCase()}${kind.slice(1)}` as OnlineNoticeSettingKey;

export { noticeSettingKey };
