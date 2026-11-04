/* @layer renderer-shell @kind logic */
import type { IdValueShape } from './id-label.type';

const hexOf = (value: IdValueShape) => `0x${value.id.toString(16).toUpperCase().padStart(value.width, '0')}`;

const idLabel = (value: IdValueShape, hexIds: boolean): string => {
  if (!value.name) return hexOf(value);
  return hexIds ? `${value.name} (${hexOf(value)})` : value.name;
};

export { idLabel };
