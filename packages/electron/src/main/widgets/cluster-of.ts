/* @layer electron-main @kind logic */
import { liveEntries } from './live-entries';

const clusterOf = (id: string): string[] => {
  const links = liveEntries().filter(([, entry]) => !entry.closing).flatMap(([own, entry]) => (entry.link ? [[own, entry.link.to]] : []));
  const found = new Set([id]);
  const queue = [id];
  for (let at = queue.shift(); at !== undefined; at = queue.shift()) {
    const here = at;
    const next = links.filter((pair) => pair.includes(here)).flat().filter((other) => !found.has(other));
    for (const other of next) found.add(other);
    queue.push(...next);
  }
  return [...found];
};

export { clusterOf };
