/* @layer core @kind test */
import { createHash } from 'node:crypto';

const sha1Of = (bytes: Uint8Array): string => createHash('sha1').update(bytes).digest('hex').toUpperCase();

export { sha1Of };
