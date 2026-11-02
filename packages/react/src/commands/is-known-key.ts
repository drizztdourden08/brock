/* @layer renderer-shell @kind logic */
import { FUNCTION_KEY } from './commands.constants';
import { NAMED_KEYS } from './is-known-key.constants';

const isKnownKey = (key: string): boolean => key.length === 1 || FUNCTION_KEY.test(key) || NAMED_KEYS.has(key);

export { isKnownKey };
