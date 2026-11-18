/* @layer core @kind logic */
import type { Cursor } from '../parse.type';

const atEnd = (c: Cursor): boolean => c.pos >= c.src.length;

export { atEnd };
