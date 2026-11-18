/* @layer core @kind logic */
import type { Cursor } from '../parse.type';
import { peek } from './peek';

const isCloseTag = (c: Cursor): boolean => peek(c) === '<' && peek(c, 1) === '/';

export { isCloseTag };
