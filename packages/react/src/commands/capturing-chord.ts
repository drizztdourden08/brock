/* @layer renderer-shell @kind logic */
import { KEYMAP_ROOT } from './commands.constants';

const capturingChord = (target: EventTarget | null): boolean =>
  target instanceof Element && target.getAttribute('aria-pressed') === 'true' && target.closest(`[${KEYMAP_ROOT}]`) !== null;

export { capturingChord };
