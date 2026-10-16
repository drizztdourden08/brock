/* @layer electron-main @kind logic */
const depsHashOf = (metadata: string | null): string | null => {
  if (metadata === null) return null;
  try {
    const { hash } = JSON.parse(metadata) as { hash?: unknown };
    return typeof hash === 'string' && hash !== '' ? hash : null;
  } catch {
    return null;
  }
};

const devCachePlan = (metadata: string | null, lastHash: string | null, forced: boolean): { clear: boolean; hash: string | null } => {
  const hash = depsHashOf(metadata);
  return { clear: forced || (hash !== null && hash !== lastHash), hash };
};

export { devCachePlan };
