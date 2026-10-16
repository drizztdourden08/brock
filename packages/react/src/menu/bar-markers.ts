/* @layer renderer-shell @kind logic */
import { BAR_MARKERS, VIEW_MARKER_GROUP } from './menu-config.constants';
import type { BarMarker, MenuEntryOverride, MenuForest, MenuIssue, MenuNode } from './menu-config.type';
import { menuMoves } from './menu-moves';

const plantOne = (forest: MenuForest, marker: BarMarker, override: MenuEntryOverride | undefined): MenuNode | null => {
  if (override === undefined || forest.byKey.has(marker.key) || !marker.fields.some((field) => override[field] !== undefined)) return null;
  const node: MenuNode = { item: { key: marker.key, label: marker.label }, container: VIEW_MARKER_GROUP, override: {} };
  forest.nodes.push(node);
  forest.byKey.set(marker.key, node);
  menuMoves.attach(forest, node, VIEW_MARKER_GROUP);
  return node;
};

const plant = (forest: MenuForest, given: ReadonlyMap<string, MenuEntryOverride>): MenuNode[] =>
  BAR_MARKERS.flatMap((marker) => plantOne(forest, marker, given.get(marker.key)) ?? []);

const settle = (forest: MenuForest, nodes: readonly MenuNode[], issues: MenuIssue[]): void => {
  for (const node of nodes) {
    if (typeof node.container === 'string') continue;
    const list = forest.lists.get(node.container) ?? [];
    list.splice(list.indexOf(node), 1);
    const marker = BAR_MARKERS.find((candidate) => candidate.key === node.item?.key);
    if (marker === undefined) continue;
    issues.push({ key: marker.key, message: `${marker.ref} places ${marker.name} inside a submenu, but ${marker.name} sits at the top level of the menu, so it stays where the title bar puts it` });
  }
};

const barMarkers = { plant, settle };

export { barMarkers };
