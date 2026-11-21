/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { SectionDef } from '@drizztdourden08/brock-react';
import { ONLINE_NOTICE_KINDS } from '../../../archipelago';
import { HIGHLIGHT_ROWS, ONLINE_SECTION_IDS, SESSION_ROWS } from '../online-settings.constants';
import { noticeItem } from './notice-item';

const onlineSettingsSections = (): SectionDef[] => [
  { id: ONLINE_SECTION_IDS.session, title: msg('randomizer:online.section.session'), items: SESSION_ROWS },
  { id: ONLINE_SECTION_IDS.notifications, title: msg('randomizer:online.section.notifications'), items: ONLINE_NOTICE_KINDS.map(noticeItem) },
  { id: ONLINE_SECTION_IDS.highlights, title: msg('randomizer:online.section.highlights'), items: HIGHLIGHT_ROWS },
];

export { onlineSettingsSections };
