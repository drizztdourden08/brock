/* @layer renderer-shell @kind constants */
import type { AppContext, AppContexts } from './contexts.type';

const DEFAULT_CONTEXT = 'default';
const INACTIVE_CONTEXT: AppContext = { active: false };
const INITIAL_CONTEXTS: AppContexts = { [DEFAULT_CONTEXT]: { active: true } };

export { DEFAULT_CONTEXT, INACTIVE_CONTEXT, INITIAL_CONTEXTS };
