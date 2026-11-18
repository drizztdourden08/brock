/* @layer core @kind logic */
import type { LoadCtx, Loader } from './load-chain.type';
import { isPseudoLocale } from './locale/pseudo/is-pseudo-locale';

const startLoad = (ctx: LoadCtx, load: Loader, tag: string, required: boolean): Promise<void> => {
  const job = load(tag)
    .then((layers) => ctx.catalog.add(layers))
    .catch((error: unknown) => {
      ctx.pending.delete(tag);
      if (required) throw error;
    });
  ctx.pending.set(tag, job);
  return job;
};

const loadChain = async (ctx: LoadCtx, chain: readonly string[]): Promise<void> => {
  const { load } = ctx;
  if (!load) return;
  const wanted = chain.filter((tag) => !ctx.catalog.has(tag) && !isPseudoLocale(tag));
  await Promise.all(wanted.map((tag) => ctx.pending.get(tag) ?? startLoad(ctx, load, tag, tag === chain[0])));
};

export { loadChain };
