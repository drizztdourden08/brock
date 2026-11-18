/* @layer core @kind logic */
import type { ArgumentParser } from './parse.type';
import { readStyle } from './read-style';

const parseTime: ArgumentParser = (ctx, name) => ({ t: 'format', name, kind: 'time', style: readStyle(ctx.c) });

export { parseTime };
