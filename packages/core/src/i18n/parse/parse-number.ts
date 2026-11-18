/* @layer core @kind logic */
import type { ArgumentParser } from './parse.type';
import { readStyle } from './read-style';

const parseNumber: ArgumentParser = (ctx, name) => ({ t: 'format', name, kind: 'number', style: readStyle(ctx.c) });

export { parseNumber };
