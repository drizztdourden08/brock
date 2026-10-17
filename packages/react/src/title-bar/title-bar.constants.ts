/* @layer renderer-shell @kind constants */
import type { TitleBarItemEntry } from './title-bar-item.type';

const NO_TITLE_BAR_ITEMS: readonly TitleBarItemEntry[] = [];

const VOLUME_RANGE = { min: 0, max: 1, step: 0.01 } as const;

export { NO_TITLE_BAR_ITEMS, VOLUME_RANGE };
