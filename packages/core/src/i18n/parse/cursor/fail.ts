/* @layer core @kind logic */
import type { Cursor } from '../parse.type';

const fail = (c: Cursor, message: string): never => {
  throw new Error(`${message} at ${c.pos} in "${c.src}"`);
};

export { fail };
