/* @layer renderer-shell @kind logic */
import { isRecord } from '../collections/is-record';

const readPath = (settings: object, path: string): unknown =>
  path.split('.').filter((part) => part !== '').reduce<unknown>((at, part) => (isRecord(at) ? at[part] : undefined), settings);

export { readPath };
