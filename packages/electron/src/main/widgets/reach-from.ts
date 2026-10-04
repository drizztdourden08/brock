/* @layer electron-main @kind logic */
const reachFrom = (id: string, neighbours: (at: string) => readonly string[]): string[] => {
  const found = new Set([id]);
  const queue = [id];
  for (let at = queue.shift(); at !== undefined; at = queue.shift()) {
    const next = neighbours(at).filter((other) => !found.has(other));
    for (const other of next) found.add(other);
    queue.push(...next);
  }
  return [...found];
};

export { reachFrom };
