/* @layer renderer-shell @kind logic */
import type { KeymapOverrides } from '@drizztdourden08/brock-core';

const isChordList = (value: unknown): value is readonly string[] => Array.isArray(value) && value.every((chord) => typeof chord === 'string');

const readKeymap = (value: unknown): KeymapOverrides => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, readonly string[]] => isChordList(entry[1])));
};

export { readKeymap };
