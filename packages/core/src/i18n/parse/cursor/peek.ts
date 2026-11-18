/* @layer core @kind logic */
import type { Cursor } from '../parse.type';

const peek = (c: Cursor, offset = 0): string => c.src.charAt(c.pos + offset);

export { peek };
