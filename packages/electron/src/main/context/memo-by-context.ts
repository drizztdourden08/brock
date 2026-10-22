/* @layer electron-main @kind logic */
import type { MainContext } from '../types/main-context.type';

const memoByContext = <C extends Pick<MainContext, 'files'>, T>(create: (ctx: C) => T): ((ctx: C) => T) => {
  const sharedByEveryContextCopy = new WeakMap<object, T>();
  return (ctx) => {
    const existing = sharedByEveryContextCopy.get(ctx.files);
    if (existing !== undefined) return existing;
    const created = create(ctx);
    sharedByEveryContextCopy.set(ctx.files, created);
    return created;
  };
};

export { memoByContext };
