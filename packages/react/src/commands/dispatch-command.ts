/* @layer renderer-shell @kind logic */
import { activeZones } from './active-zones';
import { findCommand } from './find-command';
import { isTyping } from './is-typing';
import { useCommandStore } from './useCommandStore';

const dispatchCommand = (event: KeyboardEvent, route: string | null): boolean => {
  const def = findCommand(event, useCommandStore.getState(), { route, typing: isTyping(event.target), zones: activeZones() });
  if (def === undefined) return false;
  event.preventDefault();
  void def.run();
  return true;
};

export { dispatchCommand };
