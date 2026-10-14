/* @layer renderer-shell @kind logic */
import type { PrecompiledCore } from './game-core.type';

const resolvePrecompiled = async (precompiled: PrecompiledCore | undefined): Promise<WebAssembly.Module | null> => {
  if (!precompiled) return null;
  return precompiled instanceof WebAssembly.Module ? precompiled : (await precompiled()) ?? null;
};

export { resolvePrecompiled };
