/* @layer renderer-shell @kind logic */
import { activeZones } from './active-zones';
import { chordsOf } from './chords-of';
import type { CommandContext, CommandDef, CommandState, ParsedChord } from './command.type';
import { findCommand } from './find-command';
import { holding } from './holding';
import { isTyping } from './is-typing';
import { matchesChord } from './matches-chord';
import { parseChord } from './parse-chord';
import { startHold } from './start-hold';
import { useCommandStore } from './useCommandStore';

const chordOf = (def: CommandDef, event: KeyboardEvent, state: CommandState): ParsedChord | null => {
  const chord = chordsOf(def, state).find((each) => matchesChord(event, each, state.mac));
  return chord === undefined ? null : parseChord(chord, state.mac);
};

const pressHold = (def: CommandDef, event: KeyboardEvent, state: CommandState): void => {
  if (event.repeat || holding(def.id)) return;
  const chord = chordOf(def, event, state);
  const target = event.target instanceof Element ? event.target : null;
  const context: CommandContext = { point: { x: 0, y: 0 }, target, trigger: 'keyboard', data: undefined };
  if (chord !== null) startHold(def, context, chord, event);
  void def.run(context);
};

const dispatchCommand = (event: KeyboardEvent, route: string | null): boolean => {
  const state = useCommandStore.getState();
  const def = findCommand(event, state, { route, typing: isTyping(event.target), zones: activeZones() });
  if (def === undefined) return false;
  event.preventDefault();
  if (def.hold === undefined) void def.run();
  else pressHold(def, event, state);
  return true;
};

export { dispatchCommand };
