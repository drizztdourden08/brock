/* @layer core @kind logic */
import type { Compiled } from './env.type';
import { toText } from './to-value';

const compileText = (value: string): Compiled => () => [value];

const compilePound: Compiled = (env) => [env.pound ?? '#'];

const compileArg = (name: string): Compiled => (env) => [toText(env.values[name])];

export { compileText, compilePound, compileArg };
