/* @layer renderer-shell @kind constants */
import type { ResetFlags } from './screen-reset.type';

const ALL_PARTS: ResetFlags = { search: true, filters: true, tab: true, selection: true };

const TAB_KEY_PREFIX = 'tab:';

export { ALL_PARTS, TAB_KEY_PREFIX };
