/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { placedWindows } from './placed-windows';
import { reachFrom } from './reach-from';
import { snapLinks } from './snap-links';
import { touches } from './touches';

const clusterOf = (id: string, from?: WidgetWindowBounds): string[] => {
  const placed = placedWindows();
  if (from) placed.set(id, from);
  const links = snapLinks.pairs();
  return reachFrom(id, (at) => {
    const own = placed.get(at);
    const touching = own ? [...placed].filter(([other, bounds]) => other !== at && touches(own, bounds)).map(([other]) => other) : [];
    return [...touching, ...snapLinks.around(links, at)];
  });
};

export { clusterOf };
