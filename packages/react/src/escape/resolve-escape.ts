/* @layer renderer-shell @kind logic */
import type { EscapeAction, EscapeState } from './escape.type';

const resolveEscape = (state: EscapeState): EscapeAction => {
  const { layerOpen, dialogOpen, screenOpen, homeAvailable } = state;
  if (layerOpen) return 'layer';
  if (dialogOpen) return 'dialog';
  if (screenOpen) return 'screen';
  return homeAvailable ? 'home' : 'none';
};

export { resolveEscape };
