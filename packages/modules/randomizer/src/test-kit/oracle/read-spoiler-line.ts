/* @layer core @kind logic */
import { SECTION_HEADER } from './ap-spoiler.constants';
import type { ApSpoiler, SpoilerCursor } from './ap-spoiler.type';
import { readPlaythroughLine } from './read-playthrough-line';
import { spoilerEntryOf } from './spoiler-entry-of';

const readSpoilerLine = (line: string, cursor: SpoilerCursor, parsed: ApSpoiler): void => {
  const header = SECTION_HEADER.exec(line);
  if (header !== null && cursor.sphere === null) cursor.section = header[1] ?? '';
  else if (cursor.section === 'Locations') {
    const entry = spoilerEntryOf(line);
    if (entry !== null) parsed.placements.set(entry[0], entry[1]);
  } else if (cursor.section === 'Playthrough') cursor.sphere = readPlaythroughLine(line, parsed.spheres, cursor.sphere);
};

export { readSpoilerLine };
