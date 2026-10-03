/* @layer electron-main @kind logic */
import { liveEntries } from './live-entries';

const linkedTo = (anchor: string): string[] => {
  const found = new Set<string>();
  const queue = [anchor];
  for (let at = queue.shift(); at !== undefined; at = queue.shift()) {
    for (const [id, entry] of liveEntries()) {
      if (entry.link?.to !== at || id === anchor || found.has(id)) continue;
      found.add(id);
      queue.push(id);
    }
  }
  return [...found];
};

export { linkedTo };
