/* @layer renderer-shell @kind logic */
import { clearTextField } from '../../../escape/clear-text-field';
import { shellTakesEscape } from '../../../escape/shell-takes-escape';
import type { ShellKeyContext } from '../BrockApp.type';
import { closeTopmost } from './close-topmost';

const handleShellKey = (e: KeyboardEvent, context: ShellKeyContext): boolean => {
  if (e.key !== 'Escape') return false;
  if (!shellTakesEscape(e, context.escapes)) return true;
  if (clearTextField(e.target)) e.preventDefault();
  else closeTopmost(e, context);
  return true;
};

export { handleShellKey };
