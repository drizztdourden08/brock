/* @layer renderer-shell @kind logic */
import type { HubPageList } from '../Hub.type';

const navPageCount = (list: Pick<HubPageList, 'pages' | 'homeListed'>): number => list.pages.length - (list.homeListed ? 0 : 1);

export { navPageCount };
