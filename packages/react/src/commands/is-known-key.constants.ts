/* @layer renderer-shell @kind logic */
import { KEY_TOKENS } from './commands.constants';

const NAMED_KEYS: ReadonlySet<string> = new Set(Object.values(KEY_TOKENS));

export { NAMED_KEYS };
