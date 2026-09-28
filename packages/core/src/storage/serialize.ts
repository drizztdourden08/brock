/* @layer core @kind logic */
import type { WriteJsonOptions } from './json.type';

const serialize = (data: unknown, opts: WriteJsonOptions): string =>
  JSON.stringify(data, null, 2) + (opts.trailingNewline ? '\n' : '');

export { serialize };
