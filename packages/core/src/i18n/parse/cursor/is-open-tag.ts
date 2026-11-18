/* @layer core @kind logic */
import type { Cursor } from '../parse.type';
import { peek } from './peek';

const isOpenTag = (c: Cursor): boolean => peek(c) === '<' && /[A-Za-z]/.test(peek(c, 1));

export { isOpenTag };
