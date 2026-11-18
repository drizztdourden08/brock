/* @layer core @kind logic */
import type { Compiled } from './env.type';

const compilePound: Compiled = (env) => [env.pound ?? '#'];

export { compilePound };
