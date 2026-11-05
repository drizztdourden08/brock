/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import { BindingRow } from './BindingRow';
import type { ActionBindingRowProps } from './ActionBindingRow.type';

const ActionBindingRow = (props: ActionBindingRowProps) => {
  const { action, mappingIndex, binding, bindingIcon, deviceIconUrl, middleLabel, labels, onRebind, onClear } = props;
  const handleRebind = useCallback(() => onRebind(action.id), [onRebind, action.id]);
  const handleClear = useCallback(() => onClear(action.id, mappingIndex), [onClear, action.id, mappingIndex]);
  return (
    <BindingRow
      actionLabel={action.label}
      middleLabel={action.middleLabel ?? middleLabel}
      middleGlyph={action.glyph}
      binding={binding}
      bindingIcon={bindingIcon}
      deviceIconUrl={deviceIconUrl}
      labels={labels}
      onRebind={handleRebind}
      onClear={handleClear}
    />
  );
};

export { ActionBindingRow };
