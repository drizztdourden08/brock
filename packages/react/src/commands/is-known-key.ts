/* @layer renderer-shell @kind logic */
import { FUNCTION_KEY, KEY_TOKENS } from './commands.constants';

const NAMED_KEYS: ReadonlySet<string> = new Set(Object.values(KEY_TOKENS));

const isKnownKey = (key: string): boolean => key.length === 1 || FUNCTION_KEY.test(key) || NAMED_KEYS.has(key);

export { isKnownKey };
