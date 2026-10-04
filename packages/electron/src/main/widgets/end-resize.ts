/* @layer electron-main @kind logic */
import { applyResize } from './apply-resize';
import { boundsOf } from './bounds-of';
import { dropStaleLink } from './drop-stale-link';
import { liveEntries } from './live-entries';
import { memberOf } from './member-of';
import { resizeSession } from './resize-session';
import { sameBounds } from './same-bounds';
import type { ResizeSession } from './widget-windows.type';

const putBackIfCancelled = (session: ResizeSession): void => {
  const member = memberOf(session.id);
  if (!member || !sameBounds(boundsOf(member.win), session.start) || sameBounds(session.last, session.start)) return;
  applyResize(session, { bounds: session.start, moves: session.followers.map((f) => ({ id: f.id, bounds: f.start })) });
};

const endResize = (id: string): void => {
  const session = resizeSession.of(id);
  if (!session) return;
  resizeSession.close();
  putBackIfCancelled(session);
  const involved = new Set([session.id, ...session.followers.map((f) => f.id)]);
  for (const [other, entry] of liveEntries()) {
    if (!involved.has(other)) continue;
    entry.last = boundsOf(entry.win);
    entry.report.schedule();
  }
  for (const [other, entry] of liveEntries()) {
    if (involved.has(other) || (entry.link !== null && involved.has(entry.link.to))) dropStaleLink(other, entry, boundsOf(entry.win));
  }
};

export { endResize };
