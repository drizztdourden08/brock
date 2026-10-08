/* @layer renderer-shell @kind logic */
import { clearTextField } from '../../../escape/clear-text-field';
import { shellTakesEscape } from '../../../escape/shell-takes-escape';
import { nav } from '../../../navigation/nav';
import { isShortcutsChord } from '../../../shortcuts-help/is-shortcuts-chord';
import { shortcutsHelp } from '../../../shortcuts-help/shortcuts-help';
import type { ShellKeyContext } from '../BrockApp.type';
import { closeTopmost } from './close-topmost';
import { isBackChord } from './is-back-chord';

const handleShellKey = (e: KeyboardEvent, context: ShellKeyContext): boolean => {
  if (e.altKey && e.key === 'Enter') {
    e.preventDefault();
    context.toggleFullscreen?.();
    return true;
  }
  if (isBackChord(e)) {
    if (nav.back()) e.preventDefault();
    return true;
  }
  if (e.key === 'Escape') {
    if (!shellTakesEscape(e, context.escapes)) return true;
    if (clearTextField(e.target)) e.preventDefault();
    else closeTopmost(e, context.home());
    return true;
  }
  if (!isShortcutsChord(e)) return false;
  e.preventDefault();
  shortcutsHelp.toggle();
  return true;
};

export { handleShellKey };
