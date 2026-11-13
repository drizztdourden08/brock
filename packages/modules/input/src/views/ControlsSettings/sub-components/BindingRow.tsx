/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { Box, Image, Text } from '@drizztdourden08/tessera/primitives';
import { useGlyphSourceStore } from '../../../renderer/useGlyphSourceStore';
import { glyphUrl } from '../behavior/glyph-url';
import { BindingValue } from './BindingValue';
import type { BindingRowProps } from './BindingRow.type';
import './BindingRow.css';

const BindingRow = (props: BindingRowProps) => {
  const { actionLabel, middleLabel, middleGlyph, binding, bindingIcon, deviceIconUrl, labels, onRebind, onClear } = props;
  const sources = useGlyphSourceStore((state) => state.sources);
  const middleIconSrc = middleGlyph ? glyphUrl([middleGlyph], sources) : null;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRebind(); }
  }, [onRebind]);

  return (
    <Box className="binding-row" role="button" tabIndex={0} title={labels.rebind(actionLabel)} onClick={onRebind} onKeyDown={handleKeyDown}>
      <Text className="binding-row__action-label">{actionLabel}</Text>
      <Box className="binding-row__rest">
        <Box className="binding-row__icon-slot">
          {middleIconSrc ? <Image src={middleIconSrc} alt={middleLabel ?? ''} className="binding-row__icon-img" /> : null}
        </Box>
        <Text className="binding-row__middle-label">{middleLabel ?? ''}</Text>
        <BindingValue binding={binding} bindingIcon={bindingIcon} deviceIconUrl={deviceIconUrl} clearLabel={labels.clear} onClear={onClear} />
      </Box>
    </Box>
  );
};

export { BindingRow };
