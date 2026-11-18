/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import { useText } from '@drizztdourden08/brock-react';
import { Box, Image, Text } from '@drizztdourden08/tessera/primitives';
import { useGlyphSourceStore } from '../../../renderer/useGlyphSourceStore';
import { glyphUrl } from '../behavior/glyph-url';
import { ActionBindingCell } from './ActionBindingCell';
import type { ActionBindingRowProps } from './ActionBindingRow.type';
import './ActionBindingRow.css';

const ActionBindingRow = ({ row, columns, middleLabel, labels, onRebind, onClear }: ActionBindingRowProps) => {
  const { action, cells } = row;
  const text = useText();
  const actionLabel = text(action.label);
  const sources = useGlyphSourceStore((state) => state.sources);
  const middleText = action.middleLabel ?? middleLabel ?? '';
  const middleIconSrc = action.glyph ? glyphUrl([action.glyph], sources) : null;
  const handleRebind = useCallback((slot: number) => onRebind(action.id, slot), [onRebind, action.id]);
  const handleClear = useCallback((mappingIndex: number) => onClear(action.id, mappingIndex), [onClear, action.id]);

  return (
    <Box className="action-row">
      <Text className="binding-row__action-label">{actionLabel}</Text>
      <Box className="action-row__middle">
        <Box className="binding-row__icon-slot">
          {middleIconSrc ? <Image src={middleIconSrc} alt={middleText} className="binding-row__icon-img" /> : null}
        </Box>
        <Text className="binding-row__middle-label">{middleText}</Text>
      </Box>
      {Array.from({ length: columns }, (_, slot) => (
        <ActionBindingCell
          key={slot}
          actionLabel={actionLabel}
          slot={slot}
          cell={cells[slot]}
          labels={labels}
          onRebind={handleRebind}
          onClear={handleClear}
        />
      ))}
    </Box>
  );
};

export { ActionBindingRow };
