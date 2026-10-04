/* @layer renderer-shell @kind constants */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { QUIT_ENTRY } from '../../app/BrockApp/BrockApp.constants';
import type { TitleBarActionSource } from '../../modules/renderer-module.type';

const NO_ACTIONS: readonly WindowTitleBarAction[] = [];

const NO_ACTION_SOURCES: readonly TitleBarActionSource[] = [];

const LAST_GROUP_KEYS: readonly string[] = [QUIT_ENTRY.key];

const LAST_GROUP_ID = 'menu-end';

export { LAST_GROUP_ID, LAST_GROUP_KEYS, NO_ACTION_SOURCES, NO_ACTIONS };
