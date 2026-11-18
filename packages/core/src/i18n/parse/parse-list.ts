/* @layer core @kind logic */
import type { ArgumentParser } from './parse.type';
import { readStyle } from './read-style';

const parseList: ArgumentParser = (ctx, name) => ({ t: 'format', name, kind: 'list', style: readStyle(ctx.c) });

export { parseList };
