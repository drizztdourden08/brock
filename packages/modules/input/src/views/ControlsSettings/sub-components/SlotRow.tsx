/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import { Box, Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import { BindingRow } from './BindingRow';
import type { SlotRowProps } from './SlotRow.type';
import './SlotRow.css';

const SlotRow = ({ slot, assignment, labels, removeLabel, onRebind, onRemove }: SlotRowProps) => {
  const handleRebind = useCallback(() => onRebind(slot), [onRebind, slot]);
  const handleRemove = useCallback(() => onRemove(slot.index), [onRemove, slot.index]);
  return (
    <Box className="slot-row">
      <BindingRow
        actionLabel={slot.label}
        middleLabel={assignment}
        binding={slot.binding}
        bindingIcon={slot.icon}
        labels={labels}
        onRebind={handleRebind}
      />
      <IconButton variant="ghost" tone="danger" size="sm" label={removeLabel(slot.label)} onClick={handleRemove}>
        <Icon name="trash-2" />
      </IconButton>
    </Box>
  );
};

export { SlotRow };
