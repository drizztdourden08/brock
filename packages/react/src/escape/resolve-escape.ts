/* @layer renderer-shell @kind logic */
import type { EscapeAction, EscapeState } from './escape.type';

const resolveEscape = (state: EscapeState): EscapeAction => {
  const { layerOpen, dialogOpen, screenOpen, reopenAvailable = false, homeAvailable } = state;
  if (layerOpen) return 'layer';
  if (dialogOpen) return 'dialog';
  if (screenOpen) return 'screen';
  if (reopenAvailable) return 'reopen';
  return homeAvailable ? 'home' : 'none';
};

export { resolveEscape };
