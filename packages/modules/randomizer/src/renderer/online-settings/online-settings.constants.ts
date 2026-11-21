/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { SettingItemDef } from '@drizztdourden08/brock-react';
import type { NoticeKind } from '../../archipelago';
import type { NoticeRowCopy } from './online-settings.type';

const noticeCopy = (kind: NoticeKind): NoticeRowCopy => ({
  label: msg(`randomizer:online.notice.${kind}.label`),
  description: msg(`randomizer:online.notice.${kind}.description`),
  keywords: msg(`randomizer:online.notice.${kind}.keywords`),
});

const NOTICE_ROW_COPY: Readonly<Record<NoticeKind, NoticeRowCopy>> = {
  itemReceived: noticeCopy('itemReceived'),
  itemSent: noticeCopy('itemSent'),
  ownCheck: noticeCopy('ownCheck'),
  otherCheck: noticeCopy('otherCheck'),
  hintOwn: noticeCopy('hintOwn'),
  hintOther: noticeCopy('hintOther'),
  connection: noticeCopy('connection'),
  join: noticeCopy('join'),
  goal: noticeCopy('goal'),
  release: noticeCopy('release'),
  deathLink: noticeCopy('deathLink'),
  chat: noticeCopy('chat'),
};

const SESSION_ROWS: SettingItemDef[] = [
  {
    key: 'session.deathLink',
    label: msg('randomizer:online.session.deathLink.label'),
    description: msg('randomizer:online.session.deathLink.description'),
    hint: msg('randomizer:online.session.hint'),
    keywords: msg('randomizer:online.session.deathLink.keywords'),
  },
  {
    key: 'session.trackOtherPlayers',
    label: msg('randomizer:online.session.trackOtherPlayers.label'),
    description: msg('randomizer:online.session.trackOtherPlayers.description'),
    hint: msg('randomizer:online.session.hint'),
    keywords: msg('randomizer:online.session.trackOtherPlayers.keywords'),
  },
];

const HIGHLIGHT_ROWS: SettingItemDef[] = [
  {
    key: 'hudHighlightPrimary',
    label: msg('randomizer:online.highlight.primary.label'),
    description: msg('randomizer:online.highlight.primary.description'),
    keywords: msg('randomizer:online.highlight.primary.keywords'),
  },
  {
    key: 'hudHighlightSecondary',
    label: msg('randomizer:online.highlight.secondary.label'),
    description: msg('randomizer:online.highlight.secondary.description'),
    keywords: msg('randomizer:online.highlight.secondary.keywords'),
  },
];

const ONLINE_SECTION_IDS = { session: 'online-session', notifications: 'online-notifications', highlights: 'online-highlights' } as const;

export { HIGHLIGHT_ROWS, NOTICE_ROW_COPY, ONLINE_SECTION_IDS, SESSION_ROWS };
