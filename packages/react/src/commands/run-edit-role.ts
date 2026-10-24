/* @layer renderer-shell @kind logic */
import type { EditRole } from '@drizztdourden08/brock-core';
import { activeZones } from './active-zones';
import type { ChordEvent } from './command.type';
import { EDIT_CHORDS } from './edit-chords.constants';
import { findCommand } from './find-command';
import { isTyping } from './is-typing';
import { parseChord } from './parse-chord';
import { useCommandStore } from './useCommandStore';

const eventOf = (chord: string, mac: boolean): ChordEvent | null => {
  const parsed = parseChord(chord, mac);
  return parsed === null ? null : { key: parsed.key, code: '', ctrlKey: parsed.ctrl, altKey: parsed.alt, shiftKey: parsed.shift, metaKey: parsed.meta };
};

const runEditRole = (role: EditRole, route: string | null): boolean => {
  const state = useCommandStore.getState();
  const lookup = { route, typing: isTyping(document.activeElement), zones: activeZones() };
  for (const chord of EDIT_CHORDS[role][state.mac ? 'mac' : 'other']) {
    const event = eventOf(chord, state.mac);
    const def = event === null ? undefined : findCommand(event, state, lookup);
    if (def !== undefined) {
      def.run();
      return true;
    }
  }
  return false;
};

export { runEditRole };
