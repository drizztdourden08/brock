/* @layer renderer-shell @kind logic */
import type { ConfirmAlternate, DialogAlternate } from './dialog.type';
import { useDialogStore } from './useDialogStore';

const bindAlternate = (alternate: ConfirmAlternate | undefined, close: () => void): DialogAlternate | undefined => {
  if (!alternate) return undefined;
  const { label, onSelect, tone = 'neutral', closes = false } = alternate;
  return {
    label,
    tone,
    onSelect: () => {
      onSelect();
      if (!closes) return;
      useDialogStore.setState({ dialog: null });
      close();
    },
  };
};

export { bindAlternate };
