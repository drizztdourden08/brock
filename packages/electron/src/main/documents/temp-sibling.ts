/* @layer electron-main @kind logic */
import { randomBytes } from 'crypto';
import { basename, dirname, join } from 'path';

const tempSibling = (target: string): string => join(dirname(target), `.${basename(target)}.${randomBytes(6).toString('hex')}.brock-copy`);

export { tempSibling };
