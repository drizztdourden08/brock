/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { UNBOUND } from '../../../bindings';
import { BindingValue } from './BindingValue';
import type { ActionBindingCellProps } from './ActionBindingCell.type';

const ActionBindingCell = ({ actionLabel, slot, cell, labels, onRebind, onClear }: ActionBindingCellProps) => {
  const mappingIndex = cell?.mappingIndex ?? -1;
  const handleRebind = useCallback(() => onRebind(slot), [onRebind, slot]);
  const handleClear = useCallback(() => onClear(mappingIndex), [onClear, mappingIndex]);
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRebind(); }
  }, [handleRebind]);

  return (
    <Box className="action-cell" role="button" tabIndex={0} title={labels.rebind(actionLabel)} onClick={handleRebind} onKeyDown={handleKeyDown}>
      <BindingValue
        binding={cell?.binding ?? UNBOUND}
        bindingIcon={cell?.icon}
        deviceIconUrl={cell?.deviceIconUrl}
        clearLabel={labels.clear}
        onClear={mappingIndex >= 0 ? handleClear : undefined}
      />
    </Box>
  );
};

export { ActionBindingCell };
