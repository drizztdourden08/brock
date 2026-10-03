/* @layer electron-main @kind logic */
import type { WidgetSnapLink } from '@drizztdourden08/brock-core';
import { tellMain } from './tell-main';
import { tellWindow } from './tell-window';
import type { WidgetWindowEntry } from './widget-windows.type';

const sameLink = (a: WidgetSnapLink | null, b: WidgetSnapLink | null): boolean => a?.to === b?.to && a?.edge === b?.edge;

const relink = (id: string, entry: WidgetWindowEntry, link: WidgetSnapLink | null): void => {
  if (sameLink(link, entry.link)) return;
  entry.link = link;
  tellMain(id, { link });
  tellWindow(entry);
};

export { relink };
