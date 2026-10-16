/* @layer renderer-shell @kind constants */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { ABOUT_ENTRY, CREDITS_ENTRY, QUIT_ENTRY } from '../../app/BrockApp/BrockApp.constants';
import type { TitleBarActionSource } from '../../modules/renderer-module.type';

const NO_ACTIONS: readonly WindowTitleBarAction[] = [];

const NO_ACTION_SOURCES: readonly TitleBarActionSource[] = [];

const LAST_GROUP_KEYS: readonly string[] = [CREDITS_ENTRY.key, ABOUT_ENTRY.key, QUIT_ENTRY.key];

const LAST_GROUP_ID = 'menu-end';

export { LAST_GROUP_ID, LAST_GROUP_KEYS, NO_ACTION_SOURCES, NO_ACTIONS };
