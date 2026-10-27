/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { PositionalCaptureCell } from './PositionalCaptureCell';
import type { PositionalCaptureGridProps } from './diagnostics-steps.type';
import './PositionalCaptureGrid.css';

const PositionalCaptureGrid = (props: PositionalCaptureGridProps) => {
  const { items, activeIndex, inputPhaseActive, onSelect, onClear } = props;

  return (
    <Box as="ul" className="pos-grid" aria-label="Inputs to capture">
      {items.map((item, index) => (
        <PositionalCaptureCell
          key={item.id}
          item={item}
          index={index}
          isCurrent={inputPhaseActive && index === activeIndex}
          onSelect={onSelect}
          onClear={onClear}
        />
      ))}
    </Box>
  );
};

export { PositionalCaptureGrid };
