/* @layer renderer-shell @kind logic */
import { downKeys } from './down-keys';

const isKeyDown = (key: string): boolean => [...downKeys.values()].some((names) => names.includes(key));

export { isKeyDown };
