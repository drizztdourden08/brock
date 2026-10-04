/* @layer renderer-shell @kind logic */
import type { TitleBarItemSource } from './title-bar-item.type';

const defineTitleBarItem = <T extends TitleBarItemSource>(source: T): T => source;

export { defineTitleBarItem };
