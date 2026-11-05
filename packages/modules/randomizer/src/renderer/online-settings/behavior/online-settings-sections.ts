/* @layer renderer-shell @kind logic */
import type { Section } from '@drizztdourden08/brock-react';
import { ONLINE_NOTICE_KINDS } from '../../../archipelago';
import { HIGHLIGHT_ROWS, ONLINE_SECTION_IDS, SESSION_ROWS } from '../online-settings.constants';
import { noticeItem } from './notice-item';

const onlineSettingsSections = (): Section[] => [
  { id: ONLINE_SECTION_IDS.session, title: 'Session', items: SESSION_ROWS },
  { id: ONLINE_SECTION_IDS.notifications, title: 'Notifications', items: ONLINE_NOTICE_KINDS.map(noticeItem) },
  { id: ONLINE_SECTION_IDS.highlights, title: 'Message Highlights', items: HIGHLIGHT_ROWS },
];

export { onlineSettingsSections };
