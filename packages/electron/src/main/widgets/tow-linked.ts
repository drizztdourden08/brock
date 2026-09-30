/* @layer electron-main @kind logic */
import { liveEntries } from './live-entries';
import { shiftBounds } from './shift-bounds';

const towLinked = (anchor: string, dx: number, dy: number, seen = new Set<string>()): void => {
  if (dx === 0 && dy === 0) return;
  for (const [id, entry] of liveEntries()) {
    if (entry.link?.to !== anchor || seen.has(id)) continue;
    seen.add(id);
    entry.towed = true;
    entry.last = shiftBounds(entry.last, dx, dy);
    entry.win.setBounds(entry.last);
    entry.towed = false;
    towLinked(id, dx, dy, seen);
  }
};

export { towLinked };
