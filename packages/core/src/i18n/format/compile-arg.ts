/* @layer core @kind logic */
import type { Compiled } from './env.type';
import { toText } from './to-text';

const compileArg = (name: string): Compiled => (env) => [toText(env.values[name])];

export { compileArg };
