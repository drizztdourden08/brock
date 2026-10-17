/* @layer renderer-shell @kind logic */
import type { ProductMenu } from '@drizztdourden08/brock-core';
import { isRecord } from '../collections/is-record';
import type { MenuItem } from '../menu/menu.type';
import { WIDGETS_DEVELOPER_ENTRY, WIDGETS_DEVELOPER_KEY } from './widget.constants';

const configParent = (entries: ProductMenu['entries'], key: string): string | null | undefined => {
  const raw: unknown = isRecord(entries) ? entries[key] : undefined;
  const parent = isRecord(raw) ? raw.parent : undefined;
  return parent === null || typeof parent === 'string' ? parent : undefined;
};

const ownParent = (item: MenuItem): string | null | undefined => item.parent ?? (item.devOnly === true ? WIDGETS_DEVELOPER_KEY : undefined);

const inDeveloper = (item: MenuItem, entries: ProductMenu['entries']): boolean => {
  const given = configParent(entries, item.key);
  return (given === undefined ? ownParent(item) : given) === WIDGETS_DEVELOPER_KEY;
};

const arrangeWidgetMenu = (items: readonly MenuItem[], entries: ProductMenu['entries'], developerTools: boolean): MenuItem[] => {
  const developer: MenuItem[] = [];
  const rest: MenuItem[] = [];
  for (const item of items) {
    if (!inDeveloper(item, entries)) {
      rest.push(item);
      continue;
    }
    const { parent, ...inside } = item;
    developer.push(inside);
  }
  return developerTools && developer.length > 0 ? [...rest, { ...WIDGETS_DEVELOPER_ENTRY, children: developer }] : rest;
};

export { arrangeWidgetMenu };
