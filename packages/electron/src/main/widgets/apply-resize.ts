/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { boundsOf } from './bounds-of';
import { memberOf } from './member-of';
import { sameBounds } from './same-bounds';
import type { ResizeSession, ResizeStep } from './widget-windows.type';

const place = (id: string, bounds: WidgetWindowBounds): void => {
  const member = memberOf(id);
  if (!member || sameBounds(boundsOf(member.win), bounds)) return;
  const { entry, win } = member;
  if (entry) entry.towed = true;
  win.setBounds(bounds);
  if (!entry) return;
  entry.last = boundsOf(win);
  entry.towed = false;
};

const applyResize = (session: ResizeSession, step: ResizeStep): void => {
  place(session.id, step.bounds);
  for (const move of step.moves) place(move.id, move.bounds);
  session.last = step.bounds;
};

export { applyResize };
