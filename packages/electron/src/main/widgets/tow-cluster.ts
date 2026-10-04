/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { boundsOf } from './bounds-of';
import { clusterOf } from './cluster-of';
import { clusterTow } from './cluster-tow';
import { isMainNormal } from './is-main-normal';
import { memberOf } from './member-of';
import { moveSession } from './move-session';
import { placeMember } from './place-member';
import { sameBounds } from './same-bounds';
import { towLinked } from './tow-linked';

const shift = (id: string, dx: number, dy: number): void => {
  const member = memberOf(id);
  if (!member || (member.entry === null && !isMainNormal(member.win))) return;
  const at = boundsOf(member.win);
  placeMember(member, { ...at, x: at.x + dx, y: at.y + dy }, true);
};

const towCluster = (id: string, before: WidgetWindowBounds, after: WidgetWindowBounds): void => {
  if (sameBounds(before, after)) return;
  if (before.width !== after.width || before.height !== after.height) {
    towLinked(id, before, after);
    return;
  }
  const members = moveSession.of(id)?.members ?? new Set(clusterOf(id, before));
  clusterTow.run(() => {
    for (const other of members) if (other !== id) shift(other, after.x - before.x, after.y - before.y);
  });
};

export { towCluster };
