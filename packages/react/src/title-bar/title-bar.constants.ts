/* @layer renderer-shell @kind constants */
import { BROCK_COMMANDS } from '../commands/commands.constants';
import type { TitleBarItemEntry } from './title-bar-item.type';

const NO_TITLE_BAR_ITEMS: readonly TitleBarItemEntry[] = [];

const VOLUME_RANGE = { min: 0, max: 1, step: 0.01 } as const;

const STANDARD_ACTION_COMMANDS: Readonly<Record<string, string>> = { search: BROCK_COMMANDS.search };

export { NO_TITLE_BAR_ITEMS, STANDARD_ACTION_COMMANDS, VOLUME_RANGE };
