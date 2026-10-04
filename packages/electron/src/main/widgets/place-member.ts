/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import type { ClusterMember } from './widget-windows.type';

const placeMember = (member: ClusterMember, bounds: WidgetWindowBounds, report: boolean): void => {
  const { entry, win } = member;
  if (win.isDestroyed()) return;
  if (!entry) {
    win.setBounds(bounds);
    return;
  }
  entry.towed = true;
  win.setBounds(bounds);
  entry.last = bounds;
  entry.towed = false;
  if (report) entry.report.schedule();
};

export { placeMember };
