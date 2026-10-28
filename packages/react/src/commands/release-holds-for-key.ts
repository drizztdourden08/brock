/* @layer renderer-shell @kind logic */
import { activeHolds } from './active-holds';
import type { ParsedChord } from './command.type';
import { eventKeys } from './event-keys';
import { releaseHolds } from './release-holds';

const modifierLost = (chord: ParsedChord, event: KeyboardEvent): boolean =>
  (chord.ctrl && !event.ctrlKey) || (chord.alt && !event.altKey) || (chord.shift && !event.shiftKey) || (chord.meta && !event.metaKey);

const releaseHoldsForKey = (event: KeyboardEvent): void => {
  const ended = [...activeHolds].filter(([, entry]) => eventKeys(event).some((key) => entry.keys.includes(key)) || modifierLost(entry.chord, event));
  releaseHolds(ended.map(([id]) => id), 'keyup');
};

export { releaseHoldsForKey };
