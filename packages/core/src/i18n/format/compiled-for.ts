/* @layer core @kind logic */
import type { Compiled } from './env.type';
import { compileMessage } from './compile-message';

const cache = new Map<string, Compiled>();

const compiledFor = (source: string, pseudo: string | null): Compiled => {
  const id = `${pseudo ?? ''}\u0000${source}`;
  const hit = cache.get(id);
  if (hit) return hit;
  const compiled = compileMessage(source, pseudo);
  cache.set(id, compiled);
  return compiled;
};

export { compiledFor };
