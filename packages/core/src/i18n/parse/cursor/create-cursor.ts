/* @layer core @kind logic */
import type { Cursor } from '../parse.type';

const createCursor = (src: string): Cursor => ({ src, pos: 0 });

export { createCursor };
