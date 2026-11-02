/* @layer electron-main @kind logic */
import type { MainContext } from '../types/main-context.type';
import { bootTimeout } from './boot-timeout';

const warnBootTimeout = (ctx: MainContext): void => {
  const { problem } = bootTimeout(ctx.flags);
  if (problem) ctx.log(problem, 'warn');
};

export { warnBootTimeout };
