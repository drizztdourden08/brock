/* @layer renderer-shell @kind component */
import { useCallback } from 'react';
import { Box, Icon, IconButton, Pressable, Text } from '@drizztdourden08/tessera/primitives';
import { cellLabelOf } from '../positional-capture/cell-label-of';
import { cellStateOf } from '../positional-capture/cell-state-of';
import { CELL_MARKS } from '../positional-capture/positional-capture.constants';
import type { PositionalCaptureCellProps } from './diagnostics-steps.type';
import './PositionalCaptureCell.css';

const PositionalCaptureCell = (props: PositionalCaptureCellProps) => {
  const { item, index, isCurrent, onSelect, onClear } = props;
  const state = cellStateOf(item.status, isCurrent);
  const answered = state === 'done' || state === 'skipped';
  const select = useCallback(() => onSelect(index), [onSelect, index]);
  const clear = useCallback(() => onClear(index), [onClear, index]);

  return (
    <Box as="li" className="pos-cell" data-state={state}>
      <Pressable
        className="pos-cell__main"
        onClick={select}
        aria-label={cellLabelOf(item.label, state, item.result)}
        aria-current={isCurrent ? 'step' : undefined}
      >
        <Box as="span" className="pos-cell__mark" aria-hidden="true"><Icon name={CELL_MARKS[state]} /></Box>
        <Box as="span" className="pos-cell__name">
          <Text as="span" className="pos-cell__label">{item.label}</Text>
          {item.kind === 'axis' && <Icon name="joystick" className="pos-cell__analog" />}
        </Box>
        <Text as="span" mono className="pos-cell__result">{answered ? item.result : ''}</Text>
      </Pressable>
      <Box as="span" className="pos-cell__clear">
        {answered && (
          <IconButton variant="ghost" tone="danger" size="xs" label={`Clear ${item.label}`} onClick={clear}>
            <Icon name="x" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export { PositionalCaptureCell };
