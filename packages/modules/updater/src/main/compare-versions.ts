/* @layer electron-main @kind logic */
const numericParts = (version: string): number[] =>
  (version.split('-')[0] ?? '').split('.').map((n) => parseInt(n, 10) || 0);

const releaseRank = (version: string): number => (version.includes('-') ? 0 : 1);

const compareVersions = (a: string, b: string): number => {
  const pa = numericParts(a);
  const pb = numericParts(b);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return releaseRank(a) - releaseRank(b);
};

export { compareVersions };
