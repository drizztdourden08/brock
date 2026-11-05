/* @layer core @kind logic */
import { deathLinkOnlineNotice } from '../../archipelago';
import type { OnlineNotice } from '../../archipelago';
import type { HarnessSession } from './harness-session.type';

const collectNotices = (session: HarnessSession): { notices: OnlineNotice[]; stop: () => void } => {
  const notices: OnlineNotice[] = [];
  const stop = session.client.onEvent((event) => {
    if (event.type === 'notice') notices.push(event.notice);
    if (event.type === 'death-link') notices.push(deathLinkOnlineNotice(event.notice));
  });
  return { notices, stop };
};

export { collectNotices };
