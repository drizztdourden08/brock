/* @layer electron-main @kind logic */
import { oppositeEdge } from './opposite-edge';
import { relink } from './relink';
import { widgetWindowEntries } from './widget-window-entries';
import type { PathStep } from './widget-windows.type';

const pathUp = (id: string): PathStep[] => {
  const path: PathStep[] = [];
  for (let at: string | undefined = id; at !== undefined && !path.some((step) => step.id === at);) {
    const entry = widgetWindowEntries.get(at);
    if (!entry) break;
    path.push({ id: at, entry, link: entry.link });
    at = entry.link?.to;
  }
  return path;
};

const reroot = (id: string): void => {
  const path = pathUp(id);
  for (let index = path.length - 1; index > 0; index -= 1) {
    const step = path[index];
    const below = path[index - 1];
    if (step && below?.link) relink(step.id, step.entry, { to: below.id, edge: oppositeEdge(below.link.edge) });
  }
  const own = path[0];
  if (own) relink(own.id, own.entry, null);
};

export { reroot };
