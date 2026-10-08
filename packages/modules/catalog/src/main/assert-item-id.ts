/* @layer electron-main @kind logic */
import { isCatalogItemId } from '../links/is-catalog-item-id';

const assertItemId = (itemId: unknown): string => {
  if (!isCatalogItemId(itemId)) throw new Error('That is not a catalogue item.');
  return itemId;
};

export { assertItemId };
