/* @layer electron-main @kind logic */
import { boundsOf } from './bounds-of';
import { flushLink } from './flush-link';
import { linkedTo } from './linked-to';
import { liveEntries } from './live-entries';
import { relink } from './relink';

const releaseLinks = (id: string, tell = true): void => {
  for (const [other, entry] of liveEntries()) {
    if (entry.link?.to !== id) continue;
    const next = entry.win.isDestroyed() ? null : flushLink(boundsOf(entry.win), new Set([id, other, ...linkedTo(other)]));
    if (tell) relink(other, entry, next);
    else entry.link = next;
  }
};

export { releaseLinks };
