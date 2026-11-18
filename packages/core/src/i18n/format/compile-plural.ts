/* @layer core @kind logic */
import type { PluralNode } from '../parse/node.type';
import type { Compiled, NodesCompiler } from './env.type';
import { numberFormat } from '../intl-cache/number-format';
import { pluralRules } from '../intl-cache/plural-rules';
import { EMPTY } from './compile-plural.constants';
import { compileCases } from './compile-cases';
import { pick } from './pick-case';
import { toNumber } from './to-number';

const compilePlural = (node: PluralNode, compileNodes: NodesCompiler): Compiled => {
  const cases = compileCases(node.cases, compileNodes);
  return (env) => {
    const count = toNumber(env.values[node.name]);
    const adjusted = count - node.offset;
    const category = pluralRules(env.locale, node.ordinal).select(adjusted);
    const body = pick(cases, `=${count}`) ?? pick(cases, category) ?? pick(cases, 'other') ?? EMPTY;
    return body({ ...env, pound: numberFormat(env.locale).format(adjusted) });
  };
};

export { compilePlural };
