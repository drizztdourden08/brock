/* @layer core @kind logic */
import { claimName } from './claim-name';
import type { ApExportSource } from './export-source.type';
import type { ExportedItem } from './export.type';
import type { WorldKeys } from '../../world';

const exportItems = <K extends WorldKeys>(source: ApExportSource<K>): ExportedItem[] => {
  const items = Object.entries(source.itemIds).map(([key, id]): ExportedItem => {
    const name = source.itemNames[id];
    if (name === undefined) throw new Error(`item has no Archipelago name: ${key}`);
    return { key, id, name, classification: source.itemClass(key) };
  });
  const names = new Set<string>();
  for (const item of items) claimName(names, item.name, 'items');
  return items;
};

export { exportItems };
