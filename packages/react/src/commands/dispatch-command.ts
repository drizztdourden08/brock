/* @layer renderer-shell @kind logic */
import { findCommand } from './find-command';
import { isTyping } from './is-typing';
import { useCommandStore } from './useCommandStore';

const dispatchCommand = (event: KeyboardEvent, route: string | null): boolean => {
  const def = findCommand(event, useCommandStore.getState(), { route, typing: isTyping(event.target) });
  if (def === undefined) return false;
  event.preventDefault();
  def.run();
  return true;
};

export { dispatchCommand };
