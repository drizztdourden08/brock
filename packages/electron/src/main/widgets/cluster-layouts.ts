/* @layer electron-main @kind logic */
import type { ClusterLayout } from './widget-windows.type';

const layouts = new Set<ClusterLayout>();

const clusterLayouts = {
  add: (layout: ClusterLayout): void => {
    layouts.add(layout);
  },
  remove: (layout: ClusterLayout): void => {
    layouts.delete(layout);
  },
  of: (id: string): ClusterLayout | null => [...layouts].find((layout) => layout.saved.has(id)) ?? null,
  all: (): ClusterLayout[] => [...layouts],
};

export { clusterLayouts };
