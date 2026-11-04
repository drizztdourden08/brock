/* @layer core @kind logic */
import { noticeOf } from '../messages/notice-of';
import type { OnlineNotice } from '../messages/notice.type';
import { playerPart } from '../messages/player-part';
import type { DeathLinkNotice } from './death-link.type';
import { deathLinkToastText } from './death-link-toast-text';

const deathLinkOnlineNotice = (notice: DeathLinkNotice): OnlineNotice => {
  const { name, text } = deathLinkToastText(notice);
  return noticeOf('deathLink', name ? [playerPart(name), { text }] : [{ text }]);
};

export { deathLinkOnlineNotice };
