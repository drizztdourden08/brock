/* @layer electron-main @kind logic */
const mergePathLists = (lists: readonly string[], separator: string, caseless: boolean): string => {
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const dir of lists.flatMap((list) => list.split(separator))) {
    const key = caseless ? dir.trim().toLowerCase() : dir.trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(dir.trim());
  }
  return merged.join(separator);
};

export { mergePathLists };
