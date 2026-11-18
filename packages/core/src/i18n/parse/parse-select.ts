/* @layer core @kind logic */
import type { ArgumentParser } from './parse.type';
import { expectChar } from './cursor';
import { parseCases } from './parse-cases';

const parseSelect: ArgumentParser = (ctx, name) => {
  expectChar(ctx.c, ',');
  return { t: 'select', name, cases: parseCases(ctx, ctx.pound) };
};

export { parseSelect };
