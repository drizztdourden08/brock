/* @layer core @kind logic */
import { SAFE_NAME } from './path-guard.constants';

const isSafeName = (name: string): boolean => SAFE_NAME.test(name) && !name.includes('..');

export { isSafeName };
