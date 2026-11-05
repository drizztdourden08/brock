/* @layer renderer-shell @kind types */
type LayerEditorFooterProps = {
  locked: boolean;
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onRevert: () => void;
};

export type { LayerEditorFooterProps };
