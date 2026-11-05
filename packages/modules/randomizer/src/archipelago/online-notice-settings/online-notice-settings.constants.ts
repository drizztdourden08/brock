/* @layer core @kind constants */
import type { NoticeKind } from '../messages/notice.type';
import { noticeSettingKey } from './notice-setting-key';
import type { OnlineNoticeSettingKey, OnlineNoticeSettings } from './online-notice-settings.type';

const ONLINE_NOTICE_KINDS: readonly NoticeKind[] = [
  'itemReceived', 'itemSent', 'ownCheck', 'otherCheck', 'hintOwn', 'hintOther',
  'connection', 'join', 'goal', 'release', 'deathLink', 'chat',
];

const ONLINE_NOTICE_DEFAULTS: OnlineNoticeSettings = {
  apNotifyItemReceived: true,
  apNotifyItemSent: true,
  apNotifyOwnCheck: false,
  apNotifyOtherCheck: false,
  apNotifyHintOwn: true,
  apNotifyHintOther: false,
  apNotifyConnection: true,
  apNotifyJoin: false,
  apNotifyGoal: true,
  apNotifyRelease: true,
  apNotifyDeathLink: true,
  apNotifyChat: false,
};

const ONLINE_NOTICE_SETTING_KEYS: readonly OnlineNoticeSettingKey[] = ONLINE_NOTICE_KINDS.map(noticeSettingKey);

export { ONLINE_NOTICE_DEFAULTS, ONLINE_NOTICE_KINDS, ONLINE_NOTICE_SETTING_KEYS };
