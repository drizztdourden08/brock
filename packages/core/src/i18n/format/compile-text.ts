/* @layer core @kind logic */
import type { Compiled } from './env.type';

const compileText = (value: string): Compiled => () => [value];

export { compileText };
