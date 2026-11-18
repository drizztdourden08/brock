/* @layer core @kind logic */
import type { ArgumentParser } from './parse.type';
import { readStyle } from './read-style';

const parseDate: ArgumentParser = (ctx, name) => ({ t: 'format', name, kind: 'date', style: readStyle(ctx.c) });

export { parseDate };
