/* @layer renderer-shell @kind constants */
import type { NoticeKind } from '../../archipelago';
import type { NoticeRowCopy } from './online-settings.constants.type';

const NOTICE_WORDS = 'notification toast online archipelago';

const NOTICE_ROW_COPY: Readonly<Record<NoticeKind, NoticeRowCopy>> = {
  itemReceived: { label: 'Items Received', description: 'An item another player found for you.', keywords: 'received item from' },
  itemSent: { label: 'Items Sent', description: 'An item you found for another player.', keywords: 'sent item to' },
  ownCheck: { label: 'Your Own Items', description: 'An item you found for yourself.', keywords: 'own check found self' },
  otherCheck: { label: "Other Players' Items", description: 'An item passed between two other players, in any game.', keywords: 'other players checks items' },
  hintOwn: { label: 'Your Hints', description: 'A hint about your items or your locations.', keywords: 'hint' },
  hintOther: { label: 'Other Hints', description: 'A hint between other players.', keywords: 'hint others' },
  connection: { label: 'Connection', description: 'Connected, lost, reconnected or refused.', keywords: 'connection disconnect reconnect refused lost' },
  join: { label: 'Players Joining', description: 'A player joins or leaves the room.', keywords: 'join leave part players' },
  goal: { label: 'Goals', description: 'A player completes their goal.', keywords: 'goal complete finish' },
  release: { label: 'Release and Collect', description: 'A player releases or collects their remaining items.', keywords: 'release collect' },
  deathLink: { label: 'Deaths', description: 'A DeathLink death, received or sent.', keywords: 'deathlink death died' },
  chat: { label: 'Chat', description: 'Messages from players and the server.', keywords: 'chat message say server' },
};

const SESSION_ROWS = [
  { key: 'session.deathLink', label: 'DeathLink', description: 'Dying takes down the other DeathLink players, and their deaths take you down.', hint: 'The session reconnects to apply it.', keywords: 'deathlink death link die archipelago' },
  { key: 'session.trackOtherPlayers', label: 'Track Other Players', description: "Follow the other players' checks on the Network page.", hint: 'The session reconnects to apply it.', keywords: 'track other players checks tracker archipelago' },
];

const HIGHLIGHT_ROWS = [
  { key: 'hudHighlightPrimary', label: 'Highlight Primary', description: 'Item names in randomizer messages.', keywords: 'dialog highlight primary color colour item name randomizer message' },
  { key: 'hudHighlightSecondary', label: 'Highlight Secondary', description: 'Player names in randomizer messages.', keywords: 'dialog highlight secondary color colour player name randomizer multiworld message' },
];

const ONLINE_SECTION_IDS = { session: 'online-session', notifications: 'online-notifications', highlights: 'online-highlights' } as const;

export { HIGHLIGHT_ROWS, NOTICE_ROW_COPY, NOTICE_WORDS, ONLINE_SECTION_IDS, SESSION_ROWS };
