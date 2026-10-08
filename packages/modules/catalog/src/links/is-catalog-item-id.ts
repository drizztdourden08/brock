/* @layer core @kind logic */
import { ITEM_ID, RESERVED_ID } from './catalog-links.constants';

const isCatalogItemId = (value: unknown): value is string => typeof value === 'string' && ITEM_ID.test(value) && !RESERVED_ID.test(value);

export { isCatalogItemId };
