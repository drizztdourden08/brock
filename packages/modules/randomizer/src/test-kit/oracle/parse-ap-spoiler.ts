/* @layer core @kind logic */
import { BYTE_ORDER_MARK } from './ap-spoiler.constants';
import type { ApSpoiler, SpoilerCursor } from './ap-spoiler.type';
import { readSpoilerLine } from './read-spoiler-line';

const parseApSpoiler = (text: string): ApSpoiler => {
  const parsed: ApSpoiler = { placements: new Map<string, string>(), spheres: [] };
  const cursor: SpoilerCursor = { section: '', sphere: null };
  const body = text.charCodeAt(0) === BYTE_ORDER_MARK ? text.slice(1) : text;
  for (const line of body.split(/\r?\n/)) readSpoilerLine(line, cursor, parsed);
  const { placements, spheres } = parsed;
  if (placements.size === 0 || spheres.length === 0) throw new Error('spoiler has no locations or no playthrough');
  return { placements, spheres };
};

export { parseApSpoiler };
