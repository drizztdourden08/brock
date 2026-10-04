/* @layer electron-main @kind logic */
import type { WidgetSnapLink } from '@drizztdourden08/brock-core';
import { linkCluster } from './link-cluster';
import { oppositeEdge } from './opposite-edge';
import { relink } from './relink';
import { reroot } from './reroot';
import { widgetWindowControl } from './widget-window-control';
import { MAIN_ANCHOR } from './widget-windows.constants';

const hangOn = (id: string, link: WidgetSnapLink, free: boolean): boolean => {
  const entry = widgetWindowControl.entryOf(id);
  if (!entry?.snap || (free && entry.link !== null) || (!free && linkCluster(id).includes(MAIN_ANCHOR))) return false;
  if (!free) reroot(id);
  relink(id, entry, link);
  return true;
};

const joinCluster = (id: string, link: WidgetSnapLink): void => {
  if (linkCluster(id).includes(link.to)) return;
  const back = { to: id, edge: oppositeEdge(link.edge) };
  if (hangOn(id, link, true) || hangOn(link.to, back, true)) return;
  if (!hangOn(id, link, false)) hangOn(link.to, back, false);
};

export { joinCluster };
